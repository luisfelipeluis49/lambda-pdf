mod creation;
mod manipulation;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

/// Creates a PDF document with a custom greeting using the Skia engine.
///
/// This is the primary function exposed to the JavaScript/TypeScript world.
#[wasm_bindgen]
pub fn create_pdf(name: &str, font_data: &[u8]) -> Result<Vec<u8>, JsValue> {
    // Call the internal creation logic and map any Rust error into a JS error.
    creation::generate_skia_pdf_bytes(name, font_data)
        .map_err(|e| JsValue::from_str(&e))
}
