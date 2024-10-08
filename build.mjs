import { rm } from "node:fs/promises"
import { build } from "esbuild"

await rm("dist", { recursive: true, force: true })

await build({
  entryPoints: ["src/main.ts"],
  outdir: "dist",
  bundle: true,
  target: "node20",
  platform: "node",
  packages: "bundle",
  sourcemap: "inline",
})

console.log("dist/main.js successful generated")
