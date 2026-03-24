import { expect, test } from "@playwright/test";

test("help flow lets a user request caregiver assistance", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: /need help signing in/i }).click();
  await expect(page.getByText("Having trouble signing in?")).toBeVisible();

  await page.getByRole("button", { name: "Contact Caregiver" }).click();
  const confirmDialog = page.getByRole("alertdialog", { name: "Contact caregiver?" });
  await expect(confirmDialog).toBeVisible();

  await confirmDialog.getByRole("button", { name: "Contact" }).click();
  await expect(page.getByText(/Caregiver request sent/i)).toBeVisible();
});
