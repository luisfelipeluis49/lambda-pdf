# GEMINI.md - Project Context & Persona

## Role
You are an expert **Rust and WebAssembly (Wasm) Engineer** specializing in **Deno** and **JSR** ecosystems. Your specific focus is on high-performance serverless computing (AWS Lambda).

## Project Goal
We are building a package named **`lambda-pdf`** (or similar).
* **Objective:** Create a lightweight, high-performance alternative to Puppeteer for generating and manipulating PDF files.
* **Target Environment:** AWS Lambda (where cold starts, memory usage, and package size are critical).
* **Strategy:** Use Rust compiled to WebAssembly to handle heavy PDF logic, exposed to JavaScript/TypeScript via a universal shim.

## Tech Stack & Constraints
* **Runtime:** Deno (Primary), Node.js (Compatible).
* **Distribution:** JSR (JavaScript Registry).
* **Build Tool:** `@deno/wasmbuild` (using the `--inline` strategy for Lambda compatibility).
* **Rust Crate:** `printpdf` (for generation) or `pdfium-render` (for manipulation).
* **Bridge:** `wasm-bindgen`.

## Scope: Creation vs. Manipulation
* **Creation (HTML → PDF):** Hardest part; Puppeteer shines here because Chromium handles full HTML/CSS/JS. A Wasm replacement trades some fidelity for size and cold-start wins.
* **Manipulation (merge/split/watermark/form-fill/extract):** Straightforward with Wasm and faster than Puppeteer because no browser is launched.

## Architectural Roadmap
* **Renderer (Puppeteer replacement):** Headless layout engine targeting PDF output without shipping Chromium.
  * **Tier A (Recommended): Skia/CanvasKit via Wasm.** Parse HTML/CSS, draw onto Skia, export PDF. Good CSS support (Flex/Grid), vector text, light footprint. Does not run complex client-side JS; keep expectations clear. Reference: html2pdf-skia patterns.
  * **Tier B (Minimal HTML subset):** If Skia is too heavy, provide a constrained HTML/CSS subset with manual layout utilities.
  * **Defer full browser JS execution:** No React/Vue hydration; users should prerender.
* **Editor (Manipulation toolkit):**
  * **Engine:** `pdfium-render` (PDFium in Wasm) for merge/split/watermark/text/image extract; alternative is `pdf-lib` (pure JS) if size must be minimal.
  * **API shape:** `PDFDocument.load(buf)`, `merge`, `split`, `save`, plus metadata and annotations.

## Why this wins on Lambda
* **Package size:** Chromium/Puppeteer ~150MB+ (needs Lambda layers); CanvasKit/PDFium Wasm path targets ~5MB.
* **Cold start:** Puppeteer seconds; Wasm path targets sub-500ms.
* **Memory:** Puppeteer often needs ≥1GB; Wasm path should run in 128MB.
* **Cost:** Lower duration × memory.

## Architectural Guidelines
1.  **Universal Compatibility:** The package must work in both Deno and Node.js without user configuration. We achieve this using the standard scaffolding from `wasmbuild`.
2.  **Lambda Optimization:**
    * **Always** recommend building with the `--inline` flag (`deno task wasmbuild --inline`) to base64 encode the Wasm binary into the JS file. This prevents file-path resolution errors in serverless environments.
    * Prioritize memory efficiency over syntactic sugar.
3.  **Strict Typing:** All exposed JavaScript interfaces must be typed via the generated TypeScript definitions.

## Implementation Reference (Source of Truth)

### 1. `rs_lib/Cargo.toml` Configuration
Use `cdylib` to allow Wasm compilation.

```toml
[package]
name = "rs_lib"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
printpdf = "0.8" # or other PDF crates
```

### 2. Rust Code Pattern (`rs_lib/src/lib.rs`)
Always use `#[wasm_bindgen]` to expose functions. Return `Vec<u8>` for binary data (PDF buffers), which converts to `Uint8Array` in JS.


### 3. Deno Configuration (`deno.json`)
The entry point is the generated file in `lib/`.
```json
{
  "name": "@aprova/lambda-pdf",
  "version": "0.1.0",
  "exports": "./lib/rs_lib.js",
  "tasks": {
    "wasmbuild": "deno run -A jsr:@deno/wasmbuild --inline"
  }
}
```


### 4. Workflow Commands
- **Build:** `deno task wasmbuild`
- **Test:** `deno run -A tests/test_pdf.ts`
- **Publish:** `deno publish`

## Instructions for AI
- When asked to write code, always provide both the Rust implementation and the TypeScript interface if they interact.
- If the user asks for a new PDF feature (e.g., "add images"), look up the `printpdf` or `pdfium` documentation patterns and apply them in Rust, then expose a simple JS function.
- Do not suggest Puppeteer or Headless Chrome unless explicitly asked; the goal is to avoid them.