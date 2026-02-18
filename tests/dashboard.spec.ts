import { test, expect } from "@playwright/test";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";
import * as dotenv from "dotenv";
dotenv.config();

// ---- Data -----
const VALID_USERNAME = process.env.TEST_USERNAME || "wolfcom";
const VALID_PASSWORD = process.env.TEST_PASSWORD || "Wolfcom_5910";

// ----- Tests -----

test.beforeAll(() => {
  if (!VALID_USERNAME || !VALID_PASSWORD) {
    throw new Error("VALID_USERNAME and VALID_PASSWORD must be provided.");
  }
});
// Login and load dashboard page before each test
test.beforeEach("Load Dashboard Page after Login", async ({ page }) => {
  const login = new LoginPage(page);
await login.goto();
    await login.fillUsername(VALID_USERNAME);
    await login.fillPassword(VALID_PASSWORD);
    await login.clickSignIn();
    await login.expectedDashboardVisible();
})

test.describe("Dashboard all widgets are visible and clickable", () => {
  test("Verify all dashboard widgets are visible", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.expectedDashboardWidgetsVisible();
  })

  test("Verify My Cases widgets is clickable", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.clickMyCases();
    await dashboard.expectedMyCasesPageVisible();
  })

  test("Verify My Photos widgets is clickable", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.clickMyPhotos();
    await dashboard.expectedMyPhotosPageVisible();
  })

  test("Verify My Videos widgets is clickable", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.clickMyVideos();
    await dashboard.expectedMyVideosPageVisible();
  })

  test("Verify All Files widgets is clickable", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.clickAllFiles();
    await dashboard.expectedAllFilesPageVisible();
  })
   
});


