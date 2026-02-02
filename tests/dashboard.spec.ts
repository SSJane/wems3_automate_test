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

test.describe("Top Navigation", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    const login = new LoginPage(page);
    await login.goto();
    await login.fillUsername(VALID_USERNAME);
    await login.fillPassword(VALID_PASSWORD);
    await login.clickSignIn();
    
    // Wait for any validation errors first
    await page.waitForTimeout(1000);
    
    // Check if we're still on login page (failed login)
    const stillOnLogin = await page.locator('heading:has-text("Sign in to WEMS")').isVisible();
    if (stillOnLogin) {
      throw new Error(`Login failed for user: ${VALID_USERNAME}`);
    }
    
    await login.expectedDashboardVisible();
  });

  test("TC_TopNav_01: Logo should be visible", async ({ page }) => {
    const topNav = new TopNavigationBar(page);
    await topNav.expectLogoVisible();
  });

  test("TC_TopNav_02: Sidebar toggle button should be visible", async ({
    page,
  }) => {
    const topNav = new TopNavigationBar(page);
    await topNav.expectSidebarToggleVisible();
  });

  test("TC_TopNav_03: Advanced Search link should be visible", async ({
    page,
  }) => {
    const topNav = new TopNavigationBar(page);
    await topNav.expectAdvanceSearchVisible();
  });

  test("TC_TopNav_04: User profile menu should be visible", async ({
    page,
  }) => {
    const topNav = new TopNavigationBar(page);
    await topNav.expectUserProfileMenuVisible();
  });

  test("TC_TopNav_05: Sidebar toggle should open/close sidebar", async ({
    page,
  }) => {
    const topNav = new TopNavigationBar(page);
    const sidebar = page.locator("nb-sidebar");

    // Check if sidebar has a collapsed class initially
    const classesBeforeClick = await sidebar.getAttribute("class");
    
    // Click toggle
    await topNav.clickSidebarToggle();
    
    // Wait for class to change
    await sidebar.waitFor({ 
      state: "attached",
      timeout: 3000 
    });
    
    const classesAfterClick = await sidebar.getAttribute("class");
    
    // Verify the class or attribute changed
    expect(classesBeforeClick).not.toBe(classesAfterClick);
  });

  test("TC_TopNav_06: User profile menu click should show profile options", async ({
    page,
  }) => {
    const topNav = new TopNavigationBar(page);
    await topNav.clickUserProfileMenu();
    await topNav.profile.waitFor({ state: "visible", timeout: 3000 });
    expect(await topNav.profile.isVisible()).toBeTruthy();
  });

  test("TC_TopNav_07: Advanced Search should be clickable", async ({
    page,
  }) => {
    const topNav = new TopNavigationBar(page);
    const currentUrl = page.url();
    await topNav.clickAdvanceSearch();
    await page.waitForTimeout(1000);
    const newUrl = page.url();
    // URL should change after clicking Advanced Search
    expect(newUrl).not.toBe(currentUrl);
  });
});
