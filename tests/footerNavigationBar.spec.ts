import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { FooterNavigationBar } from "../pages/FooterNavigationBar";
import * as dotenv from "dotenv";
dotenv.config();

// ---- Data -----
const BASE = process.env.BASE_URL_STAGING || "http://192.168.1.252";
const USERNAME = process.env.TEST_USERNAME || "wolfcom";
const PASSWORD = process.env.TEST_PASSWORD || "Wolfcom_5910";

// ---- Test Case ----
test.beforeAll(() => {
  if (!BASE) throw new Error("BASE_URL_STAGING not defined.");
});
// Verify that the Wolfcom website link in the footer is visible and clickable
test.describe("Footer Navigation Bar", () => {
  // Before each test, navigate to the login page and create instances of the page objects
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.fillUsername(USERNAME);
    await loginPage.fillPassword(PASSWORD);
    await loginPage.clickSignIn();
    await loginPage.expectedDashboardVisible();
  });

  test("Verify Wolfcom website link in the footer is visible and clickable", async ({
    page,
  }) => {
    const footerNavigationBar = new FooterNavigationBar(page);

    // Verify that the Wolfcom website link is visible in the footer
    await footerNavigationBar.verifyWolfcomLinkVisible();
    // Click on the Wolfcom website link in the footer
    await footerNavigationBar.clickWolfcomLink();
    // Verify that the user is navigated to the Wolfcom website

    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
    ]);

    await newPage.waitForLoadState("domcontentloaded");
    await expect(newPage).toHaveURL(/wolfcomusa\.com/i, { timeout: 15000 });
  });
});
