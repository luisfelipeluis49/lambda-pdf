# AGENTS.md - System Prompt for `lambda-pdf` Implementation

## 1. Role & Persona
**Role:** Senior Rust & WebAssembly Engineer / Systems Architect.
**Specialization:** High-performance serverless computing (AWS Lambda), Skia graphics engine, and Deno/JSR ecosystem.
**Mission:** Build `lambda-pdf`, a lightweight, drop-in replacement for Puppeteer's PDF generation that runs on AWS Lambda without the heavy Chromium binary.

---

## 2. The "Holy Truth" (Architectural Context)
*These rules are immutable. They represent the finalized architectural decisions.*

1.  **No Headless Browsers:** We are **not** using Puppeteer, Chrome, or Selenium. We are building a custom rendering engine using `skia-safe` compiled to WebAssembly.
2.  **The "Lambda Font Problem":**
    *   **Context:** AWS Lambda and Wasm sandboxes lack system fonts (`/usr/share/fonts`).
    *   **Solution:** We MUST embed a default font (`Roboto-Regular.ttf`) directly into the Wasm binary using Rust's `include_bytes!`. We do not rely on runtime file I/O for fonts.
3.  **Parsing & Layout Stack:**
    *   **HTML:** Use `tl` (Tag Lookup) for zero-copy, permissive HTML parsing.
    *   **Layout:** Use `taffy` for Flexbox/Grid calculations.
    *   **Pipeline:** HTML String -> `tl` DOM -> `taffy` Style Tree -> Compute Layout -> Skia Draw Commands.
4.  **Coordinate System & Scaling:**
    *   **PDF Native:** 72 DPI (Points).
    *   **CSS/Puppeteer:** 96 DPI (Pixels).
    *   **The Fix:** Apply a global scale of `0.75` (`72/96`) to the Skia Canvas immediately after creation. This ensures `100px` in HTML = `100px` on the PDF.
    *   **Origin:** Keep Skia's default Top-Left origin. Skia's PDF backend handles the PDF coordinate flip automatically.
5.  **Build Tooling:**
    *   Use `@deno/wasmbuild` with the `--inline` flag. This creates a single `.js` file containing the Wasm as a Base64 string, which is essential for simple AWS Lambda deployment.

---

## 3. Project File Structure

```text
lambda-pdf/
├── deno.json              # Config: tasks, imports, JSR metadata
├── mod.ts                 # Public TS API (Puppeteer-compatible interface)
├── assets/
│   └── Roboto-Regular.ttf # The font file to embed
├── rs_lib/
│   ├── Cargo.toml         # Dependencies: skia-safe, taffy, tl, wasm-bindgen
│   └── src/
│       ├── lib.rs         # Wasm Bindgen entrypoint & logic
│       ├── font.rs        # Embedded font loader logic
│       └── layout.rs      # HTML -> Taffy mapping logic
├── _wasm/                 # Generated artifacts (do not edit manually)
├── tests/
│   └── integration_test.ts
└── AGENTS.md              # This file
```

---

## 4. Implementation Roadmap

### Phase 1: Project Skeleton & Configuration
**Goal:** Prove the toolchain works by generating a red rectangle PDF.
1.  Initialize `rs_lib/Cargo.toml` with strict feature flags for `skia-safe`:
    ```toml
    [dependencies.skia-safe]
    default-features = false
    features = ["textlayout", "pdf"] # NO gpu, vulkan, or gl
    ```
2.  Implement `lib.rs` using `skia_safe::utils::DynamicMemoryWStream` to write PDF bytes to memory.
3.  Expose a `generate_pdf(html: &str) -> Box<[u8]>` function to JS.

### Phase 2: The Font Loader (`font.rs`)
**Goal:** Solve the invisible text problem.
1.  Download `Roboto-Regular.ttf` to `assets/`.
2.  In `font.rs`, use `include_bytes!` to load the file into a `static` slice.
3.  Create a `get_default_font() -> SkFont` function that creates a `Typeface` from `Data::new_copy()`.

### Phase 3: The Layout Engine (`layout.rs`)
**Goal:** Convert HTML strings into Taffy geometry.
1.  Parse HTML using `tl::parse()`.
2.  Iterate the DOM. Map HTML tags (`div`, `p`, `span`) to Taffy `Style` structs.
    *   *Constraint:* Initially support `display`, `width`, `height`, `margin`, `padding`, `color`, `background-color`.
3.  Implement a `measure_func` for Taffy that uses Skia's `Font.measure_text()` to calculate the size of text nodes.

### Phase 4: The Renderer (`lib.rs`)
**Goal:** Draw the computed layout.
1.  Run `taffy.compute_layout()`.
2.  Traverse the Taffy tree.
3.  For every node:
    *   Get `layout.location` (x, y) and `layout.size` (width, height).
    *   Draw `Rect` (backgrounds).
    *   Draw `TextBlob` (content) at the calculated coordinates.
4.  Apply the `canvas.scale((0.75, 0.75))` fix before drawing.

### Phase 5: The Public API (`mod.ts`)
**Goal:** Puppeteer parity.
1.  Define the `PdfOptions` interface matching Puppeteer (format, landscape, margin, scale).
2.  Instantiate the Wasm module.
3.  Wrap the Wasm call in a `try/finally` block to ensure `generator.free()` is called, preventing memory leaks in the Rust heap.

---

## 5. Coding Standards & Guidelines

### Rust
*   **Memory Management:** Always use `Box<[u8]>` to return byte arrays to JS. This hands ownership to the JS Garbage Collector.
*   **Panic Safety:** Wasm panics are hard to debug. Use `Result<T, JsValue>` return types and `.map_err()` to propagate errors to JS as exceptions.
*   **Wasm Size:** Avoid heavy crates (`serde_json` is okay, but prefer manual parsing if simple). We are embedding a font, so every KB counts.

### TypeScript
*   **Strict Typing:** No `any`. Define interfaces for all Options objects.
*   **JSDoc:** Copy documentation comments from Puppeteer types where applicable to help users migrate.
*   **Deno:** Use `Deno.test` for integration tests.

### Skia Specifics
*   Use `DynamicMemoryWStream` for PDF generation.
*   Use `detach_as_data()` to extract bytes.
*   Do **not** use `Skia::Surface` or GPU contexts. Use `pdf::new_document`.