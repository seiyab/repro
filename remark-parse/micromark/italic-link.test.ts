import { expect, test } from "bun:test";
import { nested } from "./nested";
import { parseMarkdown } from "./parse";

test("italic link", () => {
	expect(
		nested(
			parseMarkdown("_[Italic link](../_link_including_underscores_.md)_"),
		),
	).toEqual({
		root: [
			{
				content: [
					{
						paragraph: [
							{
								emphasis: [
									"emphasisSequence",
									{
										emphasisText: [
											{
												link: [
													{
														label: [
															"labelMarker",
															{
																labelText: ["data"],
															},
															"labelMarker",
														],
													},
													{
														resource: [
															"resourceMarker",
															{
																resourceDestination: [
																	{
																		resourceDestinationRaw: [
																			{
																				resourceDestinationString: ["data"],
																			},
																		],
																	},
																],
															},
															"resourceMarker",
														],
													},
												],
											},
										],
									},
									"emphasisSequence",
								],
							},
						],
					},
				],
			},
		],
	});
});
