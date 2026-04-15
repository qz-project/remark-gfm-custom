import assert from "node:assert";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import { remarkGfmCustom } from "remark-gfm-custom";
import type { Options } from "remark-gfm-custom";

const remarkGfmCustomOptions: Options = { plugins: { autolinkLiteral: false } };

const file = await unified()
  .use(remarkParse)
  // This disables the GFM autolink feature.
  .use(remarkGfmCustom, remarkGfmCustomOptions)
  .use(remarkRehype)
  .use(rehypeStringify)
  .process("https://example.com");

assert.equal(file.toString(), "<p>https://example.com</p>");
