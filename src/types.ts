import type { ToMarkdownOptions as FootnoteOptions } from "mdast-util-gfm-footnote";
import type { Options as TableOptions } from "mdast-util-gfm-table";
import type { Options as StrikethroughOptions } from "micromark-extension-gfm-strikethrough";

/**
 * Configuration for `remarkGfmCustom`
 */
interface Options {
  /**
   * Options for [remark-gfm][] plugins.
   *
   * [remark-gfm]: https://github.com/remarkjs/remark-gfm#options
   */
  remarkGfm?: FootnoteOptions | TableOptions | StrikethroughOptions;
  /**
   * Toggles for individual GFM features.
   */
  plugins?: {
    /**
     * Toggle the [GFM literal autolinks][].
     *
     * Set to `false` to disable.
     *
     * [gfm literal autolinks]: https://github.com/micromark/micromark-extension-gfm-autolink-literal
     *
     * @default true
     */
    autolinkLiteral?: boolean;
    /**
     * Toggle the [GFM footnotes][].
     *
     * Set to `false` to disable.
     *
     * [gfm footnotes]: https://github.com/micromark/micromark-extension-gfm-footnote
     *
     * @default true
     */
    footnote?: boolean;
    /**
     * Toggle the [GFM strikethrough][].
     *
     * Set to `false` to disable.
     *
     * [gfm strikethrough]: https://github.com/micromark/micromark-extension-gfm-strikethrough
     *
     * @default true
     */
    strikethrough?: boolean;
    /**
     * Toggle the [GFM tables][].
     *
     * Set to `false` to disable.
     *
     * [gfm tables]: https://github.com/micromark/micromark-extension-gfm-table
     *
     * @default true
     */
    table?: boolean;
    /**
     * Toggle the [GFM task list items][].
     *
     * Set to `false` to disable.
     *
     * [gfm task list items]: https://github.com/micromark/micromark-extension-gfm-task-list-item
     *
     * @default true
     */
    taskListItem?: boolean;
  };
}

export type { FootnoteOptions, Options, StrikethroughOptions, TableOptions };
