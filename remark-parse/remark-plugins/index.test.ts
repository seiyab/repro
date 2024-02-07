import { describe, test, expect } from "bun:test";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { remarkLiquid } from "./liquid";

describe("liquid", () => {
	function parse(text: string) {
		const processor = unified().use(remarkParse).use(remarkLiquid);

		return processor.run(processor.parse(text));
	}

	test.each([
		"abc{def}geh",
		"aa{[link-like](example.com)}bb",
		"a\nb",
		"{",
		"{}",
		`a{
    b
    c
  }d`,
	])("%s", async (t) => {
		expect(await parse(t)).toMatchSnapshot();
	});
});
