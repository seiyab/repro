import type { Event } from "micromark-util-types";

function nested(events: Event[]): unknown {
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

export { nested };
