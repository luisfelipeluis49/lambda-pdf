use wasm_bindgen::prelude::*;
use skia_safe::{
    pdf,
    Color,
    Font,
    Paint,
    Point,
    Rect,
};

#[wasm_bindgen]
pub struct PdfGenerator {
    // Configuration state
    config: PdfConfig,
}

struct PdfConfig {
    width: f32,
    height: f32,
    margins: Margins,
    scale: f32,
}

struct Margins {
    top: f32,
    bottom: f32,
    left: f32,
    right: f32,
}

// Internal Representation of the DOM after parsing `tl` output
struct LayoutNode {
    tag: String,
    style: ComputedStyle,
    children: Vec<LayoutNode>,
    // Text content if text node
    text: Option<String>, 
}

struct ComputedStyle {
    font_size: f32,
    color: Color,
    // Dimensions calculated by Taffy
    layout_rect: Rect, 
}

// --- Implementation ---

#[wasm_bindgen]
impl PdfGenerator {
    #[wasm_bindgen(constructor)]
    pub fn new() -> PdfGenerator {
        // Defaults matching Puppeteer "Letter"
        PdfGenerator {
            config: PdfConfig {
                width: 612.0,
                height: 792.0,
                scale: 1.0,
                margins: Margins {
                    top: 5.0,
                    bottom: 5.0,
                    left: 5.0,
                    right: 5.0,
                },
            },
        }
    }

    /// Main entry point. 
    /// In the real version, this will parse the HTML string.
    /// For now, it ignores HTML and draws a Proof of Concept.
    pub fn generate(&self, _html: &str) -> Result<Box<[u8]>, JsValue> {
        // 1. Setup Buffer to hold PDF bytes in memory
        let mut buffer: Vec<u8> = Vec::new();

        // 2. Create PDF Metadata
        let mut metadata = pdf::Metadata::default();
        metadata.title = "Lambda PDF".to_string();
        metadata.author = "Aprova".to_string();

        // 3. Create Skia Document attached to the memory buffer
        let document = pdf::new_document(&mut buffer, Some(&metadata));

        // 4. Start Page 1
        let mut page = document.begin_page((self.config.width, self.config.height), None);
        let canvas = page.canvas();

        // --- POC DRAWING COMMANDS START ---

        // Draw Red Rectangle
        let mut paint = Paint::default();
        paint.set_color(Color::RED);
        let rect = Rect::from_xywh(50.0, 50.0, 200.0, 100.0);
        canvas.draw_rect(rect, &paint);

        // Use a default font for the proof-of-concept; final version will embed Roboto.
        let mut font = Font::default();
        font.set_size(24.0);

        // Draw Text "Hello Lambda"
        let mut text_paint = Paint::default();
        text_paint.set_color(Color::BLACK);
        text_paint.set_anti_alias(true);

        canvas.draw_str(
            "Hello Lambda",
            Point::new(60.0, 110.0),
            &font,
            &text_paint,
        );

        // --- POC DRAWING COMMANDS END ---

        // 5. Finalize PDF
        let document = page.end_page();
        document.close();

        Ok(buffer.into_boxed_slice())
    }
}