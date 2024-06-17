const postcss = require("postcss");
const cssnano = require("cssnano");

const out = postcss([cssnano({ preset: "default" })]).process(
  `
    .a {
        background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><rect width="100" height="100" /></svg>');
    }
  `,
  { from: undefined }
);

out.then((result) => {
  console.log(result.css);
});
