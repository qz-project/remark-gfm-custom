# remark-gfm-custom

[![npm Version][npm-badge]][npm] [![JSR Version][jsr-badge]][jsr]
[![GitHub Release][github-badge]][github-release]

A configurable [remark-gfm][remark-gfm] that allows you to toggle the
[GitHub Flavored Markdown (GFM)][gfm] features.

This package has the same functionality as [remark-gfm], with the additional
ability to enable or disable specific GFM features like autolinks, footnotes,
tables, and more.

## Installation

`remark-gfm-custom` is available on both [npm.com][npm] and [JSR.io][jsr].

### Using npm

```bash
# Deno
deno add npm:remark-gfm-custom

# Bun
bun add remark-gfm-custom

# pnpm
pnpm add remark-gfm-custom

# npm
npm install remark-gfm-custom
```

### Using JSR

```bash
# Deno - JSR
deno add jsr:@qz/remark-gfm-custom

# Bun - JSR
bunx jsr add @qz/remark-gfm-custom

# pnpm - JSR
pnpm i jsr:@qz/remark-gfm-custom

# npm - JSR
npx jsr add @qz/remark-gfm-custom
```

## Usage

```ts
import assert from "node:assert";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import { remarkGfmCustom } from "remark-gfm-custom";

const file = await unified()
  .use(remarkParse)
  // This disables the GFM autolink feature.
  .use(remarkGfmCustom, { plugins: { autolinkLiteral: false } })
  .use(remarkRehype)
  .use(rehypeStringify)
  .process("https://example.com");

assert.equal(file.toString(), "<p>https://example.com</p>");
```

### API

This package exports the following:

#### `remarkGfmCustom`

```ts
function remarkGfmCustom(options?: Options): void;
```

The main plugin. It receives one optional parameter to configure behavior. See
the [`Options` section](#options) below for configuration details.

#### `Options`

```ts
type Options = {
  remarkGfm?: FootnoteOptions | TableOptions | StrikethroughOptions;
  plugins?: {
    autolinkLiteral?: boolean;
    footnote?: boolean;
    strikethrough?: boolean;
    table?: boolean;
    taskListItem?: boolean;
  };
};
```

Configuration for [`remarkGfmCustom`](#remarkgfmcustom). This consists of two
main categories: [`remarkGfm`](#remarkgfm) and [`plugins`](#plugins).

##### `remarkGfm`

```ts
type remarkGfm = FootnoteOptions | TableOptions | StrikethroughOptions;
```

Options passed directly to the [remark-gfm][remark-gfm] plugins. The available
fields are:

##### `firstLineBlank`

```ts
type firstLineBlank = boolean;
```

Serialize with a blank line for the first line of footnote definitions.

- Default: `false`.
- Reference: <https://github.com/remarkjs/remark-gfm#options>

##### `stringLength`

```ts
type stringLength = (value: string) => number;
```

Detect the size of table cells, used when aligning cells.

- Default: `d => d.length`.
- Reference: <https://github.com/remarkjs/remark-gfm#options>

##### `singleTilde`

```ts
type singleTilde = boolean;
```

Whether to support strikethrough with a single tilde. Single tildes work on
GitHub but are technically prohibited by GFM.

- Default: `true`.
- Reference: <https://github.com/remarkjs/remark-gfm#options>

##### `tablePipeAlign`

```ts
type tablePipeAlign = boolean;
```

Whether to align table pipes.

- Default: `true`.
- Reference: <https://github.com/remarkjs/remark-gfm#options>

##### `tableCellPadding`

```ts
type tableCellPadding = boolean;
```

Whether to add a space of padding between table pipes and cells.

- Default: `true`.
- Reference: <https://github.com/remarkjs/remark-gfm#options>

##### `plugins`

Options to enable or disable specific [remark-gfm][remark-gfm] bundled plugins.

All fields below are `boolean` and default to `true`. Set a field to `false` to
disable that specific GFM feature.

##### `autolinkLiteral`

Toggle
[GFM literal autolinks](https://github.com/micromark/micromark-extension-gfm-autolink-literal).

##### `footnote`

Toggle the
[GFM footnotes](https://github.com/micromark/micromark-extension-gfm-footnote).

##### `strikethrough`

Toggle the
[GFM strikethrough](https://github.com/micromark/micromark-extension-gfm-strikethrough).

##### `table`

Toggle the
[GFM tables](https://github.com/micromark/micromark-extension-gfm-table).

##### `taskListItem`

Toggle the
[GFM task list items](https://github.com/micromark/micromark-extension-gfm-task-list-item).

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

[MIT](./LICENSE)

[gfm]: https://github.github.com/gfm/
[github-badge]: https://img.shields.io/github/v/release/qz-project/remark-gfm-custom?style=for-the-badge&logo=github&logoSize=auto&label=%20&labelColor=%23181717&color=%23edede6
[github-release]: https://github.com/qz-project/remark-gfm-custom/releases
[jsr]: https://jsr.io/@qz/remark-gfm-custom
[jsr-badge]: https://img.shields.io/jsr/v/%40qz/remark-gfm-custom?style=for-the-badge&logo=jsr&logoColor=%23163c4c&logoSize=auto&label=%20&labelColor=%23ead527&color=%23FAF6D1
[npm]: https://npmjs.com/package/remark-gfm-custom
[npm-badge]: https://img.shields.io/npm/v/remark-gfm-custom?style=for-the-badge&logo=npm&logoSize=auto&label=%20&labelColor=%23ce0000&color=%23FFE9E9
[remark-gfm]: https://github.com/remarkjs/remark-gfm
