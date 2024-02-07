import { CompileContext, Token } from "mdast-util-from-markdown";
import { codes, types } from "micromark-util-symbol";
import { Code, Effects, State } from "micromark-util-types";
import { Processor } from "unified";

function remarkLiquid(this: Processor): void {
	const data = this.data();

	(data.micromarkExtensions ??= []).push(syntax());
	(data.fromMarkdownExtensions ??= []).push(fromMarkdown());
}

function syntax(): any {
	return {
		text: {
			[codes.leftCurlyBrace]: {
				name: "liquid",
				tokenize: liquidTokenize,
			},
		},
	};

	function liquidTokenize(effects: Effects, ok: State, nok: State) {
		return start;

		function start(code: Code) {
			effects.attempt;
			effects.enter("liquid" as any);
			effects.enter(types.data);
			effects.consume(code);
			return function (code: Code) {
				if (code === codes.rightCurlyBrace) {
					return nok;
				}
				return inside;
			};
		}

		function inside(code: Code) {
			if (code === codes.rightCurlyBrace) {
				effects.consume(code);
				effects.exit(types.data);
				effects.exit("liquid" as any);
				return ok;
			}
			if (code === codes.eof) {
				return nok;
			}
			effects.consume(code);
			return inside;
		}
	}
}

function fromMarkdown() {
	/** @type {Extension} */
	return {
		canContainEols: ["liquid"],
		enter: { liquid: enterLiquid },
		exit: { liquid: exitLiquid },
	};

	function enterLiquid(this: CompileContext, token: Token) {
		this.enter({ type: "liquid" } as any, token);
		this.buffer();
	}

	function exitLiquid(this: CompileContext, token: Token) {
		const d = this.resume();
		const node = this.stack[this.stack.length - 1];
		node.value = d;
		this.exit(token);
	}
}

export { remarkLiquid };
