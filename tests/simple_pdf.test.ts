import { pdf } from "../mod.ts";

const buffer = await pdf("<html>POC</html>");

await Deno.writeFile("output.pdf", buffer);

console.log("PDF written to output.pdf");