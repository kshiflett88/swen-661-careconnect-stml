import { expect, test } from "@playwright/test";
import { injectAxe, expectNoAxeViolations } from "./accessibility";
import { signIn } from "./helpers";

test.describe("browser accessibility smoke checks", () => {
  test("sign-in and help flow have no obvious WCAG A/AA browser violations", async ({ page }) => {
    await page.goto("/");
    await injectAxe(page);
    await expectNoAxeViolations(page, "sign-in screen");

    await page.getByRole("link", { name: /need help signing in/i }).click();
    await expect(page.getByRole("dialog", { name: /having trouble signing in\?/i })).toBeVisible();
    await expectNoAxeViolations(page, "sign-in help dialog");
  });

  test("signed-in dashboard, tasks, and settings have no obvious WCAG A/AA browser violations", async ({ page }) => {
    await signIn(page);
    await injectAxe(page);
    await expectNoAxeViolations(page, "dashboard", {
      includeSelectors: [".app-toolbar", ".app-content", ".app-footer", ".bottom-nav"],
    });

    await page.getByRole("button", { name: "Tasks" }).first().click();
    await expect(page.getByRole("heading", { name: "All Tasks" })).toBeVisible();
    await expectNoAxeViolations(page, "tasks view", {
      includeSelectors: [".app-toolbar", ".app-content", ".app-footer", ".bottom-nav"],
    });

    await page.getByRole("button", { name: "Settings" }).first().click();
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
    await expectNoAxeViolations(page, "settings view", {
      includeSelectors: [".app-toolbar", ".app-content", ".app-footer", ".bottom-nav"],
    });
  });
});

test.describe("keyboard and ARIA regression checks", () => {
  test("mobile navigation controls expose correct names, focus flow, and aria states", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await signIn(page);

    const bottomNav = page.getByRole("navigation", { name: /primary navigation/i });
    await expect(bottomNav).toBeVisible();
    await expect(bottomNav.getByRole("button", { name: "Dashboard" })).toHaveAttribute("aria-current", "page");

    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: /^Add Task$/ })).toBeFocused();

    const searchButton = page.getByRole("button", { name: /search tasks/i });
    await page.keyboard.press("Tab");
    await expect(searchButton).toBeFocused();

    await page.keyboard.press("Enter");
    const mobileSearchInput = page.getByPlaceholder("Search tasks...").last();
    await expect(mobileSearchInput).toBeFocused();

    await bottomNav.getByRole("button", { name: "Tasks" }).click();
    await expect(bottomNav.getByRole("button", { name: "Tasks" })).toHaveAttribute("aria-current", "page");
    await expect(bottomNav.getByRole("button", { name: "Dashboard" })).not.toHaveAttribute("aria-current", "page");
  });

  test("critical dialogs can be opened and dismissed with keyboard only", async ({ page }) => {
    await signIn(page);

    await page.getByRole("button", { name: /^Add Task$/ }).click();
    const addTaskDialog = page.getByRole("dialog", { name: "Add New Task" });
    await expect(addTaskDialog).toBeVisible();
    await expect(addTaskDialog.getByLabel("Task Name")).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(addTaskDialog).toHaveCount(0);

    await page.getByRole("button", { name: /SOS/i }).click();
    const emergencyDialog = page.getByRole("dialog");
    await expect(emergencyDialog).toBeVisible();
    await expect(emergencyDialog.getByRole("button").first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(emergencyDialog).toHaveCount(0);
  });
});

test.describe("responsive accessibility guardrails", () => {
  test("large text and high contrast settings remain usable on a mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await signIn(page);

    await page.getByRole("button", { name: "Settings" }).first().click();
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();

    await page.getByRole("radio", { name: "Large" }).click();
    await page.getByRole("switch", { name: /high contrast mode/i }).click();

    const settingsRoot = page.locator(".settingsRoot");
    await expect(settingsRoot).toHaveClass(/size-large/);
    await expect(settingsRoot).toHaveClass(/highContrast/);

    const overflow = await settingsRoot.evaluate((element) => ({
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
    }));

    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
    await expect(page.getByRole("button", { name: /sign out and return to welcome screen/i })).toBeVisible();
  });
});
