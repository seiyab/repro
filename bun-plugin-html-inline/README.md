# bun-plugin-html-inline

Reproduction for https://github.com/BjornTheProgrammer/bun-plugin-html/issues/4

# Reproduction steps

Install dependencies:

```bash
bun install
```

Build:

```bash
bun ./build.ts
```

View app:

```bash
python3 -m http.server -d ./dist-inline
# and access http://localhost:8000/

# without inline option, it works
python3 -m http.server -d ./dist-separated
# and access http://localhost:8000/
```
