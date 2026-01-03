import * as import0 from 'env'
import * as import1 from 'env'
import * as import2 from 'env'
import * as import3 from 'env'
import * as import4 from 'env'
import * as import5 from 'env'
import * as import6 from 'env'
import * as import7 from 'env'
import * as import8 from 'env'
import * as import9 from 'env'
import * as import10 from 'env'
import * as import11 from 'env'
import * as import12 from 'wasi_snapshot_preview1'
import * as import13 from 'wasi_snapshot_preview1'
import * as import14 from 'wasi_snapshot_preview1'
import * as import15 from 'env'
import * as import16 from 'wasi_snapshot_preview1'
import * as import17 from 'wasi_snapshot_preview1'
import * as import18 from 'wasi_snapshot_preview1'
import * as import19 from 'env'

const imports = {
    __wbindgen_placeholder__: {
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
            ;
        },
    },
    'env': import0,  'env': import1,  'env': import2,  'env': import3,  'env': import4,  'env': import5,  'env': import6,  'env': import7,  'env': import8,  'env': import9,  'env': import10,  'env': import11,  'wasi_snapshot_preview1': import12,  'wasi_snapshot_preview1': import13,  'wasi_snapshot_preview1': import14,  'env': import15,  'wasi_snapshot_preview1': import16,  'wasi_snapshot_preview1': import17,  'wasi_snapshot_preview1': import18,  'env': import19,
};

const wasmUrl = new URL('lambda_pdf_rs_bg.wasm', import.meta.url);
const wasm = (await WebAssembly.instantiateStreaming(fetch(wasmUrl), imports)).instance.exports;
export { wasm as __wasm };

wasm.__wbindgen_start();

