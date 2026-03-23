import { expect } from "@playwright/test";

export async function signIn(page) {
  await page.goto("/");
  await page.getByRole("button", { name: /sign in with this device/i }).click();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
}
