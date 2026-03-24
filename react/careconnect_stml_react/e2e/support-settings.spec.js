import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";

test("contacts and settings flows surface support actions and sign out", async ({ page }) => {
  await signIn(page);

  await page.getByRole("button", { name: "Contacts" }).first().click();
  await expect(page.getByText("Primary Caregiver")).toBeVisible();

  await page.getByRole("button", { name: "Call Emergency Services" }).click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByRole("alertdialog")).toHaveCount(0);

  await page.getByRole("button", { name: "Settings" }).first().click();
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();

  await page.getByRole("button", { name: "Sign out and return to welcome screen" }).click();
  await page.getByRole("button", { name: "Sign Out" }).last().click();
  await expect(page.getByText("Welcome back")).toBeVisible();
});
