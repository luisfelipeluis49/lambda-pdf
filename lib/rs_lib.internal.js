// @generated file from wasmbuild -- do not edit
// @ts-nocheck: generated
// deno-lint-ignore-file
// deno-fmt-ignore-file

let wasm;
export function __wbg_set_wasm(val) {
  wasm = val;
}

let WASM_VECTOR_LEN = 0;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
  if (
    cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0
  ) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8ArrayMemory0;
}

const cachedTextEncoder = new TextEncoder();

if (!("encodeInto" in cachedTextEncoder)) {
  cachedTextEncoder.encodeInto = function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
      read: arg.length,
      written: buf.length,
    };
  };
}

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length, 1) >>> 0;
    getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }

  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;

  const mem = getUint8ArrayMemory0();

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7F) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
    const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
    const ret = cachedTextEncoder.encodeInto(arg, view);

    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}

let cachedTextDecoder = new TextDecoder("utf-8", {
  ignoreBOM: true,
  fatal: true,
});

cachedTextDecoder.decode();

const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
  numBytesDecoded += len;
  if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
    cachedTextDecoder = new TextDecoder("utf-8", {
      ignoreBOM: true,
      fatal: true,
    });
    cachedTextDecoder.decode();
    numBytesDecoded = len;
  }
  return cachedTextDecoder.decode(
    getUint8ArrayMemory0().subarray(ptr, ptr + len),
  );
}

function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return decodeText(ptr, len);
}
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
 * @param {string} input
 * @returns {string}
 */
export function Pdf_BytesToDocumentSync(input) {
  let deferred2_0;
  let deferred2_1;
  try {
    const ptr0 = passStringToWasm0(
      input,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.Pdf_BytesToDocumentSync(ptr0, len0);
    deferred2_0 = ret[0];
    deferred2_1 = ret[1];
    return getStringFromWasm0(ret[0], ret[1]);
  } finally {
    wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
  }
}

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
 * @param {string} input
 * @returns {string}
 */
export function Pdf_HtmlToDocumentSync(input) {
  let deferred2_0;
  let deferred2_1;
  try {
    const ptr0 = passStringToWasm0(
      input,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.Pdf_HtmlToDocumentSync(ptr0, len0);
    deferred2_0 = ret[0];
    deferred2_1 = ret[1];
    return getStringFromWasm0(ret[0], ret[1]);
  } finally {
    wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
  }
}

/**
 * Helper function that takes a PDF page and outputs a list of all
 * images IDs / fonts IDs that have to be gathered from the documents
 * resources in order to render this page.
 * @param {string} input
 * @returns {string}
 */
export function Pdf_ResourcesForPageSync(input) {
  let deferred2_0;
  let deferred2_1;
  try {
    const ptr0 = passStringToWasm0(
      input,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.Pdf_ResourcesForPageSync(ptr0, len0);
    deferred2_0 = ret[0];
    deferred2_1 = ret[1];
    return getStringFromWasm0(ret[0], ret[1]);
  } finally {
    wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
  }
}

/**
 * Takes a `PdfDocument` JS object and returns the base64 PDF bytes
 * @param {string} input
 * @returns {string}
 */
export function Pdf_DocumentToBytesSync(input) {
  let deferred2_0;
  let deferred2_1;
  try {
    const ptr0 = passStringToWasm0(
      input,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.Pdf_DocumentToBytesSync(ptr0, len0);
    deferred2_0 = ret[0];
    deferred2_1 = ret[1];
    return getStringFromWasm0(ret[0], ret[1]);
  } finally {
    wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
  }
}

/**
 * Takes a `PdfPage` JS object and outputs the SVG string for that page
 * @param {string} input
 * @returns {string}
 */
export function Pdf_PageToSvgSync(input) {
  let deferred2_0;
  let deferred2_1;
  try {
    const ptr0 = passStringToWasm0(
      input,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.Pdf_PageToSvgSync(ptr0, len0);
    deferred2_0 = ret[0];
    deferred2_1 = ret[1];
    return getStringFromWasm0(ret[0], ret[1]);
  } finally {
    wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
  }
}

function takeFromExternrefTable0(idx) {
  const value = wasm.__wbindgen_externrefs.get(idx);
  wasm.__externref_table_dealloc(idx);
  return value;
}

function getArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
 * @param {string} name
 * @returns {Uint8Array}
 */
export function create_hello_pdf(name) {
  const ptr0 = passStringToWasm0(
    name,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len0 = WASM_VECTOR_LEN;
  const ret = wasm.create_hello_pdf(ptr0, len0);
  if (ret[3]) {
    throw takeFromExternrefTable0(ret[2]);
  }
  var v2 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
  wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
  return v2;
}

export function __wbindgen_init_externref_table() {
  const table = wasm.__wbindgen_externrefs;
  const offset = table.grow(4);
  table.set(0, undefined);
  table.set(offset + 0, undefined);
  table.set(offset + 1, null);
  table.set(offset + 2, true);
  table.set(offset + 3, false);
}
