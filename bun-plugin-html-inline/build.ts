import html from "bun-plugin-html";

await Bun.build({
  entrypoints: ["./src/index.html"],
  outdir: "./dist-separated",
  plugins: [html()],
});

await Bun.build({
  entrypoints: ["./src/index.html"],
  outdir: "./dist-inline", // Specify the output directory
  plugins: [html({ inline: true })],
});
