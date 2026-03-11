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

test.describe
  .serial("Flow A: Create --> Verify UI --> Search --> Open (core navigation)", () => {
  test.beforeEach(async ({ page }) => {
    // Login as AdminAutoTest before each test in this describe block
    const loginPage = new LoginPage(page);
    await loginPage.login(adminAutotestUsername!, adminAutotestPassword!);
  });

  test("TC-Flow-A-01: Navigate to My cases Page", async ({ page }) => {
    // Verify Dashboard is loaded
    const dashboardPage = new DashboardPage(page);
    // Wait
    await page.waitForLoadState("networkidle");
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
        myCasesPage.createdCaseSuccessToast.waitFor({
          state: "visible",
          timeout: 5000,
        }),
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

test.describe.serial("Flow B: Case Notes CRUD + Print + Bulk Delete", () => {
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
      await myCasesPage.clickCaseByCaseID(caseID);
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

  test.afterAll(async ({ browser }) => {
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
    const caseID = `AUTOTEST-01`;
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

test.describe
  .serial("Flow C: Case files - Upload -> Upload Metadata -> Download -> Remove", () => {
  // Preconditions: Create a new case 3 cases for file upload testing
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
    // Create 3 new cases for file upload testing
    for (let i = 1; i <= 3; i++) {
      const caseID = `AUTOTEST-FILE-${i}`;
      const title = `Autotest File ${i}-${Date.now()}`;
      const description = `This is a description for the autotest file case ${i}.`;
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
      } else {
        console.warn(
          `Case with ID ${caseID} already exists, skipping creation`,
        );
      }
      // Verify the new case appears in the list
      await expect(caseCard).toBeVisible();
    }
  });

  test("TC-FLOW-C-01: Upload several valid files", async ({ page }) => {
    const myCasesPage = new MyCasesPage(page);
    // Search for the first case created for file upload testing
    const caseID = `AUTOTEST-FILE-1`;
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
    const filesToUpload = [
      "data\\files\\audios\\20251219_153423_CMD300008.aac",
      "data\\files\\document\\WEMS2.0-on-prem.docx",
      "data\\files\\images\\Screenshot-2026-02-23-085500.png",
      "data\\files\\videos\\delete-case-on-wems3.0.mp4",
      "data\\files\\images\\Screenshot-2026-02-23-104021.png",
    ];
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
    // Refresh the page to ensure the latest data is loaded
    await myCasesPage.page.reload();
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
  }) => {
    const myCasesPage = new MyCasesPage(page);
    // Search for the second case created for file upload testing
    const caseID = `AUTOTEST-FILE-2`;
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
    const unsupportedFile = "data\\files\\invalidFilesType\\README.md";
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
  }) => {
    const myCasesPage = new MyCasesPage(page);
    // Search for the third case created for file upload testing
    const caseID = `AUTOTEST-FILE-2`;
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
    const oversizedFile =
      "data\\files\\oversize\\BodyCam-H2-202602120142504867.mp4";
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

  test("TC-FLOW-C-04: Update Metadata (Single File)", async ({ page }) => {
    test.fail(
      true,
      "WEMS3-857: Edit metadata: Classification value does not update after editing file metadata in Case folder (WEMS 3.0)",
    );
    const myCasesPage = new MyCasesPage(page);
    // Search for the third case created for file upload testing
    const caseID = `AUTOTEST-FILE-3`;
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
      const validFilesUpload = [
        "data\\files\\audios\\20251219_153445_CMD300008.aac",
        "data\\files\\document\\WEMS3.0-on-prem.docx",
        "data\\files\\images\\Screenshot-2026-02-23-104818.png",
        "data\\files\\videos\\BS-extr-cannot-change-system-to-WEMS3.0.mp4",
      ];
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
  }) => {
    const myCasesPage = new MyCasesPage(page);
    // Search for the third case created for file upload testing
    const caseID = `AUTOTEST-FILE-3`;
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
      const validFilesUpload = [
        "data\\files\\audios\\20251219_153445_CMD300008.aac",
        "data\\files\\document\\WEMS3.0-on-prem.docx",
        "data\\files\\images\\Screenshot-2026-02-23-104818.png",
        "data\\files\\videos\\BS-extr-cannot-change-system-to-WEMS3.0.mp4",
      ];
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
    const caseIdUpdate = "AUTOTEST-FILE-2";
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
    // Wait fornetwork idle
    await page.waitForLoadState("networkidle");
    // Verify My Cases page is loaded
    await expect(myCasesPage.textHeaderMyCases).toBeVisible();
    // Search First CaseID:AUTOTEST-FILE-3
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
});
