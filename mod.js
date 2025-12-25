import { create_hello_pdf } from "./lib/rs_lib.js";

// Example usage
try {
  const pdfBytes = create_hello_pdf("World");
  console.log(`Generated PDF with ${pdfBytes.length} bytes.`);
  // In a real usage, you might write this to a file or return it in a response
  // Deno.writeFileSync("output.pdf", pdfBytes);
} catch (error) {
  console.error("Error creating PDF:", error);
}

export { create_hello_pdf };