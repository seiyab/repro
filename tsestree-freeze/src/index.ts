import { visitorKeys } from "@typescript-eslint/visitor-keys";
import { parse } from "@typescript-eslint/typescript-estree";
import { readFileSync } from "fs";

const code = readFileSync("./fixture/index.ts", "utf-8");

const ast = parse(code);

traverse(ast);

function traverse(node: any, depth = 0) {
  const keys = visitorKeys[node.type] || [];
  console.error(" ".repeat(depth) + node.type);
  keys.forEach((key) => {
    const child = node[key];
    if (child && !Object.keys(node).includes(key)) {
      throw new Error(
        `Suspicious key ${key} in ${node.type} (depth = ${depth})`
      );
    }
    if (Array.isArray(child)) {
      child.forEach((node) => traverse(node, depth + 1));
    } else if (child && typeof child === "object") {
      traverse(child, depth + 1);
    }
  });
}
