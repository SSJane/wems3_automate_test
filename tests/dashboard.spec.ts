import { test, expect } from "@playwright/test";
import { DashboardPage } from "../pages/DashboardPage";
import { TopNavigationBar } from "../pages/TopNavigationBar";
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

test.describe("Dashboard Page", () => {
  test("Load Dashboard Page after Login", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.fillUsername(VALID_USERNAME);
    await login.fillPassword(VALID_PASSWORD);
    await login.clickSignIn();
    await login.expectedDashboardVisible();
  });
});


