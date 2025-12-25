import { create_pdf } from "../lib/rs_lib.js";
import { assertEquals } from "jsr:@std/assert";

// 1. Load a font file.
// Make sure you have a .ttf font available in your project.
const fontData = await Deno.readFile("./fonts/Roboto-Regular.ttf");

// 2. Call the Wasm function with the name and font data.
const name = "Gemini";
const pdfBytes = create_pdf(name, fontData);

// 3. Save the output to a file to verify it.
await Deno.writeFile("output-skia-safe.pdf", pdfBytes);

// Basic validation
assertEquals(pdfBytes.length > 0, true, "PDF buffer should not be empty.");
