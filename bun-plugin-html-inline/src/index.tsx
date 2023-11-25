/// <reference lib="dom" />

import * as React from "react";
import { render } from "react-dom";

window.addEventListener("DOMContentLoaded", () => {
  const root = document.createElement("div");
  document.body.appendChild(root);
  render(<App />, root);
});

function App(): React.ReactNode {
  return (
    <div>
      <h1>Hello, bun-plugin-html!</h1>
    </div>
  );
}
