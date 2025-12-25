// @generated file from wasmbuild -- do not edit
// deno-lint-ignore-file
// deno-fmt-ignore-file

/**
 * Parses the input PDF file (as a base64 encoded string), outputs the parsed
 * PDF (and any warnings) as a JSON object
 *
 * ```js,no_run,ignore
 * let input = JSON.encode({ pdf_base64: atob(my_pdf) });
 * let doc = JSON.parse(Pdf_BytesToPdfDocument(input));
 * console.log(doc.pdf);
 * console.log(doc.warnings);
 * // {
 * //   status: 0,
 * //   data: {
 * //     metadata: ...,
 * //     resources: ...,
 * //     bookmarks: ...,
 * //     pages: [{ media_box, trim_box, crop_box, ops }]
 * //    }
 * // }
 * ```
 */
export function Pdf_BytesToDocumentSync(input: string): string;
/**
 * Parses the input HTML, converts it to PDF pages and outputs the generated
 * PDF as a JSON object
 *
 * ```js,no_run,ignore
 * let html = "<!doctype html><html><body><h1>Hello!</h1></body></html>";
 * let input = JSON.encode({ html: html, title "My PDF!" });
 * let document = JSON.parse(Pdf_HtmlToPdfDocument(input));
 * console.log(document);
 * // {
 * //   status: 0,
 * //   data: {
 * //     metadata: ...,
 * //     resources: ...,
 * //     bookmarks: ...,
 * //     pages: [{ media_box, trim_box, crop_box, ops }]
 * //    }
 * // }
 * ```
 */
export function Pdf_HtmlToDocumentSync(input: string): string;
/**
 * Helper function that takes a PDF page and outputs a list of all
 * images IDs / fonts IDs that have to be gathered from the documents
 * resources in order to render this page.
 */
export function Pdf_ResourcesForPageSync(input: string): string;
/**
 * Takes a `PdfDocument` JS object and returns the base64 PDF bytes
 */
export function Pdf_DocumentToBytesSync(input: string): string;
/**
 * Takes a `PdfPage` JS object and outputs the SVG string for that page
 */
export function Pdf_PageToSvgSync(input: string): string;
export function create_hello_pdf(name: string): Uint8Array;
