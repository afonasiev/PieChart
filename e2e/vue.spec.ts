import { expect, test } from "@playwright/test";

test.describe("Pie progress real page scenarios", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders progressbars and exposes aria attributes", async ({ page }) => {
    const progressbars = page.getByRole("progressbar");

    await expect(progressbars).toHaveCount(9);
    await expect(progressbars.first()).toHaveAttribute("aria-valuemin", "0");
    await expect(progressbars.first()).toHaveAttribute("aria-valuemax", "100");
    await expect(progressbars.first()).toHaveAttribute("aria-label", /Progress/);
  });

  test("updates controlled progressbar when progress slider changes", async ({ page }) => {
    const progressSlider = page
      .locator("fieldset", { hasText: "Прогресс" })
      .locator('input[type="range"]');

    await progressSlider.fill("73");

    const controlledProgressbar = page.getByRole("progressbar").first();
    await expect(controlledProgressbar).toHaveAttribute("aria-valuenow", "73");
    await expect(controlledProgressbar).toHaveAttribute("aria-label", "Progress 73 percent");
  });

  test("switches controlled engine between svg and canvas", async ({ page }) => {
    const controlledSection = page
      .getByRole("heading", { name: "Управляемая вариация" })
      .locator("xpath=..");

    await expect(controlledSection.locator("svg[role='progressbar']")).toHaveCount(1);
    await expect(controlledSection.locator("canvas[role='progressbar']")).toHaveCount(0);

    const engineSwitch = page
      .locator("fieldset", { hasText: "Svg or Canvas" })
      .locator('input[type="checkbox"]');
    await engineSwitch.click();

    await expect(controlledSection.locator("svg[role='progressbar']")).toHaveCount(0);
    await expect(controlledSection.locator("canvas[role='progressbar']")).toHaveCount(1);
  });

  test("maps status to fixed aria values", async ({ page }) => {
    const controlledProgressbar = page.getByRole("progressbar").first();

    await page
      .locator("fieldset", { hasText: "Статус" })
      .locator('input[type="radio"][value="success"]')
      .check();
    await expect(controlledProgressbar).toHaveAttribute("aria-valuenow", "100");
    await expect(controlledProgressbar).toHaveAttribute("aria-label", "Progress success");

    await page
      .locator("fieldset", { hasText: "Статус" })
      .locator('input[type="radio"][value="warning"]')
      .check();
    await expect(controlledProgressbar).toHaveAttribute("aria-valuenow", "75");
    await expect(controlledProgressbar).toHaveAttribute("aria-label", "Progress warning");

    await page
      .locator("fieldset", { hasText: "Статус" })
      .locator('input[type="radio"][value="error"]')
      .check();
    await expect(controlledProgressbar).toHaveAttribute("aria-valuenow", "50");
    await expect(controlledProgressbar).toHaveAttribute("aria-label", "Progress error");
  });

});

test.describe("Pie chart page scenarios", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/circle");
  });

  test("renders all three pie chart engines", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "ChartJs" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Custom SVG" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Custom Canvas" })).toBeVisible();
  });

  test("removes sector from control panel", async ({ page }) => {
    const panelSection = page.locator("section", {
      has: page.getByRole("button", { name: "Добавить сектор" }),
    });
    const panelRows = panelSection.locator("ul > li");

    await expect(panelRows).toHaveCount(5);
    await panelRows.first().locator("button").nth(1).click();
    await expect(panelRows).toHaveCount(4);
  });

  test("edits existing sector using modal form", async ({ page }) => {
    const panelSection = page.locator("section", {
      has: page.getByRole("button", { name: "Добавить сектор" }),
    });
    const firstRow = panelSection.locator("ul > li").first();

    await firstRow.locator("button").first().click();

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await expect(modal.getByRole("heading", { name: "Редактирование сектора" })).toBeVisible();

    await modal.locator('input[type="text"]:not([disabled])').first().fill("Сектор 1 обновлён");
    await modal.getByRole("button", { name: "Сохранить сектор" }).click();

    await expect(panelSection.getByText("Сектор 1 обновлён")).toBeVisible();
  });
});

