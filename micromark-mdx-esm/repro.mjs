import { Parser } from "acorn";
import { micromark } from "micromark";
import { mdxjsEsm } from "micromark-extension-mdxjs-esm";

const acorn = Parser;

const output = micromark('import{a} from "b"\n\n# c', {
  extensions: [mdxjsEsm({ acorn })],
});

console.log(output);
