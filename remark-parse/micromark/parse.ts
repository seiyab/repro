import { parse, postprocess, preprocess } from "micromark";

function parseMarkdown(data: string) {
	return postprocess(
		parse()
			.document()
			.write(preprocess()(data, null, true)),
	);
}

export { parseMarkdown };
