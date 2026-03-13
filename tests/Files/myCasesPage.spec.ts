import { test, expect } from "@playwright/test";
import { MyCasesPage } from "../../pages/FilesMenu/MyCasesPage";
import { DashboardPage } from "../../pages/DashboardPage";
import { SideNavigationBar } from "../../pages/SideNavigationBar";
import { LoginPage } from "../../pages/LoginPage";
import accountBaseData from "../../data/account_base.json";
import { uploadToCase } from "../../utils/uploadMultiple";
import { TopNavigationBar } from "../../pages/TopNavigationBar";
import * as dotenv from "dotenv";
dotenv.config();

function casePrefix(workerIndex: number): string {
  return `AF-W${workerIndex}`;
}

// Prefix for Flow A / Flow B cases (separate namespace from Flow C)
function abCasePrefix(workerIndex: number): string {
  return `AT-W${workerIndex}`;
}

// ── Upload file fixtures ──────────────────────────────────────────────────
// One place to update if a filename changes.
//
// FILES_SLOT_1 → case slot -1  (TC-C-01, C-08, C-09)
const FILES_SLOT_1 = [
  "data\\files\\audios\\20251219_153423_CMD300008.aac",
  "data\\files\\document\\WEMS2.0-on-prem.docx",
  "data\\files\\images\\Screenshot-2026-02-23-085500.png",
  "data\\files\\videos\\delete-case-on-wems3.0.mp4",
  "data\\files\\images\\Screenshot-2026-02-23-104021.png",
] as const;

// FILES_SLOT_2 → case slot -2  (TC-C-10, C-11)
const FILES_SLOT_2 = [
  "data\\files\\audios\\20251219_153423_CMD300008.aac",
  "data\\files\\document\\WEMS2.0-on-prem.docx",
  "data\\files\\images\\Screenshot-2026-02-23-085500.png",
] as const;

// FILES_SLOT_3 → case slot -3  (TC-C-04, C-05, C-06, C-07)
const FILES_SLOT_3 = [
  "data\\files\\audios\\20251219_153445_CMD300008.aac",
  "data\\files\\document\\WEMS3.0-on-prem.docx",
  "data\\files\\images\\Screenshot-2026-02-23-104818.png",
  "data\\files\\videos\\BS-extr-cannot-change-system-to-WEMS3.0.mp4",
] as const;

const FILE_UNSUPPORTED = "data\\files\\invalidFilesType\\README.md";
const FILE_OVERSIZED =
  "data\\files\\oversize\\BodyCam-H2-202602120142504867.mp4";

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
    // prefix added to all Flow A tests so workers don't share the same case
    const loginPage = new LoginPage(page);
    await loginPage.login(adminAutotestUsername!, adminAutotestPassword!);
  });

  test("TC-Flow-A-01: Navigate to My cases Page", async ({ page }) => {
    test
      .info()
      .annotations.push(
        {
          type: "Expected Result 1",
          description: "The My Cases page opens correctly.",
        },
        {
          type: "Expected Result 2",
          description: "No errors are displayed on the page.",
        },
      );
    // Verify Dashboard is loaded
    const dashboardPage = new DashboardPage(page);
    await expect(dashboardPage.dashboardMyCases).toBeVisible();
    // Navigate to My Cases page
    const sideNav = new SideNavigationBar(page);
    await sideNav.navigateTo("Files", "My Cases");
    // Verify My Cases page is loaded
    const myCasesPage = new MyCasesPage(page);
    await expect(myCasesPage.textHeaderMyCases).toBeVisible();
  });
  test("TC-Flow-A-02: Create a New case", async ({ page }, workerInfo) => {
    test
      .info()
      .annotations.push(
        {
          type: "Expected Result 1",
          description: "The case folder is created successfully.",
        },
        {
          type: "Expected Result 2",
          description:
            "The metadata is displayed correctly, including: Case ID, Case Title.",
        },
      );
    // Navigate to My Cases page
    const sideNav = new SideNavigationBar(page);
    await sideNav.navigateTo("Files", "My Cases");
    // Verify My Cases page is loaded
    const myCasesPage = new MyCasesPage(page);
    await expect(myCasesPage.textHeaderMyCases).toBeVisible();
    // Create a new case
    const caseID = `${abCasePrefix(workerInfo.workerIndex)}-01`;
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
        myCasesPage.createdCaseSuccessToast.waitFor({
          state: "visible",
          timeout: 5000,
        }),
      ).toBeTruthy();
    }
    // Verify the new case appears in the list
    await expect(myCasesPage.myCaseCards.first()).toContainText(caseID);
  });

  test("TC-Flow-A-03: Search for a case", async ({ page }, workerInfo) => {
    test
      .info()
      .annotations.push(
        {
          type: "Expected Result 1",
          description:
            "The search results correctly display all cases containing '01' in either the Case ID or Case Title.",
        },
        {
          type: "Expected Result 2",
          description:
            "The case folder named 'Auto test create 01' opens successfully.",
        },
      );
    // Navigate to My Cases page
    const sideNav = new SideNavigationBar(page);
    await sideNav.navigateTo("Files", "My Cases");
    // Verify My Cases page is loaded
    const myCasesPage = new MyCasesPage(page);
    await expect(myCasesPage.textHeaderMyCases).toBeVisible();
    // Search for the case created in TC-Flow-A-02
    const caseID = `${abCasePrefix(workerInfo.workerIndex)}-01`;
    await myCasesPage.searchCase(caseID);
    // Verify the case appears in the search results
    const caseCard = myCasesPage.myCaseCards
      .filter({ hasText: caseID })
      .first();
    await expect(caseCard).toBeVisible();
  });
});

test.describe("Flow B: Case Notes CRUD + Print + Bulk Delete", () => {
  test.beforeAll(async ({ browser }, workerInfo) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.login(adminAutotestUsername!, adminAutotestPassword!);
    const sideNav = new SideNavigationBar(page);
    await sideNav.navigateTo("Files", "My Cases");
    const myCasesPage = new MyCasesPage(page);
    await expect(myCasesPage.textHeaderMyCases).toBeVisible();

    const caseID = `${abCasePrefix(workerInfo.workerIndex)}-01`;
    await myCasesPage.searchCase(caseID);
    const caseCard = myCasesPage.myCaseCards
      .filter({ hasText: caseID })
      .first();
    if (!(await caseCard.isVisible())) {
      const title = `Autotest W${workerInfo.workerIndex}-${Date.now()}`;
      const description = `Worker ${workerInfo.workerIndex} case for Flow B.`;
      await myCasesPage.createNewCase(
        caseID,
        title,
        description,
        "QAAndTester",
      );
      await expect(caseCard).toBeVisible();
      console.log(
        `[W${workerInfo.workerIndex}] Flow B: created case ${caseID}`,
      );
    }
    await context.close();
  });

  test.beforeEach(async ({ page }, workerInfo) => {
    // Login as AdminAutoTest before each test in this describe block
    const loginPage = new LoginPage(page);
    await loginPage.login(adminAutotestUsername!, adminAutotestPassword!);
    // navigate to My Cases page
    const sideNav = new SideNavigationBar(page);
    await sideNav.navigateTo("Files", "My Cases");
    // Verify My Cases page is loaded
    const myCasesPage = new MyCasesPage(page);
    await expect(myCasesPage.textHeaderMyCases).toBeVisible();
    // Search for the case created in beforeAll
    const caseID = `${abCasePrefix(workerInfo.workerIndex)}-01`;
    await myCasesPage.searchCase(caseID);
    // Check case visibility — skip all Flow B tests if prerequisite case is missing
    const caseCard = myCasesPage.myCaseCards
      .filter({ hasText: caseID })
      .first();
    if (!(await caseCard.isVisible())) {
      test.skip(true, `Case with ID ${caseID} is not available`);
      return;
    }
    // Open the case details page
    await myCasesPage.clickCaseByCaseID(caseID);
  });

  test("TC-Flow-B-01: Create Case Note and TC-Flow-B-02: Add 5 valid Case notes", async ({
    page,
  }) => {
    const myCasesPage = new MyCasesPage(page);
    test
      .info()
      .annotations.push(
        {
          type: "Expected Result 1",
          description:
            "The Case Notes button is displayed after opening the case folder.",
        },
        {
          type: "Expected Result 2",
          description:
            "A success toast message appears after adding each case note.",
        },
        {
          type: "Expected Result 3",
          description: "The Case Notes count increases accordingly (to 5).",
        },
      );

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
      // Verify create note success message is shown
      await expect(
        myCasesPage.createCaseNoteSuccessToast.waitFor({
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
    test
      .info()
      .annotations.push(
        {
          type: "Expected Result 1",
          description:
            "A Delete Confirmation pop-up appears with Title: 'Delete Confirmation', message, and Yes/No buttons.",
        },
        {
          type: "Expected Result 2",
          description:
            "A success toast message appears: 'Case note deleted successfully.'",
        },
        {
          type: "Expected Result 3",
          description: "The Case Notes count decreases by 1.",
        },
      );
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
    test
      .info()
      .annotations.push({
        type: "Expected Result 1",
        description:
          "A success toast message appears: 'Case note will download shortly.'",
      });
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
    test
      .info()
      .annotations.push(
        {
          type: "Expected Result 1",
          description:
            "A success toast message appears after creating the duplicate note.",
        },
        {
          type: "Expected Result 2",
          description: "The Case Notes count increases by 1.",
        },
        {
          type: "Expected Result 3",
          description:
            "The system allows creating a Case Note with the same title (duplicate titles are permitted).",
        },
      );
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
    // Verify create case note success message is shown
    await expect(myCasesPage.createCaseNoteSuccessToast).toBeVisible({
      timeout: 5000,
    });
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

  test("TC-Flow-B-07: Bulk Delete Case Notes", async ({ page }) => {
    const myCasesPage = new MyCasesPage(page);
    test
      .info()
      .annotations.push(
        {
          type: "Expected Result 1",
          description: "All case notes are deleted successfully.",
        },
        {
          type: "Expected Result 2",
          description: "The Case Notes count is updated and shows 0.",
        },
      );
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

  test("TC-Flow-B-08: Verify Title field is required", async ({ page }) => {
    const myCasesPage = new MyCasesPage(page);
    test
      .info()
      .annotations.push(
        {
          type: "Expected Result 1",
          description:
            "The Submit button is disabled, preventing the user from submitting empty metadata.",
        },
        {
          type: "Expected Result 2",
          description:
            "The system displays a validation message indicating that the Title field is required.",
        },
      );
    // click case notes button
    await myCasesPage.btnCaseNotes.click();
    // Verify Case notes page is opened
    await expect(myCasesPage.textHeaderCaseNotes).toBeVisible();
    // Try to create a case note without filling the title field
    const noteDescription = `This is a description for the case note without title. Created at ${Date.now()}`;
    // Create case note with empty title and verify title is required
    await myCasesPage.createCaseNote("", noteDescription);
    // Verify title is required
    await expect(myCasesPage.inputTitleAlert).toBeVisible();
    // Verify submit button is disabled
    await expect(myCasesPage.btnSubmit).toBeDisabled();
  });

  test.afterAll(async ({ browser }, workerInfo) => {
    // Cleanup: Search and delete the case created for testing
    const context = await browser.newContext();
    const page = await context.newPage();
    // Login as AdminAutoTest
    const loginPage = new LoginPage(page);
    await loginPage.login(adminAutotestUsername!, adminAutotestPassword!);
    // navigate to My Cases page
    const sideNav = new SideNavigationBar(page);
    await sideNav.navigateTo("Files", "My Cases");
    // Verify My Cases page is loaded
    const myCasesPage = new MyCasesPage(page);
    await expect(myCasesPage.textHeaderMyCases).toBeVisible();
    // Search for the case created
    const caseID = `${abCasePrefix(workerInfo.workerIndex)}-01`;
    await myCasesPage.searchCase(caseID);
    const caseCard = myCasesPage.myCaseCards
      .filter({ hasText: caseID })
      .first();
    // If the case is found, delete it
    if (await caseCard.isVisible()) {
      await myCasesPage.clickDeleteCaseCard(caseID);
      await expect(myCasesPage.successToastDeletedCard).toBeVisible({
        timeout: 5000,
      });
    } else {
      console.warn(`Case with ID ${caseID} is not found for cleanup`);
    }

    await context.close();
  });
});

test.describe("Flow C: Case files - Upload -> Upload Metadata -> Download -> Remove", () => {
  test.use({ actionTimeout: 10000 }); // fast-fail on missing elements during cleanup

  // ── ONE-TIME setup: create 3 cases ──────────────────────────────────
  test.beforeAll(async ({ browser }, workerInfo) => {
    const prefix = casePrefix(workerInfo.workerIndex);
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.login(adminAutotestUsername!, adminAutotestPassword!);
    const sideNav = new SideNavigationBar(page);
    await sideNav.navigateTo("Files", "My Cases");
    const myCasesPage = new MyCasesPage(page);
    await expect(myCasesPage.textHeaderMyCases).toBeVisible();

    for (let i = 1; i <= 3; i++) {
      const caseID = `${prefix}-${i}`;
      const caseCard = myCasesPage.myCaseCards
        .filter({ hasText: caseID })
        .first();
      if (!(await caseCard.isVisible())) {
        await myCasesPage.createNewCase(
          caseID,
          `Autotest File ${i}-${Date.now()}`,
          `This is a description for the autotest file case ${i}.`,
          "QAAndTester",
        );
      } else {
        console.warn(
          `Case with ID ${caseID} already exists, skipping creation`,
        );
      }
      await expect(caseCard).toBeVisible();
    }
    await context.close();
  });

  // ── PER-TEST setup: login + navigate only ───────────────────────────
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(adminAutotestUsername!, adminAutotestPassword!);
    const sideNav = new SideNavigationBar(page);
    await sideNav.navigateTo("Files", "My Cases");
    const myCasesPage = new MyCasesPage(page);
    await expect(myCasesPage.textHeaderMyCases).toBeVisible();
  });

  test("TC-FLOW-C-01: Upload several valid files", async ({
    page,
  }, workerInfo) => {
    const prefix = casePrefix(workerInfo.workerIndex);
    const myCasesPage = new MyCasesPage(page);
    test
      .info()
      .annotations.push(
        {
          type: "Expected Result 1",
          description:
            "A success toast: 'Files are ready to upload. Please click upload button to start uploading files.'",
        },
        {
          type: "Expected Result 2",
          description:
            "After confirming upload, a second success toast: 'File(s) uploaded successfully.'",
        },
        {
          type: "Expected Result 3",
          description:
            "The uploaded files appear in the Case Files list with correct metadata (type, size, title, classification, uploaded by, date).",
        },
      );
    // Search for the first case created for file upload testing
    const caseID = `${prefix}-1`;
    await myCasesPage.searchCase(caseID);
    // Verify the case appears in the search results
    const caseCard = myCasesPage.myCaseCards
      .filter({ hasText: caseID })
      .first();
    await expect(caseCard).toBeVisible();
    // Open the case details page
    await myCasesPage.clickCaseByCaseID(caseID);
    // Verify case details page is loaded
    await myCasesPage.expectOpenCaseDetailPage(caseID);
    // Click uload button to open upload dialog
    await myCasesPage.clickUploadButton();
    // Verify upload page is opened
    await expect(myCasesPage.textHeaderUpload).toBeVisible();
    // Upload multiple files to the case (5 files)
    const filesToUpload = [...FILES_SLOT_1];
    // Count of files to be uploaded is determined by the length of filesToUpload array
    const fileCount = filesToUpload.length;
    // Call the uploadToCase utility function to perform the upload
    await uploadToCase(page, filesToUpload, {
      // Optionally specify locators if the defaults do not work
      scope: myCasesPage.page.locator(".upload-to-case-dialog"),
      input: 'input[type="file"]',
      browseLink: myCasesPage.page.getByRole("link", {
        name: /Click to browse/i,
      }),
      dropzone: myCasesPage.page
        .getByText(/Drag & Drop files here/i)
        .locator(".."),
    });
    // Click upload button to start uploading files
    await myCasesPage.uploadButton.click();
    // Wait for the upload to complete and verify success message is shown
    await myCasesPage.waitForUploadToFinish();
    // Verify Successful toast appear
    await expect(myCasesPage.successToastUploaded).toBeVisible();
    // **Debug**
    const handle = await myCasesPage.successToastUploaded.elementHandles();
    //console.log("Located error toast element:", handle ? "FOUND" : "NOT FOUND");
    // Click back button to go back to My Cases page
    await myCasesPage.btnBackToMyCases.click();
    // Verify the My Cases page is loaded again
    await expect(myCasesPage.textHeaderMyCases).toBeVisible();
    // Search for the first case created for file upload testing
    await myCasesPage.searchCase(caseID);
    // Total items in Case folder should be updated to reflect the number of files uploaded
    const totalItemsText = await myCasesPage.totalItems.textContent();
    const totalItemsCount = totalItemsText ? parseInt(totalItemsText) : 0;
    await expect(totalItemsCount).toBe(fileCount);

    // Cleanup: Delete the uploaded files and verify the total items count is decreased to 0
    // Search file that upload then delete them one by one until all files are deleted
    const topNav = new TopNavigationBar(page);

    for (const fileName of filesToUpload) {
      const name = fileName.split("\\").pop() || fileName;
      const keyword = name.replace(/\.[^.]+$/, "");
      await topNav.clickAdvanceSearch();
      await topNav.performAdvancedSearch({
        keyword,
        fileTypes: ["Audio", "Document", "Picture", "Video"],
        category: "All Files",
      });
      await topNav.waitForSearchResultsToLoad();
      await topNav.clickDeleteSearchFirstResult();
    }
  });

  test("TC-FLOW-C-02: Attempt to upload an Unsupported file type", async ({
    page,
  }, workerInfo) => {
    const prefix = casePrefix(workerInfo.workerIndex);
    const myCasesPage = new MyCasesPage(page);
    test
      .info()
      .annotations.push(
        {
          type: "Expected Result 1",
          description:
            "An error toast message appears: 'File not supported: [filename.type]'",
        },
        {
          type: "Expected Result 2",
          description:
            "The unsupported file is automatically removed from the upload list and cannot be uploaded.",
        },
      );
    // Search for the second case created for file upload testing
    const caseID = `${prefix}-2`;
    await myCasesPage.searchCase(caseID);
    // Verify the case appears in the search results
    const caseCard = myCasesPage.myCaseCards
      .filter({ hasText: caseID })
      .first();
    await expect(caseCard).toBeVisible();
    // Open the case details page
    await myCasesPage.clickCaseByCaseID(caseID);
    // Verify case details page is loaded
    await myCasesPage.expectOpenCaseDetailPage(caseID);
    // Click uload button to open upload dialog
    await myCasesPage.clickUploadButton();
    // Verify Upload page is opened
    await expect(myCasesPage.textHeaderUpload).toBeVisible();
    // Try to upload an unsupported file type (.exe) and verify error message is shown
    const unsupportedFile = FILE_UNSUPPORTED;
    // Basefile name with extension, used for verifying error message content
    const baseFileName = unsupportedFile.split("\\").pop() || unsupportedFile;
    // Call the uploadToCase utility function to perform the upload
    await uploadToCase(page, unsupportedFile, {
      // Optionally specify locators if the defaults do not work
      scope: myCasesPage.page.locator(".upload-to-case-dialog"),
      input: 'input[type="file"]',
      browseLink: myCasesPage.page.getByRole("link", {
        name: /Click to browse/i,
      }),
      dropzone: myCasesPage.page
        .getByText(/Drag & Drop files here/i)
        .locator(".."),
    });

    // Verify error message is shown for unsupported file type
    await myCasesPage.expectErrorToastUnsupportedType([baseFileName]);
  });

  test("TC-FLOW-C-03: Attempt to upload an oversized file", async ({
    page,
  }, workerInfo) => {
    const prefix = casePrefix(workerInfo.workerIndex);
    const myCasesPage = new MyCasesPage(page);
    test
      .info()
      .annotations.push(
        {
          type: "Expected Result 1",
          description:
            "A 'File upload restricted' pop-up appears with title: 'File upload restricted'.",
        },
        {
          type: "Expected Result 2",
          description:
            "Message: 'Total size of files selected to upload exceeds the maximum file upload limit of 1000MB! Please reduce the number of files and try again.'",
        },
      );
    // Search for the third case created for file upload testing
    const caseID = `${prefix}-2`;
    await myCasesPage.searchCase(caseID);
    // Verify the case appears in the search results
    const caseCard = myCasesPage.myCaseCards
      .filter({ hasText: caseID })
      .first();
    await expect(caseCard).toBeVisible();
    // Open the case details page
    await myCasesPage.clickCaseByCaseID(caseID);
    // Verify case details page is loaded
    await myCasesPage.expectOpenCaseDetailPage(caseID);
    // Click upload button to open upload dialog
    await myCasesPage.clickUploadButton();
    // Verify Upload page is opened
    await expect(myCasesPage.textHeaderUpload).toBeVisible();
    // Try to upload an oversized file and verify error message is shown
    const oversizedFile = FILE_OVERSIZED;
    // Call the uploadToCase utility function to perform the upload
    await uploadToCase(page, oversizedFile, {
      // Optionally specify locators if the defaults do not work
      scope: myCasesPage.page.locator(".upload-to-case-dialog"),
      input: 'input[type="file"]',
      browseLink: myCasesPage.page.getByRole("link", {
        name: /Click to browse/i,
      }),
      dropzone: myCasesPage.page
        .getByText(/Drag & Drop files here/i)
        .locator(".."),
    });

    // click upload button to start uploading file
    await myCasesPage.uploadButton.click();
    // Veryfy error message is shown for oversized file
    await expect(myCasesPage.dialogUploadRestricted).toBeVisible();

    await expect(myCasesPage.dialogTitleUploadRestricted).toBeVisible();
    // const handle = await myCasesPage.dialogTitleUploadRestricted.elementHandles()
    // console.log("Located error toast element:", handle ? "FOUND" : "NOT FOUND")
    await expect(myCasesPage.dialogMessageUploadRestricted).toBeVisible();
    await expect(myCasesPage.dialogLimitValue).toHaveText("1000 MB");
    await myCasesPage.btnUploadRestrictedOk.click();
    await expect(myCasesPage.dialogUploadRestricted).toBeHidden();
    // Verify still on the upload page after closing the error dialog
    await expect(myCasesPage.textHeaderUpload).toBeVisible();
  });

  test("TC-FLOW-C-04: Update Metadata (Single File)", async ({
    page,
  }, workerInfo) => {
    test.fail(
      true,
      "WEMS3-857: Edit metadata: Classification value does not update after editing file metadata in Case folder (WEMS 3.0)",
    );
    const prefix = casePrefix(workerInfo.workerIndex);
    const myCasesPage = new MyCasesPage(page);
    test
      .info()
      .annotations.push(
        {
          type: "Expected Result 1",
          description: "A success toast: 'Metadata updated successfully.'",
        },
        {
          type: "Expected Result 2",
          description:
            "The file's metadata is updated correctly: Updated Title, Updated Classification visible in Case Files list.",
        },
      );
    // Search for the third case created for file upload testing
    const caseID = `${prefix}-3`;
    await myCasesPage.searchCase(caseID);
    // Verify the case appears in the search results
    const caseCard = myCasesPage.myCaseCards
      .filter({ hasText: caseID })
      .first();
    await expect(caseCard).toBeVisible();

    // Total items in Case folder should be updated to reflect the number of files uploaded
    const totalItemsText = await myCasesPage.totalItems.textContent();
    const totalItemsCount = totalItemsText ? parseInt(totalItemsText) : 0;
    // If the total found item is 0, upload a valid file. If not, skip the upload.
    if (totalItemsCount === 0) {
      console.log("Upload Files to case folder");
      // Open the case details page
      await myCasesPage.clickCaseByCaseID(caseID);
      // Verify case details page is loaded
      await myCasesPage.expectOpenCaseDetailPage(caseID);
      // Click upload button to open upload dialog
      await myCasesPage.clickUploadButton();
      // Verify Upload page is opened
      await expect(myCasesPage.textHeaderUpload).toBeVisible();
      // Upload valid file 4 files
      const validFilesUpload = [...FILES_SLOT_3];
      // Call the uploadToCase utility function to perform the upload
      await uploadToCase(page, validFilesUpload, {
        // Optionally specify locators if the defaults do not work
        scope: myCasesPage.page.locator(".upload-to-case-dialog"),
        input: 'input[type="file"]',
        browseLink: myCasesPage.page.getByRole("link", {
          name: /Click to browse/i,
        }),
        dropzone: myCasesPage.page
          .getByText(/Drag & Drop files here/i)
          .locator(".."),
      });
      // Click upload button to start uploading files
      await myCasesPage.uploadButton.click();
      // Wait for the upload to complete and verify success message is shown
      await myCasesPage.waitForUploadToFinish();
      // Verify Successful toast appear
      await expect(myCasesPage.successToastUploaded).toBeVisible({
        timeout: 5000,
      });
      // **Debug**
      // const handle = await myCasesPage.successToastUploaded.elementHandles();
      // console.log(
      //   "Located error toast element:",
      //   handle ? "FOUND" : "NOT FOUND",
      // );
      // Verify case details page is loaded
      await myCasesPage.expectOpenCaseDetailPage(caseID);
    } else if (totalItemsCount !== 0) {
      console.log("Case folder already have files uploaded");
      // Open the case details page
      await myCasesPage.clickCaseByCaseID(caseID);
      // Verify case details page is loaded
      await myCasesPage.expectOpenCaseDetailPage(caseID);
      // Click upload button to open upload dialog
    }
    // Scroll until editAction is visible
    await myCasesPage.editAction
      .first()
      .scrollIntoViewIfNeeded({ timeout: 5000 });
    // Click Edit action first file in the list
    await myCasesPage.editAction.first().click();
    // Verify Edit metadata page is loaded
    await expect(myCasesPage.textHeaderEditMetadata).toBeVisible();
    const titleUpdate = "Auto test update metadata single file";
    const classificationUpdate = "DO NOT DELETE";
    const descriptionUpdate = "Auto test update metadata single file";
    // Fill Medata
    await myCasesPage.editMetadata(
      titleUpdate,
      classificationUpdate,
      caseID,
      descriptionUpdate,
    );
    // Verify update metadata success toasr appear
    await expect(myCasesPage.updateMetadataSuccessToast).toBeVisible();
    // Verify file move from another CaseId visible in table
    await myCasesPage.verifyFileExists(titleUpdate, classificationUpdate);
  });

  test("TC-Flow-C-05: Update metadata (Single File) - Change CaseID", async ({
    page,
  }, workerInfo) => {
    const prefix = casePrefix(workerInfo.workerIndex);
    const myCasesPage = new MyCasesPage(page);
    test
      .info()
      .annotations.push(
        {
          type: "Expected Result 1",
          description:
            "A success toast: 'Metadata of selected file(s) updated successfully.'",
        },
        {
          type: "Expected Result 2",
          description:
            "The file is removed from the current case folder and moved to the newly selected Case ID.",
        },
      );
    // Search for the third case created for file upload testing
    const caseID = `${prefix}-3`;
    await myCasesPage.searchCase(caseID);
    // Verify the case appears in the search results
    const caseCard = myCasesPage.myCaseCards
      .filter({ hasText: caseID })
      .first();
    await expect(caseCard).toBeVisible();
    // Total items in Case folder should be updated to reflect the number of files uploaded
    const totalItemsTextOld = await myCasesPage.totalItems.textContent();
    const totalItemsCountOld = totalItemsTextOld
      ? parseInt(totalItemsTextOld)
      : 0;
    // If the total found item is 0, upload a valid file. If not, skip the upload.
    if (totalItemsCountOld === 0) {
      console.log("Upload Files to case folder");
      // Open the case details page
      await myCasesPage.clickCaseByCaseID(caseID);
      // Verify case details page is loaded
      await myCasesPage.expectOpenCaseDetailPage(caseID);
      // Click upload button to open upload dialog
      await myCasesPage.clickUploadButton();
      // Verify Upload page is opened
      await expect(myCasesPage.textHeaderUpload).toBeVisible();
      // Upload valid file 4 files
      const validFilesUpload = [...FILES_SLOT_3];
      // Call the uploadToCase utility function to perform the upload
      await uploadToCase(page, validFilesUpload, {
        // Optionally specify locators if the defaults do not work
        scope: myCasesPage.page.locator(".upload-to-case-dialog"),
        input: 'input[type="file"]',
        browseLink: myCasesPage.page.getByRole("link", {
          name: /Click to browse/i,
        }),
        dropzone: myCasesPage.page
          .getByText(/Drag & Drop files here/i)
          .locator(".."),
      });
      // Click upload button to start uploading files
      await myCasesPage.uploadButton.click();
      // Wait for the upload to complete and verify success message is shown
      await myCasesPage.waitForUploadToFinish();
      // Verify Successful toast appear
      await expect(myCasesPage.successToastUploaded).toBeVisible({
        timeout: 5000,
      });
      // Verify case details page is loaded
      await myCasesPage.expectOpenCaseDetailPage(caseID);
    } else if (totalItemsCountOld !== 0) {
      console.log("Case folder already have files uploaded");
      // Open the case details page
      await myCasesPage.clickCaseByCaseID(caseID);
      // Verify case details page is loaded
      await myCasesPage.expectOpenCaseDetailPage(caseID);
      // Click upload button to open upload dialog
    }
    // Scroll until editAction is visible
    await myCasesPage.editAction
      .first()
      .scrollIntoViewIfNeeded({ timeout: 5000 });
    // Click Edit action first file in the list
    await myCasesPage.editAction.first().click();
    // Verify Edit metadata page is loaded
    await expect(myCasesPage.textHeaderEditMetadata).toBeVisible();
    const titleUpdate = "Auto test update metadata single file";
    const caseIdUpdate = `${prefix}-2`;
    const classificationUpdate = "QAAndTester";
    const descriptionUpdate = "Auto test update metadata single file";
    // Fill Medata
    await myCasesPage.editMetadata(
      titleUpdate,
      classificationUpdate,
      caseIdUpdate,
      descriptionUpdate,
    );
    // Verify update metadata success toasr appear
    await expect(myCasesPage.updateMetadataSuccessToast).toBeVisible();
    // Verify file remove from this Case folder
    await myCasesPage.verifyFileRemoveFromList(
      titleUpdate,
      classificationUpdate,
    );
    // Back to My Cases page
    await myCasesPage.btnBackToMyCases.click();
    // Verify My Cases page is loaded
    await expect(myCasesPage.textHeaderMyCases).toBeVisible();
    // Search First CaseID:
    await myCasesPage.searchCase(caseID);
    // Count number of First CaseID
    const totalItemsTextNew = await myCasesPage.totalItems.textContent();
    const totalItemsCountNew = totalItemsTextNew
      ? parseInt(totalItemsTextNew)
      : 0;
    // Verify Total items should decrease by 1
    await expect(totalItemsCountNew, "Total items should decrease by 1").toBe(
      totalItemsCountOld - 1,
    );
    // Seach Case by title
    await myCasesPage.searchCase(caseIdUpdate);
    // Click CaseID by title
    await myCasesPage.clickCaseByCaseID(caseIdUpdate);
    // Verify file move from another CaseId visible in table
    await myCasesPage.verifyFileExists(titleUpdate, classificationUpdate);
  });

  // ── TC-Flow-C-06: Required Field Validation on Edit Metadata ──────────────
  test("TC-Flow-C-06: Update Metadata (Single File) – Required Field Validation", async ({
    page,
  }, workerInfo) => {
    const prefix = casePrefix(workerInfo.workerIndex);
    const myCasesPage = new MyCasesPage(page);
    test
      .info()
      .annotations.push({
        type: "Expected Result 1",
        description:
          "The Submit button is disabled, preventing the user from submitting empty metadata.",
      });
    const caseID = `${prefix}-3`;
    const validFilesUpload = [
      "data\\files\\audios\\20251219_153445_CMD300008.aac",
      "data\\files\\document\\WEMS3.0-on-prem.docx",
    ];

    // Ensure there are files in slot -3; upload if needed
    await myCasesPage.ensureFilesInCase(caseID, validFilesUpload);

    // Scroll to the first edit action and click it
    await myCasesPage.editAction
      .first()
      .scrollIntoViewIfNeeded({ timeout: 5000 });
    await myCasesPage.editAction.first().click();

    // Verify Edit Metadata page is loaded
    await expect(myCasesPage.textHeaderEditMetadata).toBeVisible();

    // Clear the Title field to trigger validation
    await myCasesPage.titleInputMetadata.clear();

    // Clear the Description text area field to trigger validation
    await myCasesPage.descriptionTextArea.clear();

    // Verify the Submit button is disabled (form cannot be submitted)
    await expect(
      myCasesPage.btnSubmit,
      "Submit button should be disabled when Title is empty",
    ).toBeDisabled();

    // Verify an inline validation alert appears for Title
    await expect(
      myCasesPage.inputTitleAlertMetadata,
      "Title required alert should be visible",
    ).toBeVisible();
  });

  // ── TC-Flow-C-07: Bulk Update Metadata (Select All → More Actions) ────────
  test("TC-Flow-C-07: Update Metadata (Bulk) – Title, Classification, Description, and Case ID", async ({
    page,
  }, workerInfo) => {
    const prefix = casePrefix(workerInfo.workerIndex);
    const myCasesPage = new MyCasesPage(page);
    test
      .info()
      .annotations.push(
        {
          type: "Expected Result 1",
          description:
            "A success toast: 'Metadata of selected file(s) updated successfully.'",
        },
        {
          type: "Expected Result 2",
          description:
            "All selected files are removed from the current case folder.",
        },
        {
          type: "Expected Result 3",
          description:
            "In the target Case ID folder, all updated files appear with: Updated Title, Updated Classification, Updated Description.",
        },
      );
    const sourceCaseID = `${prefix}-3`;
    const targetCaseID = `${prefix}-1`;
    const validFilesUpload = [...FILES_SLOT_3];

    // Ensure files are present in source case
    await myCasesPage.ensureFilesInCase(sourceCaseID, validFilesUpload);

    // Get file count before bulk update
    await myCasesPage.btnBackToMyCases.click();
    await expect(myCasesPage.textHeaderMyCases).toBeVisible();
    await myCasesPage.searchCase(sourceCaseID);
    const totalBefore = await myCasesPage.getCaseFileCount(sourceCaseID);

    // Open source case folder
    await myCasesPage.clickCaseByCaseID(sourceCaseID);
    await myCasesPage.expectOpenCaseDetailPage(sourceCaseID);

    // Select all files
    await myCasesPage.btnSelectAllCaseFiles.click();

    // Open More Actions and select Update Metadata
    await myCasesPage.clickMoreActionsItem("Update Metadata");

    // Fill bulk metadata form
    const bulkTitle = "Auto test update metadata bulk file";
    const bulkClassification = "QAAndTester";
    const bulkDescription = "Auto test update metadata bulk file";

    await myCasesPage.editMetadataBulk(
      bulkTitle,
      bulkClassification,
      targetCaseID,
      bulkDescription,
    );

    // Verify success toast
    await expect(
      myCasesPage.updateMetadataSuccessToast,
      "Bulk metadata update success toast should appear",
    ).toBeVisible({ timeout: 8000 });

    // Back to My Cases page
    await myCasesPage.btnBackToMyCases.click();
    await expect(myCasesPage.textHeaderMyCases).toBeVisible();

    // Verify source case count is reduced to 0 (all files moved out)
    await myCasesPage.searchCase(targetCaseID);
    const totalAfterSource = await myCasesPage.getCaseFileCount(targetCaseID);
    await expect(
      totalAfterSource,
      "Source case should have 0 files after bulk move",
    ).toBe(0); // 0

    // Verify files appear in the target case
    await myCasesPage.searchCase(targetCaseID);
    await myCasesPage.clickCaseByCaseID(targetCaseID);
    await myCasesPage.expectOpenCaseDetailPage(targetCaseID);
    await myCasesPage.verifyFileExists(bulkTitle, bulkClassification);
  });

  // ── TC-Flow-C-08: Download Single File ────────────────────────────────────
  test("TC-Flow-C-08: Download Single File – With Confirmation Popup and Success Toast", async ({
    page,
  }, workerInfo) => {
    const prefix = casePrefix(workerInfo.workerIndex);
    const myCasesPage = new MyCasesPage(page);
    test
      .info()
      .annotations.push(
        {
          type: "Expected Result 1",
          description:
            "A Bulk Download pop-up appears with: Title: 'Bulk Download', message about ZIP file, No. of files: 1, Est. File Size, Include (File Metadata, Audit Report), Download and Cancel buttons.",
        },
        {
          type: "Expected Result 2",
          description:
            "A success toast: 'File will begin to download shortly...'",
        },
      );
    const caseID = `${prefix}-1`;
    const validFilesUpload = [
      "data\\files\\audios\\20251219_153423_CMD300008.aac",
      "data\\files\\images\\Screenshot-2026-02-23-085500.png",
    ];

    // Ensure files are in the case
    await myCasesPage.ensureFilesInCase(caseID, validFilesUpload);

    // Select the first file via its checkbox
    const firstRowCheckbox = myCasesPage.caseFilesTable
      .locator("tbody tr")
      .first()
      .locator("nb-checkbox label");
    await firstRowCheckbox.click();

    // Click the Download button
    await myCasesPage.btnDownloadCaseFiles.click();

    // Verify the Bulk Download dialog appears
    await expect(
      myCasesPage.dialogBulkDownload,
      "Bulk Download dialog should be visible",
    ).toBeVisible({ timeout: 8000 });

    // Verify dialog title
    await expect(
      myCasesPage.dialogBulkDownloadTitle,
      "Dialog title should be 'Bulk Download'",
    ).toBeVisible();

    // Verify message about ZIP packaging
    await expect(
      myCasesPage.dialogBulkDownloadMessage,
      "ZIP message should be visible",
    ).toBeVisible();

    // Verify No. of files shows 1
    await expect(
      myCasesPage.dialogBulkDownloadFileCount,
      "File count section should be visible",
    ).toBeVisible();

    // Check both Include checkboxes
    await myCasesPage.checkboxFileMetadata.click();
    await myCasesPage.checkboxAuditReport.click();

    // Confirm the download
    await myCasesPage.btnConfirmBulkDownload.click();

    // Verify success toast "File will begin to download shortly..."
    await expect(
      myCasesPage.successToastDownload,
      "Download success toast should appear",
    ).toBeVisible({ timeout: 8000 });
  });

  // ── TC-Flow-C-09: Download Multiple Files (ZIP) ───────────────────────────
  test("TC-Flow-C-09: Download Multiple Files (ZIP) – With Confirmation Popup and Success Toast", async ({
    page,
  }, workerInfo) => {
    const prefix = casePrefix(workerInfo.workerIndex);
    const myCasesPage = new MyCasesPage(page);
    test
      .info()
      .annotations.push(
        {
          type: "Expected Result 1",
          description:
            "A Bulk Download pop-up appears with: Title: 'Bulk Download', message about ZIP, No. of files: 3, Est. File Size, Include checkboxes, Download and Cancel buttons.",
        },
        {
          type: "Expected Result 2",
          description:
            "A success toast: 'File will begin to download shortly...'",
        },
      );
    const caseID = `${prefix}-1`;
    const selectedCount = 3;
    const validFilesUpload = [
      "data\\files\\audios\\20251219_153423_CMD300008.aac",
      "data\\files\\audios\\20251219_153445_CMD300008.aac",
      "data\\files\\images\\Screenshot-2026-02-23-085500.png",
    ];

    // Ensure at least 3 files are in the case
    await myCasesPage.ensureFilesInCase(caseID, validFilesUpload);

    // Select exactly 3 files individually
    const rows = myCasesPage.caseFilesTable.locator("tbody tr");
    for (let i = 0; i < selectedCount; i++) {
      await rows.nth(i).locator("nb-checkbox label").click();
    }

    // Click the Download button
    await myCasesPage.btnDownloadCaseFiles.click();

    // Verify the Bulk Download dialog appears
    await expect(
      myCasesPage.dialogBulkDownload,
      "Bulk Download dialog should be visible",
    ).toBeVisible({ timeout: 8000 });

    // Verify dialog title
    await expect(
      myCasesPage.dialogBulkDownloadTitle,
      "Dialog title should be 'Bulk Download'",
    ).toBeVisible();

    // Verify message about ZIP packaging
    await expect(
      myCasesPage.dialogBulkDownloadMessage,
      "ZIP message should be visible",
    ).toBeVisible();

    // Verify No. of Files matches the number of selected files
    await expect(
      myCasesPage.dialogBulkDownloadFileCount,
      `File count should show ${selectedCount}`,
    ).toContainText(String(selectedCount));

    // Check both Include checkboxes
    await myCasesPage.checkboxFileMetadata.click();
    await myCasesPage.checkboxAuditReport.click();

    // Confirm the download
    await myCasesPage.btnConfirmBulkDownload.click();

    // Verify success toast "File will begin to download shortly..."
    await expect(
      myCasesPage.successToastDownload,
      "Download success toast should appear",
    ).toBeVisible({ timeout: 8000 });
  });

  // ── TC-Flow-C-10: Remove Single File ─────────────────────────────────────
  test("TC-Flow-C-10: Remove a Single File – With Confirmation", async ({
    page,
  }, workerInfo) => {
    const prefix = casePrefix(workerInfo.workerIndex);
    const myCasesPage = new MyCasesPage(page);
    test
      .info()
      .annotations.push(
        {
          type: "Expected Result 1",
          description: "A success toast: 'Case file removed successfully.'",
        },
        {
          type: "Expected Result 2",
          description: "The selected file is removed from the Case Files list.",
        },
        {
          type: "Expected Result 3",
          description: "Total number of items reduces by 1.",
        },
      );
    const caseID = `${prefix}-2`;
    const validFilesUpload = [...FILES_SLOT_2];

    // Ensure files are present in slot -2
    await myCasesPage.ensureFilesInCase(caseID, validFilesUpload);

    // Get count before deletion
    const totalBefore = myCasesPage.caseFilesTable.locator("tbody tr");
    const countBefore = await totalBefore.count();

    if (countBefore === 0) {
      test.skip(true, "No files in case to remove");
      return;
    }

    // Click the Delete icon in the Action column for the first file
    await myCasesPage.deleteFileAction.first().scrollIntoViewIfNeeded();
    await myCasesPage.deleteFileAction.first().click();

    // Confirm deletion in the popup
    await myCasesPage.btnYes.click();

    // Verify success toast "Case file removed successfully."
    await expect(
      myCasesPage.successToastFileRemoved,
      "File removed success toast should appear",
    ).toBeVisible({ timeout: 8000 });

    // Verify the table row count decreased by 1
    await expect(
      myCasesPage.caseFilesTable.locator("tbody tr"),
      "File count should decrease by 1 after removal",
    ).toHaveCount(countBefore - 1);
  });

  // ── TC-Flow-C-11: Remove Multiple Files (Bulk) ────────────────────────────
  test("TC-Flow-C-11: Remove Multiple Files (Bulk) – With Confirmation", async ({
    page,
  }, workerInfo) => {
    const prefix = casePrefix(workerInfo.workerIndex);
    const myCasesPage = new MyCasesPage(page);
    test
      .info()
      .annotations.push(
        {
          type: "Expected Result 1",
          description: "A success toast: 'Case file removed successfully.'",
        },
        {
          type: "Expected Result 2",
          description:
            "All selected files are removed from the Case Files list.",
        },
      );
    const caseID = `${prefix}-2`;
    const validFilesUpload = [...FILES_SLOT_2];

    // Ensure files are present
    await myCasesPage.ensureFilesInCase(caseID, validFilesUpload);

    const rowCount = await myCasesPage.caseFilesTable
      .locator("tbody tr")
      .count();
    if (rowCount === 0) {
      test.skip(true, "No files in case to bulk remove");
      return;
    }

    // Select ALL files
    await myCasesPage.btnSelectAllCaseFiles.click();

    // Click Delete All button
    await myCasesPage.btnDeleteAllCaseFiles.click();

    // Confirm deletion in the popup
    await myCasesPage.btnYes.click();

    // Verify success toast "Case file removed successfully."
    await expect(
      myCasesPage.successToastFileRemoved,
      "Bulk file removed success toast should appear",
    ).toBeVisible({ timeout: 8000 });

    // Verify the case files table is now empty
    await expect(
      myCasesPage.caseFilesTable.locator("tbody tr"),
      "All files should be removed – table should be empty",
    ).toHaveCount(0);
  });

  test.afterAll(async ({ browser }, workerInfo) => {
    test.setTimeout(300_000); // 5 min — 11 keyword searches + file deletions + 3 case deletions
    const prefix = casePrefix(workerInfo.workerIndex);
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.login(adminAutotestUsername!, adminAutotestPassword!);

    const topNav = new TopNavigationBar(page);
    const sideNav = new SideNavigationBar(page);

    // ── Step 1: Delete all files uploaded during Flow C via Advance Search ──
    // Collect every file path used across all Flow C tests (original uploads)
    // plus any metadata-updated titles that became the file's display title.
    const allUploadedFiles = [
      ...FILES_SLOT_1, // TC-Flow-C-01 (slot -1)
      ...FILES_SLOT_3, // TC-Flow-C-04 / C-05 / C-06 / C-07 (slot -3)
      // TC-Flow-C-08 / C-09 / C-10 / C-11 use subsets of the above — already covered
    ];

    // Metadata-updated titles (C-05 and C-07 rename files; search by new title too)
    const metadataUpdatedTitles = [
      "Auto test update metadata single file",
      "Auto test update metadata bulk file",
    ];

    // Build keyword list: strip path + extension for file names, use title as-is
    const fileKeywords = allUploadedFiles.map((f) => {
      const name = f.split("\\").pop() || f;
      return name.replace(/\.[^.]+$/, ""); // remove extension
    });
    const allKeywords = [
      ...new Set([...fileKeywords, ...metadataUpdatedTitles]),
    ];

    console.log(
      `Cleanup: deleting ${allKeywords.length} file keyword(s) via Advance Search`,
    );

    for (const keyword of allKeywords) {
      try {
        await topNav.clickAdvanceSearch();
        await topNav.performAdvancedSearch({
          keyword,
          fileTypes: ["Audio", "Document", "Picture", "Video"],
          category: "All Files",
        });
        await topNav.waitForSearchResultsToLoad();

        // Check count first — skip immediately if nothing to delete
        const count = await topNav.getTotalResultsCountFromUI();
        if (count === 0) {
          console.warn(
            `Cleanup: keyword "${keyword}" — 0 results, skipping (check manually if expected)`,
          );
          continue;
        }

        // Delete all results matching this keyword one by one
        let deleted = 0;
        let hasMore = true;
        while (hasMore) {
          try {
            await topNav.clickDeleteSearchFirstResult();
            deleted++;
          } catch {
            hasMore = false;
          }
        }
        console.log(
          `Cleanup: deleted ${deleted} file(s) matching keyword "${keyword}"`,
        );
      } catch (err) {
        console.warn(
          `Cleanup: error processing keyword "${keyword}" — skipping (${err})`,
        );
      }
    }

    // ── Step 2: Delete the 3 worker-scoped case folders ───────────────────
    await sideNav.navigateTo("Files", "My Cases");
    const myCasesPage = new MyCasesPage(page);
    await expect(myCasesPage.textHeaderMyCases).toBeVisible();

    for (let i = 1; i <= 3; i++) {
      const caseID = `${prefix}-${i}`;
      await myCasesPage.searchCase(caseID);
      const caseCard = myCasesPage.myCaseCards
        .filter({ hasText: caseID })
        .first();
      if (await caseCard.isVisible()) {
        await myCasesPage.clickDeleteCaseCard(caseID);
        await expect(myCasesPage.successToastDeletedCard).toBeVisible({
          timeout: 5000,
        });
        console.log(`Cleanup: deleted case ${caseID}`);
      } else {
        console.warn(`Cleanup: case ${caseID} not found, skipping`);
      }
    }

    await context.close();
  });
});