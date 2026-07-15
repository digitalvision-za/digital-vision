import { expect, test } from "@playwright/test";

test("public routes are navigable and the inquiry form gives setup-safe feedback", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Websites with a clearer point of view");

  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.locator("#mobile-navigation").getByRole("link", { name: "Services", exact: true }).click();
  } else {
    await page.getByRole("link", { name: "Services", exact: true }).click();
  }
  await expect(page).toHaveURL(/\/services$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Make the website pull its weight");

  await page.goto("/contact");
  await page.getByLabel("Your name").fill("Test Person");
  await page.getByLabel("Email address").fill("test@example.com");
  await page.getByLabel("Tell us what needs to change").fill("We need a clearer website for our growing business.");
  await page.getByRole("button", { name: "Send inquiry" }).click();
  await expect(page.getByText("secure inquiry inbox has not been configured yet")).toBeVisible();
});

test("unauthenticated visitors are redirected away from the owner workspace", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("behind the scenes");
});