use skia_safe::{
    pdf, Document, Canvas, Paint, Color, Font, Point, Rect, Typeface,
};

/// Generates a PDF document using Skia, drawing a greeting and some shapes.
///
/// # Arguments
/// * `name` - The name to include in the greeting.
/// * `font_data` - A byte slice representing the `.ttf` font file.
///
/// # Returns
/// A `Result` containing the PDF bytes as a `Vec<u8>` or an error `String`.
pub fn generate_skia_pdf_bytes(name: &str, font_data: &[u8]) -> Result<Vec<u8>, String> {
    let mut pdf_bytes = Vec::new();
    {
        // This scope ensures the Document is closed and the bytes are finalized
        // before the function returns the `pdf_bytes` vector.

        // 1. Create a PDF document that writes to our byte vector.
        let mut document = pdf::new_document(&mut pdf_bytes)
            .ok_or("Failed to create PDF document")?;

        // 2. Begin a new page. A4 size is 595x842 points.
        let mut canvas = document.begin_page((595.0, 842.0), None);

        // 3. Set up paints for different drawing operations.
        let mut background_paint = Paint::default();
        background_paint.set_color(Color::WHITE);

        let mut text_paint = Paint::default();
        text_paint.set_color(Color::new(0xFF_0d1c2c)); // Dark blue/gray
        text_paint.set_anti_alias(true);

        let mut accent_paint = Paint::default();
        accent_paint.set_color(Color::new(0xFF_0079d3)); // A nice blue

        // 4. Load the font data into a Skia Typeface.
        let typeface = Typeface::from_data(font_data, None)
            .ok_or("Failed to create Typeface from font data")?;

        // 5. Draw content onto the canvas.
        canvas.draw_rect(Rect::from_wh(595.0, 842.0), &background_paint);

        // Draw the greeting text.
        let greeting = format!("Hello, {}!", name);
        let font = Font::from_typeface(&typeface, 32.0);
        canvas.draw_str(greeting, Point::new(50.0, 100.0), &font, &text_paint);

        // Draw a subtext.
        let subtext = "This PDF was generated with Rust, Wasm, and Skia-safe.";
        let font = Font::from_typeface(&typeface, 14.0);
        canvas.draw_str(subtext, Point::new(50.0, 125.0), &font, &text_paint);

        // Draw a decorative rectangle.
        canvas.draw_rect(Rect::from_xywh(50.0, 150.0, 495.0, 5.0), &accent_paint);

        // 6. Finalize the page and the document.
        document.end_page();
        document.close();
    }

    Ok(pdf_bytes)
}
