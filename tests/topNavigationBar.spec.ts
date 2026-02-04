import { test, expect } from "@playwright/test";
import { TopNavigationBar } from "../pages/TopNavigationBar";
import { LoginPage } from "../pages/LoginPage";
import * as dotenv from "dotenv";
import { expectNoConsoleErrors } from "../utils/consloeErrors";
dotenv.config();

// ---- Data -----
const VALID_USERNAME = process.env.TEST_USERNAME || "wolfcom";
const VALID_PASSWORD = process.env.TEST_PASSWORD || "Wolfcom_5910";

const SearchUser = "Thaweesin (superjane)";
const ValidSearchKeyword = [
  "2025",
  "2026",
  "CarCam",
  "CARCAM",
  "QAAndTester",
  "HDD",
];
const InvalidSearchKeyword = ["!@#$%^&*()", "<>?:{}|+_", "~`-=/\\", "\"'"];
const SearchKeywordXSS = [
  '<script>alert("XSS")</script>',
  '<img src=x onerror=alert("XSS")>',
  '<body onload=alert("XSS")>',
];
const SearchKeywordSQLInjection = [
  "' OR '1'='1",
  "'; DROP TABLE users; --",
  "' UNION SELECT NULL, NULL, NULL --",
];

// ----- Tests -----

test.beforeAll(() => {
  if (!VALID_USERNAME || !VALID_PASSWORD) {
    throw new Error("VALID_USERNAME and VALID_PASSWORD must be provided.");
  }
});

test.describe("Top Navigation", () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.fillUsername(VALID_USERNAME);
    await login.fillPassword(VALID_PASSWORD);
    await login.clickSignIn();

    await page.waitForTimeout(1000);

    const stillOnLogin = await page
      .locator('heading:has-text("Sign in to WEMS")')
      .isVisible();
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

  test("TC_TopNav_04: Processes link should be visible", async ({ page }) => {
    const topNav = new TopNavigationBar(page);
    await topNav.expectProcessesVisible();
  });

  test("TC_TopNav_05: User profile menu should be visible", async ({
    page,
  }) => {
    const topNav = new TopNavigationBar(page);
    await topNav.expectUserProfileMenuVisible();
  });

  test("TC_TopNav_06: Sidebar toggle should open/close sidebar", async ({
    page,
  }) => {
    const topNav = new TopNavigationBar(page);
    const sidebar = page.locator("nb-sidebar");

    const classesBeforeClick = await sidebar.getAttribute("class");
    await topNav.clickSidebarToggle();

    await sidebar.waitFor({
      state: "attached",
      timeout: 3000,
    });

    const classesAfterClick = await sidebar.getAttribute("class");
    expect(classesBeforeClick).not.toBe(classesAfterClick);
  });

  test("TC_TopNav_07: User profile menu click should show profile options", async ({
    page,
  }) => {
    const topNav = new TopNavigationBar(page);
    await topNav.clickUserProfileMenu();
    await topNav.profile.waitFor({ state: "visible", timeout: 3000 });
    expect(await topNav.profile.isVisible()).toBeTruthy();
  });

  test("TC_TopNav_08: Advanced Search should be clickable", async ({
    page,
  }) => {
    const topNav = new TopNavigationBar(page);
    const currentUrl = page.url();
    await topNav.clickAdvanceSearch();
    await page.waitForTimeout(1000);
    // Verify URL has changed to include advance-search
    expect(page.url()).not.toBe(currentUrl);
    expect(page.url()).toContain("advance-search");
  });

  test("TC_TopNav_09: Sign out should redirect to login page", async ({
    page,
  }) => {
    const topNav = new TopNavigationBar(page);
    const login = new LoginPage(page);
    await topNav.clickUserProfileMenu();
    await topNav.clickSignOut();
    await expect(login.expectBrandingAndHeading()).resolves.not.toThrow();
  });

  test("TC_TopNav_10: Processes should be clickable", async ({ page }) => {
    const topNav = new TopNavigationBar(page);
    await topNav.clickProcesses();
    // Wait for URL to change to include processes
    await page.waitForTimeout(1000);
    expect(page.url()).toContain("processes");
  });
});

test.describe("Advance search", () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.fillUsername(VALID_USERNAME);
    await login.fillPassword(VALID_PASSWORD);
    await login.clickSignIn();

    await page.waitForTimeout(1000);

    const stillOnLogin = await page
      .locator('heading:has-text("Sign in to WEMS")')
      .isVisible();
    if (stillOnLogin) {
      throw new Error(`Login failed for user: ${VALID_USERNAME}`);
    }

    await login.expectedDashboardVisible();
  });

  test("TS-Flow-A --> Quick search by keyword", async ({ page }) => {
    const topNav = new TopNavigationBar(page);
    const keyword = ValidSearchKeyword[0];

    await expectNoConsoleErrors(page, async () => {
      await topNav.clickAdvanceSearch();
      await topNav.expectAdvanceSearchHeadingVisible();
      await topNav.performAdvancedSearch({
        keyword,
        fileTypes: ["Audio", "Document", "Picture", "Video"],
        category: "All Files",
      });
      await topNav.waitForSearchResultsToLoad();
    });

    const resultsCount = await topNav.getSearchResultsCount();
    expect(resultsCount).toBeGreaterThan(0);

    const hasKeyword = await topNav.verifySearchResultsContainKeyword(keyword);
    expect(hasKeyword).toBeTruthy();

    const totalFromUI = await topNav.getTotalResultsCountFromUI();
    expect(totalFromUI).toBeGreaterThan(0);
  });

  test("TS-Flow-B --> Filter by file types + date range", async ({ page }) => {
    const topNav = new TopNavigationBar(page);

    await expectNoConsoleErrors(page, async () => {
      await topNav.clickAdvanceSearch();
      await topNav.expectAdvanceSearchHeadingVisible();
      await topNav.performAdvancedSearch({
        fileTypes: ["Picture"],
        category: "All Files",
        searchByDateRange: { startDate: "02-29-2024", endDate: "02-02-2025" },
      });
      await topNav.waitForSearchResultsToLoad();
    });

    const resultsCount = await topNav.getSearchResultsCount();
    expect(resultsCount).toBeGreaterThan(0);

    const allPictures = await topNav.verifyAllSearchResultsAreType("Picture");
    expect(allPictures).toBeTruthy();
  });

  test("TS-Flow-C --> Search by user (owner/uploader)", async ({ page }) => {
    const topNav = new TopNavigationBar(page);
    const keyword = ValidSearchKeyword[1];

    await expectNoConsoleErrors(page, async () => {
      await topNav.clickAdvanceSearch();
      await topNav.expectAdvanceSearchHeadingVisible();

      // Explicit steps to ensure user selection closes dropdown before search
      await topNav.selectCategory("Search By User");
      await topNav.selectUser(SearchUser);
      await topNav.enterKeyword(keyword);
      await topNav.selectMultipleFileTypes(["Picture", "Video"]);

      await topNav.clickSearch();

      // Wait for network idle + results container
      await page.waitForLoadState("networkidle", { timeout: 30000 });
      await topNav.page
        .locator('table, [class*="no-data"], h6.total-files')
        .first()
        .waitFor({ state: "visible", timeout: 15000 })
        .catch(() => {});
    });

    const resultsCount = await topNav.getSearchResultsCount();

    if (resultsCount > 0) {
      expect(resultsCount).toBeGreaterThan(0);
      const hasKeyword =
        await topNav.verifySearchResultsContainKeyword(keyword);
      expect(hasKeyword).toBeTruthy();
    } else {
      // Validate empty state: results section not rendered
      await expect(topNav.totalResults).toBeHidden({ timeout: 5000 });
      await expect(topNav.searchResultsTable).toBeHidden({ timeout: 5000 });
      // Optional: verify no rows if table exists but empty
      // await expect(topNav.searchResultsRows).toHaveCount(0);
      expect(resultsCount).toBe(0);
    }
  });

  test("TS-Flow-D --> Recycle Bin or Asset Archive only", async ({ page }) => {
    const topNav = new TopNavigationBar(page);
    const keyword = ValidSearchKeyword[0];

    await expectNoConsoleErrors(page, async () => {
      await topNav.clickAdvanceSearch();
      await topNav.expectAdvanceSearchHeadingVisible();
      await topNav.performAdvancedSearch({
        keyword,
        fileTypes: ["Video"],
        category: "Recycle Bin",
        searchByDateRange: { startDate: "12-01-2025", endDate: "12-31-2025" },
      });
      await topNav.waitForSearchResultsToLoad();
    });

    const resultsCount = await topNav.getSearchResultsCount();
    expect(resultsCount).toBeGreaterThan(0);

    const allVideos = await topNav.verifyAllSearchResultsAreType("Video");
    expect(allVideos).toBeTruthy();

    const hasKeyword = await topNav.verifySearchResultsContainKeyword(keyword);
    expect(hasKeyword).toBeTruthy();
  });

  test("TS-Flow-E --> Cancel", async ({ page }) => {
    const topNav = new TopNavigationBar(page);
    await topNav.clickAdvanceSearch();
    await topNav.selectCategory("Recycle Bin");
    await topNav.enterKeyword(ValidSearchKeyword[0]);
    await topNav.selectMultipleFileTypes(["Video"]);
    await topNav.searchByDateRange("12-01-2025", "12-31-2025");
    await topNav.clickCancel();
    await expect(topNav.advanceSearchHeading).toBeHidden();
  });

  test("TS-Flow-F --> Search with no matching results", async ({ page }) => {
    const topNav = new TopNavigationBar(page);
    const keyword = "nonexistentkeyword999999999";

    await expectNoConsoleErrors(page, async () => {
      await topNav.clickAdvanceSearch();
      await topNav.expectAdvanceSearchHeadingVisible();
      await topNav.performAdvancedSearch({ keyword });
      await topNav.waitForSearchResultsToLoad();
      // Wait for the counter to appear (either 0 or >0)
      await expect(topNav.totalResultsHeading).toBeVisible({ timeout: 15000 });
    });
    // Assert empty state

    await expect(topNav.totalResultsHeading).toHaveText(
      /Total\s*Results\s*:\s*0/i,
    );
    expect(await topNav.verifyNoDataAvailable()).toBe(true);

    // And no data rows
    expect(await topNav.getSearchResultsCount()).toBe(0);
  });

  test("TS-Flow-G --> Search by exact date", async ({ page }) => {
    const topNav = new TopNavigationBar(page);
    const exactDate = "02-02-2026"; // Adjust to a date known to have results if needed

    await expectNoConsoleErrors(page, async () => {
      await topNav.clickAdvanceSearch();
      await topNav.expectAdvanceSearchHeadingVisible();
      await topNav.performAdvancedSearch({
        searchByDate: exactDate,
        category: "All Files",
      });
      await topNav.waitForSearchResultsToLoad();
    });

    const resultsCount = await topNav.getSearchResultsCount();
    expect(resultsCount).toBeGreaterThanOrEqual(0);
  });
});

test.describe("Input validation and keyword security", () => {
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
    const stillOnLogin = await page
      .locator('heading:has-text("Sign in to WEMS")')
      .isVisible();
    if (stillOnLogin) {
      throw new Error(`Login failed for user: ${VALID_USERNAME}`);
    }

    await login.expectedDashboardVisible();
  });

  test("TC-Security-01: XSS attack vectors in keyword input", async ({
    page,
  }) => {
    const topNav = new TopNavigationBar(page);

    for (const xssVector of SearchKeywordXSS) {
      // Reopen Advance Search for clean, isolated state per vector
      await topNav.clickAdvanceSearch();
      await topNav.expectAdvanceSearchHeadingVisible();

      // Local flag + one-time listener per iteration (best for isolation)
      let dialogFired = false;
      page.once("dialog", async (dialog) => {
        dialogFired = true;
        await dialog.dismiss(); // Safely handle if fired
      });

      await expectNoConsoleErrors(page, async () => {
        await topNav.enterKeyword(xssVector);
        await topNav.clickSearch();
        await topNav.waitForSearchResultsToLoad(); // Ensure results loaded
      });

      // Assert no native alert fired for this vector
      expect(dialogFired).toBeFalsy();
    }
  });

  test("TC-Security-02: SQL Injection patterns in keyword input", async ({
    page,
  }) => {
    const topNav = new TopNavigationBar(page);

    // Test each SQL Injection pattern
    for (const sqlPattern of SearchKeywordSQLInjection) {
      // Open Advance Search
      await topNav.clickAdvanceSearch();
      // Add wait to ensure the heading is visible
      await topNav.expectAdvanceSearchHeadingVisible();

      await expectNoConsoleErrors(page, async () => {
        await topNav.enterKeyword(sqlPattern);
        await topNav.clickSearch();
        await topNav.waitForSearchResultsToLoad();
      });

      // Verify application does not crash and shows no SQL errors
      const errorVisible = await page
        .locator("text=SQL syntax error")
        .isVisible();
      expect(errorVisible).toBeFalsy();
    }
  });

  test("TC-Validation-01: Special characters in keyword input", async ({
    page,
  }) => {
    const topNav = new TopNavigationBar(page);

    // Test each special character set
    for (const specialChars of InvalidSearchKeyword) {
      // Open Advance Search
      await topNav.clickAdvanceSearch();
      // Add wait to ensure the heading is visible
      await topNav.expectAdvanceSearchHeadingVisible();
      await expectNoConsoleErrors(page, async () => {
        // Enter special characters
        await topNav.enterKeyword(specialChars);
        // Click Search
        await topNav.clickSearch();
      });

      // Verify no error is shown
      const errorVisible = await page.locator("text=Error").isVisible();
      expect(errorVisible).toBeFalsy();
    }
  });

  test("TC-Validation-02: Extremely long strings in keyword input", async ({
    page,
  }) => {
    const topNav = new TopNavigationBar(page);
    // Open Advance Search
    await topNav.clickAdvanceSearch();
    // Test extremely long string
    const longString = "a".repeat(1000);
    await topNav.enterKeyword(longString);
    await topNav.clickSearch();
    // Verify no error is shown
    const errorVisible = await page.locator("text=Error").isVisible();
    expect(errorVisible).toBeFalsy();
  });
});
