import type { RequiredDeep } from "type-fest";
import type { Processor } from "unified";
import type { FootnoteOptions, Options, StrikethroughOptions, TableOptions } from "./types.ts";

import { merge } from "ts-deepmerge";
import { typedObjectKeys } from "./utils.ts";

// -----------------------------------------------------------------------------
// micromark
// -----------------------------------------------------------------------------
import { gfmAutolinkLiteral } from "micromark-extension-gfm-autolink-literal";
import { gfmFootnote } from "micromark-extension-gfm-footnote";
import { gfmStrikethrough } from "micromark-extension-gfm-strikethrough";
import { gfmTable } from "micromark-extension-gfm-table";
import { gfmTaskListItem } from "micromark-extension-gfm-task-list-item";

// -----------------------------------------------------------------------------
// mdast - from markdown
// -----------------------------------------------------------------------------
import { gfmAutolinkLiteralFromMarkdown } from "mdast-util-gfm-autolink-literal";
import { gfmFootnoteFromMarkdown } from "mdast-util-gfm-footnote";
import { gfmStrikethroughFromMarkdown } from "mdast-util-gfm-strikethrough";
import { gfmTableFromMarkdown } from "mdast-util-gfm-table";
import { gfmTaskListItemFromMarkdown } from "mdast-util-gfm-task-list-item";

// -----------------------------------------------------------------------------
// mdast - to markdown
// -----------------------------------------------------------------------------
import { gfmAutolinkLiteralToMarkdown } from "mdast-util-gfm-autolink-literal";
import { gfmFootnoteToMarkdown } from "mdast-util-gfm-footnote";
import { gfmStrikethroughToMarkdown } from "mdast-util-gfm-strikethrough";
import { gfmTableToMarkdown } from "mdast-util-gfm-table";
import { gfmTaskListItemToMarkdown } from "mdast-util-gfm-task-list-item";

const DEFAULT_OPTIONS = {
  remarkGfm: {},
  plugins: {
    autolinkLiteral: true,
    footnote: true,
    strikethrough: true,
    table: true,
    taskListItem: true,
  },
} as const satisfies Required<Options>;

/**
 * A custom version of [remark-gfm] that lets you pick and choose which
 * GFM features to enable.
 *
 * [remark-gfm]: https://github.com/remarkjs/remark-gfm
 *
 * @param options - Settings to enable or disable GFM features.
 *
 * @example
 * ```ts
 * import assert from 'node:assert'
 * import remarkParse from 'remark-parse'
 * import remarkRehype from 'remark-rehype'
 * import rehypeStringify from 'rehype-stringify'
 * import { unified } from 'unified'
 * import { remarkGfmCustom } from 'remark-gfm-custom'
 *
 * const file = await unified()
 *   .use(remarkParse)
 *   // This disables the GFM autolink feature.
 *   .use(remarkGfmCustom, { plugins: { autolinkLiteral: false } })
 *   .use(remarkRehype)
 *   .use(rehypeStringify)
 *   .process('https://example.com');
 *
 * assert.equal(file.toString(), '<p>https://example.com</p>');
 * ```
 */
function remarkGfmCustom(options?: Options): void;
function remarkGfmCustom(this: Processor, userOptions: Options = DEFAULT_OPTIONS): void {
  const options = merge(DEFAULT_OPTIONS, userOptions) as RequiredDeep<Options>;
  const data = this.data();

  data.micromarkExtensions ??= [];
  data.fromMarkdownExtensions ??= [];
  data.toMarkdownExtensions ??= [];

  const { micromarkExtensions, fromMarkdownExtensions, toMarkdownExtensions } = data;

  for (const name of typedObjectKeys(options.plugins)) {
    if (!options.plugins[name]) continue;

    switch (name) {
      case "autolinkLiteral":
        micromarkExtensions.push(gfmAutolinkLiteral());
        fromMarkdownExtensions.push(gfmAutolinkLiteralFromMarkdown());
        toMarkdownExtensions.push(gfmAutolinkLiteralToMarkdown());
        continue;

      case "footnote": {
        micromarkExtensions.push(gfmFootnote());
        fromMarkdownExtensions.push(gfmFootnoteFromMarkdown());

        const opt = options.remarkGfm as FootnoteOptions;
        toMarkdownExtensions.push(gfmFootnoteToMarkdown(opt));

        continue;
      }

      case "strikethrough": {
        const opt = options.remarkGfm as StrikethroughOptions;
        micromarkExtensions.push(gfmStrikethrough(opt));

        fromMarkdownExtensions.push(gfmStrikethroughFromMarkdown());
        toMarkdownExtensions.push(gfmStrikethroughToMarkdown());

        continue;
      }

      case "table": {
        micromarkExtensions.push(gfmTable());
        fromMarkdownExtensions.push(gfmTableFromMarkdown());

        const opt = options.remarkGfm as TableOptions;
        toMarkdownExtensions.push(gfmTableToMarkdown(opt));

        continue;
      }

      case "taskListItem":
        micromarkExtensions.push(gfmTaskListItem());
        fromMarkdownExtensions.push(gfmTaskListItemFromMarkdown());
        toMarkdownExtensions.push(gfmTaskListItemToMarkdown());
        continue;

      default:
        throw new TypeError(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `Unknown "${name}" for plugin options. Please ensure your config is not mistyped.`,
        );
    }
  }
}

export { remarkGfmCustom };
