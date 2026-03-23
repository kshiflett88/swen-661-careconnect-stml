import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";

test("signed-in user can add and search for a task", async ({ page }) => {
  await signIn(page);

  await page.getByRole("button", { name: /^Add Task$/ }).click();
  const addTaskDialog = page.getByRole("dialog", { name: "Add New Task" });
  await expect(addTaskDialog).toBeVisible();

  await addTaskDialog.getByLabel("Task Name").fill("Pick up prescription");
  await addTaskDialog.getByLabel("Description").fill("Pick it up before dinner.");
  await addTaskDialog.getByLabel("Due Date").fill("2026-04-01");
  await addTaskDialog.getByLabel("Due Time").fill("18:00");
  await addTaskDialog.getByLabel("Priority").selectOption("high");
  await addTaskDialog.getByRole("button", { name: "Save" }).click();

  await expect(page.getByRole("heading", { name: "All Tasks" })).toBeVisible();
  await expect(page.getByText("Pick up prescription").first()).toBeVisible();

  await page.getByPlaceholder("Search tasks...").first().fill("prescription");
  await expect(page.getByText(/Search results for:/i)).toBeVisible();
  await expect(page.getByText("Pick up prescription").first()).toBeVisible();
});

test("task detail flow supports complete and undo", async ({ page }) => {
  await signIn(page);

  await page.getByRole("button", { name: "Tasks" }).first().click();
  await expect(page.getByRole("heading", { name: "All Tasks" })).toBeVisible();

  await page.getByText("Take morning medication").first().click();
  await page.getByRole("button", { name: "Mark Complete" }).click();

  await expect(page.getByText("Task Completed")).toBeVisible();
  await expect(page.getByRole("button", { name: "Undo Completion" })).toBeVisible();

  await page.getByRole("button", { name: "Undo Completion" }).click();
  await expect(page.getByRole("button", { name: "Mark Complete" })).toBeVisible();
});
