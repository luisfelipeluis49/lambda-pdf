#!/usr/bin/env -S deno run -A
// Minimal emscripten-focused build helper to replace the missing wasmbuild wrapper.
// Supports a subset of flags: --out <dir>, --debug, --inline.

// Simple argument parser to avoid external deps
function parseArgs(args: string[]) {
  const result: {
    out: string;
    debug: boolean;
    inline: boolean;
    help: boolean;
  } = {
    out: "./_wasm",
    debug: false,
    inline: false,
    help: false,
  };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--out":
        result.out = args[++i] ?? result.out;
        break;
      case "--debug":
        result.debug = true;
        break;
      case "--inline":
        result.inline = true;
        break;
      case "--help":
      case "-h":
        result.help = true;
        break;
      default:
        // ignore unknown flags for now
        break;
    }
  }
  return result;
}

const join = (...parts: string[]) => parts.join("/").replace(/\\+/g, "/");

const flags = parseArgs(Deno.args);

if (flags.help) {
  console.log(
    `Usage: deno run -A ./tools/wasmbuild-emscripten/main.ts [--out DIR] [--debug] [--inline]

Builds the Rust crate for wasm32-unknown-emscripten, runs wasm-bindgen (target deno),
and writes artifacts to the output directory (default ./_wasm).
If --inline is provided, emits lambda_pdf.js that inlines the wasm bytes as base64.
`,
  );
  Deno.exit(0);
}

const profile = flags.debug ? "debug" : "release";
const outDir = flags.out;
await Deno.mkdir(outDir, { recursive: true });

const crateName = "lambda_pdf_rs";
const wasmPath =
  `target/wasm32-unknown-emscripten/${profile}/${crateName}.wasm`;

async function run(
  name: string,
  cmd: string[],
  opts: Deno.CommandOptions = {},
) {
  console.log(`$ ${cmd.join(" ")}`);
  const proc = new Deno.Command(cmd[0], { ...opts, args: cmd.slice(1) })
    .spawn();
  const status = await proc.status;
  if (!status.success) {
    throw new Error(`${name} failed with code ${status.code}`);
  }
}

// Ensure target toolchain
try {
  await run("rustup target add", [
    "rustup",
    "target",
    "add",
    "wasm32-unknown-emscripten",
  ]);
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.warn("rustup target add failed (continuing):", msg);
}

// Build the crate
const cargoArgs = [
  "cargo",
  "build",
  "--lib",
  "-p",
  crateName,
  "--target",
  "wasm32-unknown-emscripten",
];
if (!flags.debug) cargoArgs.push("--release");
await run("cargo build", cargoArgs, {
  env: {
    TZ: "UTC",
    LC_ALL: "C",
    SOURCE_DATE_EPOCH: "1600000000",
  },
});

// Run wasm-bindgen (deno target)
await run("wasm-bindgen", [
  "wasm-bindgen",
  "--target",
  "deno",
  "--out-dir",
  outDir,
  "--typescript",
  wasmPath,
]);

// Prepare inline wrapper (or simple copy) so mod.ts can import ./_wasm/lambda_pdf.js
const glueJs = await Deno.readTextFile(join(outDir, `${crateName}.js`));
const dts = await Deno.readTextFile(join(outDir, `${crateName}.d.ts`));

if (flags.inline) {
  const wasmBytes = await Deno.readFile(join(outDir, `${crateName}_bg.wasm`));
  const b64 = btoa(String.fromCharCode(...wasmBytes));
  const wrapper =
    `// @generated minimal inline wrapper\n${glueJs}\n\nconst __wasm_bytes_b64 = "${b64}";\nlet __wasm_exports;\nexport async function instantiate() {\n  if (__wasm_exports) return __wasm_exports;\n  const bytes = Uint8Array.from(atob(__wasm_bytes_b64), c => c.charCodeAt(0));\n  const init = (await import('./${crateName}.js')).default;\n  __wasm_exports = await init(bytes);\n  return __wasm_exports;\n}\nexport default instantiate;\n`;
  await Deno.writeTextFile(join(outDir, "lambda_pdf.js"), wrapper);
} else {
  // Non-inline: reuse glue and export helper that lazy-loads the wasm file next to it.
  const wrapper =
    `// @generated minimal wrapper\nimport init from './${crateName}.js';\nlet __wasm_exports;\nexport async function instantiate() {\n  if (__wasm_exports) return __wasm_exports;\n  __wasm_exports = await init();\n  return __wasm_exports;\n}\nexport default instantiate;\n`;
  await Deno.writeTextFile(join(outDir, "lambda_pdf.js"), wrapper);
}

// Provide a thin d.ts that re-exports wasm-bindgen types and the instantiate helper.
const lambdaDts =
  `// @generated minimal typings\n${dts}\nexport declare function instantiate(): Promise<typeof import('./${crateName}.js')>;\nexport default instantiate;\n`;
await Deno.writeTextFile(join(outDir, "lambda_pdf.d.ts"), lambdaDts);

console.log(`Artifacts written to ${outDir}`);
