import { describe, test, expect } from "vitest";
import { check } from "./utils.ts";
import stringLength from "string-length";

test("default", async () => {
  await check("default");
});

describe("with options", (it) => {
  it.describe("remarkGfm", (test) => {
    test("firstLineBlank", async () => {
      await check("first-line-blank", {
        remarkGfm: { firstLineBlank: true },
      });
    });

    test("singleTilde", async () => {
      await check("single-tilde", { remarkGfm: { singleTilde: false } });
    });

    test("stringLength", async () => {
      await check("string-length", { remarkGfm: { stringLength } });
    });

    test("tableCellPadding", async () => {
      await check("table-cell-padding", {
        remarkGfm: { tableCellPadding: false },
      });
    });

    test("tablePipeAlign", async () => {
      await check("table-pipe-align", {
        remarkGfm: { tablePipeAlign: false },
      });
    });
  });

  it.describe("plugins", (test) => {
    test("autolinkLiteral", async () => {
      await check("auto-link-literal", {
        plugins: { autolinkLiteral: false },
      });
    });

    test("footnote", async () => {
      await check("footnote", {
        plugins: { footnote: false },
      });
    });

    test("strikethrough", async () => {
      await check("strikethrough", {
        plugins: { strikethrough: false },
      });
    });

    test("table", async () => {
      await check("table", {
        plugins: { table: false },
      });
    });

    test("taskListItem", async () => {
      await check("task-list-item", {
        plugins: { taskListItem: false },
      });
    });

    test("should not disable other plugins", async () => {
      await check("should-not-disable-other-plugins", {
        plugins: { taskListItem: false },
      });
    });

    test("should throw error on unknown field", async () => {
      async function actual() {
        // @ts-expect-error For testing
        await check("table", { plugins: { foo: true } });
      }

      await expect(actual()).rejects.toThrow(
        'Unknown "foo" for plugin options. Please ensure your config is not mistyped.',
      );
    });
  });
});
