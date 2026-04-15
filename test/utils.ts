import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import { VFile } from "vfile";
import { read } from "to-vfile";
import { remark } from "remark";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { strictEqual } from "node:assert/strict";
import { type Plugin, unified } from "unified";
import { type Options, remarkGfmCustom } from "$dist";

export { check };

/**
 * A helper to parse Markdown and check if it matches what the test expects.
 *
 * @param fixtureName - The name of the fixture file.
 * @param options - Plugin settings to use during the test.
 */
async function check(fixtureName: string, options?: Options): Promise<void> {
  const outputFormats = ["markdown", "html"] as const satisfies ParseConfig["outputFormat"][];

  /**
   * Decides if we should compare our custom GFM output with standard
   * `remarkGfm`.
   *
   * We skip this comparison when plugins are disabled because standard
   * `remarkGfm` doesn't have the same features, so the results won't match.
   */
  const compareWithStandardGfm = !options?.plugins;

  await Promise.all(
    outputFormats.map((format) =>
      parse({
        fixtureName,
        outputFormat: format,
        options,
        compareWithStandardGfm,
      }),
    ),
  );
}

/**
 * Handles the actual parsing logic for a single format.
 *
 * It compares the output of our custom processor (and optionally the standard
 * one) against a saved snapshot file.
 *
 * @param config - The configuration for this specific parse run.
 */
async function parse(config: ParseConfig): Promise<void> {
  const { fixtureName, outputFormat, options, compareWithStandardGfm } = config;

  // Find the source fixture and the corresponding snapshot file
  const fixturePath = join(import.meta.dirname, "fixtures", `${fixtureName}.md`);
  const snapshotPath = join(
    import.meta.dirname,
    "snapshots",
    `${fixtureName}${outputFormat === "markdown" ? ".md" : ".html"}`,
  );

  const vFile = await read(fixturePath);
  const isMarkdown = outputFormat === "markdown";

  // Pick the right processor based on the format.
  const process = isMarkdown ? parseMarkdown : parseHtml;

  const customResultPromise = process(vFile, remarkGfmCustom, options);
  const standardResultPromise = compareWithStandardGfm
    ? process(vFile, remarkGfm, options?.remarkGfm)
    : Promise.resolve("");

  const [standardResult, customResult, snapshot] = await Promise.all([
    standardResultPromise,
    customResultPromise,
    readFile(snapshotPath, { encoding: "utf8" }),
  ]);

  // Verify the custom output matches the saved snapshot.
  strictEqual(customResult, snapshot, "Custom output does not match the snapshot");

  // If requested, verify standard GFM also matches the snapshot.
  if (compareWithStandardGfm) {
    strictEqual(standardResult, snapshot, "Standard output does not match the snapshot");
  }
}

/**
 * Processes a file using remark and returns the resulting markdown string.
 *
 * @param file - The virtual file (VFile) to be processed.
 * @param plugin - The remark plugin to apply.
 * @param pluginOptions - Options specific to the chosen plugin.
 */
async function parseMarkdown<PluginType extends Plugin>(
  file: VFile,
  plugin: PluginType,
  pluginOptions: Parameters<PluginType>[number],
) {
  const result = await remark().use(plugin, pluginOptions).process(new VFile(file));

  return result.toString();
}

/**
 * Converts markdown into formatted HTML.
 *
 * @param file - The virtual file (VFile) to be processed.
 * @param plugin - The remark plugin to apply.
 * @param pluginOptions - Options specific to the chosen plugin.
 */
async function parseHtml<PluginType extends Plugin>(
  file: VFile,
  plugin: PluginType,
  pluginOptions: Parameters<PluginType>[number],
) {
  const result = await unified()
    .use(remarkParse)
    .use(plugin, pluginOptions)
    .use(remarkRehype)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(new VFile(file));

  return result.toString().trimStart();
}

/**
 * Configuration for the fixture parsing process.
 */
interface ParseConfig {
  /** The name of the fixture file (without extension). */
  fixtureName: string;
  /** Whether we want to test the Markdown output or the HTML output. */
  outputFormat: "markdown" | "html";
  /** Custom options for the plugin being tested. */
  options?: Options;
  /** If true, we'll run a baseline test against the standard GFM plugin. */
  compareWithStandardGfm?: boolean;
}
