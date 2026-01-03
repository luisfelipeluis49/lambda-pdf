import { instantiate } from "./_wasm/lambda_pdf.js";

/**
 * Configuration options mirroring Puppeteer's `page.pdf()` options.
 */
export interface PdfOptions {
  /**
   * Scale of the webpage rendering. Defaults to 1.
   * @default 1
   */
  scale?: number;

  /**
   * Print background graphics. Defaults to false.
   * @default false
   */
  printBackground?: boolean;

  /**
   * Paper format. If set, takes priority over width or height options.
   * @default 'Letter'
   */
  format?: 'Letter' | 'Legal' | 'Tabloid' | 'Ledger' | 'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6';

  /**
   * Paper orientation. Defaults to false.
   * @default false
   */
  landscape?: boolean;

  /**
   * Paper ranges to print, e.g., '1-5, 8, 11-13'. 
   * Empty string, which means print all pages.
   * @default ''
   */
  pageRanges?: string;

  /**
   * Paper width, accepts values labeled with units.
   */
  width?: string | number;

  /**
   * Paper height, accepts values labeled with units.
   */
  height?: string | number;

  /**
   * Paper margins, defaults to none.
   */
  margin?: {
    top?: string | number;
    bottom?: string | number;
    left?: string | number;
    right?: string | number;
  };
}

let wasmModule: Awaited<ReturnType<typeof instantiate>>| undefined

/**
 * The core API entry point.
 * @param html The raw HTML string to render.
 * @param options Configuration options.
 * @returns A Uint8Array containing the generated PDF buffer.
 */
export async function pdf(html: string, options: PdfOptions = {}): Promise<Uint8Array>{
    if (!wasmModule) {
    wasmModule = await instantiate();
  }

  const generator = new wasmModule.LambdaPDF(options);

  try {
    const pdfBuffer = generator.generate(html);
    return pdfBuffer;
  }
  finally {
    generator.free();
  }
}