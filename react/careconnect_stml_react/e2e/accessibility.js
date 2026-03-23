import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { expect } from "@playwright/test";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

export async function injectAxe(page) {
  await page.addScriptTag({ content: axeSource });
}

export async function expectNoAxeViolations(page, contextLabel, options = {}) {
  const { includeSelectors } = options;

  const results = await page.evaluate(async ({ includeSelectors: selectors }) => {
    const context =
      selectors && selectors.length > 0
        ? {
            include: selectors.map((selector) => [selector]),
          }
        : document;

    return window.axe.run(context, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21aa"],
      },
    });
  }, { includeSelectors });

  const summary = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    help: violation.help,
    nodes: violation.nodes.length,
    targets: violation.nodes.map((node) => node.target.join(" ")),
  }));

  expect(summary, `Expected no browser accessibility violations for ${contextLabel}`).toEqual([]);
}
