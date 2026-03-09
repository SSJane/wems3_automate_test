import { test, expect } from "@playwright/test";
import { MyCasesPage } from "../../pages/FilesMenu/MyCasesPage";
import { DashboardPage } from "../../pages/DashboardPage";
import { SideNavigationBar } from "../../pages/SideNavigationBar";
import { LoginPage } from "../../pages/LoginPage";
import accountBaseData from "../../data/account_base.json";
import * as dotenv from "dotenv";
import { before } from "node:test";
dotenv.config();

// ---- Data -----
const BASE = process.env.BASE_URL_STAGING || "http://192.168.1.252";
// Admin credentials
const adminAutotestUsername = accountBaseData.users.find(
  (user) => user.id === "User1",
)?.username;
const adminAutotestPassword = accountBaseData.users.find(
  (user) => user.id === "User1",
)?.password;
// User credentials
const userAutoTestUsername = accountBaseData.users.find(
  (user) => user.id === "User2",
)?.username;
const userAutoTestPassword = accountBaseData.users.find(
  (user) => user.id === "User2",
)?.password;
// Device credentials
const deviceAutoTestUsername = accountBaseData.users.find(
  (user) => user.id === "User3",
)?.username;
const deviceAutoTestPassword = accountBaseData.users.find(
  (user) => user.id === "User3",
)?.password;

// ---- Tests ----
test.beforeAll(() => {
  if (!BASE) throw new Error("BASE_URL_STAGING is not defined");
});

test.describe("Flow A: Create --> Verify UI --> Search --> Open (core navigation)", () => {
  test.beforeEach(async ({ page }) => {
    // Login as AdminAutoTest before each test in this describe block
    const loginPage = new LoginPage(page);
    await loginPage.login(adminAutotestUsername!, adminAutotestPassword!);
  });

  test("TC-Flow-A-01: Navigate to My cases Page", async ({ page }) => {
    // Verify Dashboard is loaded
    const dashboardPage = new DashboardPage(page);
    await expect(dashboardPage.expectedDashboardWidgetsVisible()).toBeTruthy();
    // Navigate to My Cases page
    const sideNav = new SideNavigationBar(page);
    await sideNav.navigateTo("Files", "My Cases");
    // Verify My Cases page is loaded
    const myCasesPage = new MyCasesPage(page);
    await expect(myCasesPage.textHeaderMyCases).toBeVisible();
  });
  test("TC-Flow-A-02: Create a New case", async ({ page }) => {
    // Navigate to My Cases page
    const sideNav = new SideNavigationBar(page);
    await sideNav.navigateTo("Files", "My Cases");
    // Verify My Cases page is loaded
    const myCasesPage = new MyCasesPage(page);
    await expect(myCasesPage.textHeaderMyCases).toBeVisible();
    // Create a new case
    const caseID = `AUTOTEST-01`;
    const title = `Autotest-01-${Date.now()}`;
    const description = "This is a description for the autotest case.";
    const classificationSelect = "QAAndTester";

    // If the case already exists, skip creation and verify it appears in the list
    const caseCard = myCasesPage.myCaseCards
      .filter({ hasText: caseID })
      .first();
    if (!(await caseCard.isVisible())) {
      await myCasesPage.createNewCase(
        caseID,
        title,
        description,
        classificationSelect,
      );
      // Verify success message is shown
      await expect(
        myCasesPage.successToast.waitFor({ state: "visible", timeout: 5000 }),
      ).toBeTruthy();
    }
    // Verify the new case appears in the list
    await expect(myCasesPage.myCaseCards.first()).toContainText(caseID);
  });

  test("TC-Flow-A-03: Search for a case", async ({ page }) => {
    // Navigate to My Cases page
    const sideNav = new SideNavigationBar(page);
    await sideNav.navigateTo("Files", "My Cases");
    // Verify My Cases page is loaded
    const myCasesPage = new MyCasesPage(page);
    await expect(myCasesPage.textHeaderMyCases).toBeVisible();
    // Search for the case created in TC-Flow-A-02
    const caseID = `AUTOTEST-01`;
    await myCasesPage.searchCase(caseID);
    // Verify the case appears in the search results
    const caseCard = myCasesPage.myCaseCards
      .filter({ hasText: caseID })
      .first();
    await expect(caseCard).toBeVisible();
  });
});

test.describe("Flow B: Case Notes CRUD + Print + Bulk Delete", () => {
  test.beforeEach(async ({ page }) => {
    // Login as AdminAutoTest before each test in this describe block
    const loginPage = new LoginPage(page);
    await loginPage.login(adminAutotestUsername!, adminAutotestPassword!);
    // navigate to My Cases page
    const sideNav = new SideNavigationBar(page);
    await sideNav.navigateTo("Files", "My Cases");
    // Verify My Cases page is loaded
    const myCasesPage = new MyCasesPage(page);
    await expect(myCasesPage.textHeaderMyCases).toBeVisible();
    // Search for the case created in TC-Flow-A-02
    const caseID = `AUTOTEST-01`;
    await myCasesPage.searchCase(caseID);
    // Verify the case appears in the search results
    const caseCard = myCasesPage.myCaseCards
      .filter({ hasText: caseID })
      .first();
    await expect(caseCard).toBeVisible();
    if (!(await caseCard.isVisible())) {
      test.skip(true, `Case with ID ${caseID} is not available for testing`);
    } else {
      // Open the case details page
      await myCasesPage.clickCaseByTitle(caseID);
    }
  });

  test("TC-Flow-B-01: Create Case Note and TC-Flow-B-02: Add 5 valid Case notes", async ({
    page,
  }) => {
    const myCasesPage = new MyCasesPage(page);

    // Get case notes count before creating new notes
    const textCaseNotesButtonBefore =
      await myCasesPage.btnCaseNotes.textContent();
    const caseNotesCountBefore = textCaseNotesButtonBefore
      ? parseInt(textCaseNotesButtonBefore.match(/\d+/)?.[0] || "0")
      : 0;
    if (caseNotesCountBefore > 0) {
      // click case notes button
      await myCasesPage.btnCaseNotes.click();
      // Verify Case notes page is opened
      await expect(myCasesPage.textHeaderCaseNotes).toBeVisible();
      // Select All case notes and delete them to ensure a clean state for creating new case notes
      await myCasesPage.selectAllButton.click();
      await myCasesPage.btnDeleteAllNote.click();
      // Confirm delete in popup
      await myCasesPage.btnYes.click();
    }
    if (caseNotesCountBefore === 0) {
      // click case notes button
      await myCasesPage.btnCaseNotes.click();
      // Verify Case notes page is opened
      await expect(myCasesPage.textHeaderCaseNotes).toBeVisible();
    }

    // Create case note multiple times with same title to verify duplicate note handling
    const caseNoteCount = 5;
    for (let i = 0; i < caseNoteCount; i++) {
      let noteTitle = `Autotest create case note ${i + 1}`;
      let noteDescription = `This is a description for the case note. Autotest create note at ${Date.now()}`;
      await myCasesPage.createCaseNote(noteTitle, noteDescription);
      // Verify success message is shown
      await expect(
        myCasesPage.successToastCreated.waitFor({
          state: "visible",
          timeout: 5000,
        }),
      ).toBeTruthy();
    }
    // Click back button to go back to case details page
    await myCasesPage.btnCaseNotesBack.click();
    // Verify the case notes count is updated correctly
    const textCaseNotesButton = await myCasesPage.btnCaseNotes.textContent();
    const caseNotesCount = textCaseNotesButton
      ? parseInt(textCaseNotesButton.match(/\d+/)?.[0] || "0")
      : 0;

    await expect(caseNotesCount).toBe(caseNoteCount);
  });

  test("TC-Flow-B-03: Single Delete Case Note (Action button)", async ({
    page,
  }) => {
    const myCasesPage = new MyCasesPage(page);
    // Get case notes count before deletion
    const textCaseNotesButtonBeforeDeletion =
      await myCasesPage.btnCaseNotes.textContent();
    const caseNotesCountBeforeDeletion = textCaseNotesButtonBeforeDeletion
      ? parseInt(textCaseNotesButtonBeforeDeletion.match(/\d+/)?.[0] || "0")
      : 0;
    // If there are no case notes, skip the test
    if (caseNotesCountBeforeDeletion === 0) {
      test.skip(true, "No case notes available to delete");
    }
    // click case notes button
    await myCasesPage.btnCaseNotes.click();
    // Verify Case notes page is opened
    await expect(myCasesPage.textHeaderCaseNotes).toBeVisible();
    // Delete the first case note using action button
    await myCasesPage.deleteAction.first().click();
    // Confirm delete in popup
    await myCasesPage.btnYes.click();
    // Verify success message is shown
    await expect(
      myCasesPage.successToastDeleted.waitFor({
        state: "visible",
        timeout: 5000,
      }),
    ).toBeTruthy();
    // Click back button to go back to case details page
    await myCasesPage.btnCaseNotesBack.click();
    // Verify the case notes count is decreased by 1
    const textCaseNotesButtonAfterDeletion =
      await myCasesPage.btnCaseNotes.textContent();
    const caseNotesCountAfterDeletion = textCaseNotesButtonAfterDeletion
      ? parseInt(textCaseNotesButtonAfterDeletion.match(/\d+/)?.[0] || "0")
      : 0;
    console.log(
      `Case notes count after deletion: ${caseNotesCountAfterDeletion}`,
    );
    await expect(caseNotesCountAfterDeletion).toBe(
      caseNotesCountBeforeDeletion - 1,
    );
  });

  test("TC-Flow-B-04: Print Case note", async ({ page }) => {
    const myCasesPage = new MyCasesPage(page);
    // If there are no case notes, skip the test
    const textCaseNotesButton = await myCasesPage.btnCaseNotes.textContent();
    const caseNotesCount = textCaseNotesButton
      ? parseInt(textCaseNotesButton.match(/\d+/)?.[0] || "0")
      : 0;
    if (caseNotesCount === 0) {
      test.skip(true, "No case notes available to print");
    }
    // click case notes button
    await myCasesPage.btnCaseNotes.click();
    // Verify Case notes page is opened
    await expect(myCasesPage.textHeaderCaseNotes).toBeVisible();
    // Click first case note to open case note details page
    await myCasesPage.caseNoteItemPreview.first().click();
    // Click print icon of the first case note
    await myCasesPage.btnPrint.click();
    // Verify success message is shown
    await expect(myCasesPage.successToastPrint).toBeVisible({ timeout: 5000 });
  });

  test("TC-Flow-B-06: Add duplicate case note", async ({ page }) => {
    const myCasesPage = new MyCasesPage(page);
    // Get case notes count before creating duplicate note
    const textCaseNotesButtonBefore =
      await myCasesPage.btnCaseNotes.textContent();
    const caseNotesCountBefore = textCaseNotesButtonBefore
      ? parseInt(textCaseNotesButtonBefore.match(/\d+/)?.[0] || "0")
      : 0;
    // click case notes button
    await myCasesPage.btnCaseNotes.click();
    // Verify Case notes page is opened
    await expect(myCasesPage.textHeaderCaseNotes).toBeVisible();
    // Get the title of the first case note
    const titleCell = await myCasesPage.cellByHeader("Title", 0);
    const firstCaseNoteTitle = (await titleCell.textContent())?.trim() || "";
    // Try to create a new case note with the same title as the first case note
    const noteDescription = `This is a description for the duplicate case note. Created at ${Date.now()}`;
    await myCasesPage.createCaseNote(firstCaseNoteTitle, noteDescription);
    // Verify success message is shown
    await expect(myCasesPage.successToast).toBeVisible({ timeout: 5000 });
    // Click back button to go back to case details page
    await myCasesPage.btnCaseNotesBack.click();
    //  Verify the case notes count is increased by 1, which means duplicate note is allowed
    const textCaseNotesButtonAfter =
      await myCasesPage.btnCaseNotes.textContent();
    const caseNotesCountAfter = textCaseNotesButtonAfter
      ? parseInt(textCaseNotesButtonAfter.match(/\d+/)?.[0] || "0")
      : 0;
    // Verify the case notes count is increased by 1, which means duplicate note is allowed
    await expect(caseNotesCountAfter).toBe(caseNotesCountBefore + 1);
  });

  test.only("TC-Flow-B-07: Bulk Delete Case Notes", async ({ page }) => {
    const myCasesPage = new MyCasesPage(page);
    // Get case notes count before deletion
    const textCaseNotesButtonBefore =
      await myCasesPage.btnCaseNotes.textContent();
    const caseNotesCountBefore = textCaseNotesButtonBefore
      ? parseInt(textCaseNotesButtonBefore.match(/\d+/)?.[0] || "0")
      : 0;
    // If there are no case notes, skip the test
    if (caseNotesCountBefore === 0) {
      test.skip(true, "No case notes available to delete");
    }
    // click case notes button
    await myCasesPage.btnCaseNotes.click();
    // Verify Case notes page is opened
    await expect(myCasesPage.textHeaderCaseNotes).toBeVisible();
    // Click select all button to select all case notes
    await myCasesPage.selectAllButton.click();
    // Click delete all button to delete all selected case notes
    await myCasesPage.btnDeleteAllNote.click();
    // Confirm delete in popup
    await myCasesPage.btnYes.click();
    // Verify success message is shown
    await expect(myCasesPage.successToastDeleted).toBeVisible({
      timeout: 5000,
    });
    // Click back button to go back to case details page
    await myCasesPage.btnCaseNotesBack.click();
    //  Verify the case notes count is decreased to 0
    const textCaseNotesButtonAfter =
      await myCasesPage.btnCaseNotes.textContent();
    const caseNotesCountAfter = textCaseNotesButtonAfter
      ? parseInt(textCaseNotesButtonAfter.match(/\d+/)?.[0] || "0")
      : 0;
    await expect(caseNotesCountAfter).toBe(0);
  });

  test("TC-Flow-B-08: ", async ({ page }) => {});
});
