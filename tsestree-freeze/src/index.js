"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var visitor_keys_1 = require("@typescript-eslint/visitor-keys");
var typescript_estree_1 = require("@typescript-eslint/typescript-estree");
var fs_1 = require("fs");
var code = (0, fs_1.readFileSync)("./fixture/index.ts", "utf-8");
var ast = (0, typescript_estree_1.parse)(code);
traverse(ast);
function traverse(node, depth) {
    if (depth === void 0) { depth = 0; }
    var keys = visitor_keys_1.visitorKeys[node.type] || [];
    console.error(" ".repeat(depth) + node.type);
    keys.forEach(function (key) {
        var child = node[key];
        if (child && !Object.keys(node).includes(key)) {
            throw new Error("Suspicious key ".concat(key, " in ").concat(node.type, " (depth = ").concat(depth, ")"));
        }
        if (Array.isArray(child)) {
            child.forEach(function (node) { return traverse(node, depth + 1); });
        }
        else if (child && typeof child === "object") {
            traverse(child, depth + 1);
        }
    });
}
