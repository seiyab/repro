import { micromark, parse, postprocess, preprocess } from "micromark";
import type { Event } from "micromark-util-types";

console.log(micromark("_[Italic link](../_link_including_underscores_.md)_"));

console.log(
	JSON.stringify(
		stacked(
			postprocess(
				parse()
					.document()
					.write(
						preprocess()(
							"_[Italic link](../_link_including_underscores_.md)_",
							null,
							true,
						),
					),
			),
		),
		null,
		2,
	),
);

function pretty(value: unknown): unknown {
	const seen = new WeakSet();
	const skip = new Set(["next", "previous", "parser"]);

	return rec(value);

	function rec(value: unknown): unknown {
		if (typeof value !== "object") return value;
		if (value == null) return value;

		if (seen.has(value)) return "[Circular]";
		seen.add(value);

		if (Array.isArray(value)) return value.map(rec);

		const result: Record<string, unknown> = {};
		Object.entries(value).forEach(([key, val]) => {
			if (skip.has(key)) return;
			// if (key.startsWith("_")) return;
			result[key] = rec(val);
		});
		return result;
	}
}

function stacked(events: Event[]): unknown {
	const stack = [{ type: "root", children: [] }] as any[];
	events.forEach((event) => {
		const parent = stack.at(-1);
		if (!parent) throw new Error("No parent");
		const [direction, token] = event;
		if (direction === "exit") {
			if (token.type !== parent.type) throw new Error("Type mismatch");
			stack.pop();
			return;
		}
		const elem = { type: token.type, children: [] };
		parent.children.push(elem);
		stack.push(elem);
	});

	function rec(value: any): unknown {
		const { type, children } = value;
		if (children.length === 0) return type;
		return {
			[type]: children.map(rec),
		};
	}

	return rec(stack[0]);
}
