import { Page, expect, Locator } from "@playwright/test";
import * as dotenv from "dotenv";
import { escapeRegex } from "../../utils/escapeRegax";
dotenv.config();

export class MyCasesPage {
  page: Page;
  btnCreateCase: Locator;
  inputSearchCase: Locator;
  toggle: Locator;
  toggleOff: Locator;
  toggleOn: Locator;
  createCaseHeader: Locator;
  inputCaseID: Locator;
  inputTitle: Locator;
  inputCaseIdAlert: Locator;
  inputTitleAlert: Locator;
  activeRadio: Locator;
  closedRadio: Locator;
  defaultClassification: Locator;
  descriptionTextArea: Locator;
  btnCancel: Locator;
  textHeaderMyCases: Locator;
  textHerderSharedCase: Locator;
  searchSharedCase: Locator;
  subMenuSharedCases: Locator;
  subMenuMyCases: Locator;
  textNodataMyCases: Locator;
  textNoDataSharedCase: Locator;
  myCaseCards: Locator;
  classificationButton: Locator;
  overlayContainer: Locator;
  btnSubmit: Locator;
  btnMoreActionsDropdown: Locator;
  btnCaseNotes: Locator;
  btnCaseNotesBack: Locator;
  btnAddNote: Locator;
  btnDeleteAllNote: Locator;
  textHeaderCaseNotes: Locator;
  inputNoteTitle: Locator;
  textareaNoteDescription: Locator;
  selectAllButton: Locator;
  deselectAllButton: Locator;
  deleteConfirmDialog: Locator;
  btnYes: Locator;
  btnNo: Locator;
  deleteAction: Locator;
  successToastDeleted: Locator;
  textHeaderViewCaseNotes: Locator;
  btnPrint: Locator;
  successToastPrint: Locator;
  caseNoteItemPreview: Locator;
  table: any;
  deleteCaseCardButton: any;
  manage: { print: any; edit: any; delete: any };
  successToastDeletedCard: Locator;
  textHeaderUpload: Locator;
  btnUploadTool: Locator;
  uploadButton: Locator;
  cancelButton: Locator;
  removeAllButton: Locator;
  successToastUpload: Locator;
  successToastUploaded: Locator;
  uploadProgressDialog: Locator;
  uploadDialog: Locator;
  progressBar: Locator;
  progressText: Locator;

  caseFilesTable: Locator;
  fileRowByTitle: (title: string) => Locator;
  errorToastUploadFailed: Locator;
  errorToastFileExists: Locator;
  totalItems: Locator;
  dialogUploadRestricted: Locator;
  dialogTitleUploadRestricted: Locator;
  dialogMessageUploadRestricted: Locator;
  dialogLimitValue: Locator;
  btnUploadRestrictedOk: Locator;
  uploadRestrictedOverlay: Locator;
  editAction: Locator;
  deleteNoteAction: Locator;
  textHeaderEditMetadata: Locator;
  titleInputMetadata: Locator;
  classificationDropdownMetadata: Locator;
  classificationButtonMetadata: Locator;
  caseIdDropdownMetadata: Locator;
  caseIdButtonMetadata: Locator;
  descriptionInputMetadata: Locator;
  submitButtonMetadata: Locator;
  cancelButtonMetadata: Locator;
  updateMetadataSuccessToast: Locator;
  createdCaseSuccessToast: Locator;
  createCaseNoteSuccessToast: Locator;
  btnBackToMyCases: Locator;

  constructor(page: Page) {
    this.page = page;
    // sub menu my cases
    this.subMenuMyCases = page.getByRole("link", {
      name: "My Cases",
      exact: true,
    });
    this.btnCreateCase = page.getByRole("button", { name: "Create Case" });
    this.textHeaderMyCases = page.getByRole("heading", {
      name: "My Cases",
      exact: true,
    });
    this.textNodataMyCases = page.getByText("No data available.").first();
    const myCasesList = page.locator("ngx-box-list-view");
    this.myCaseCards = myCasesList.locator("nb-card.card-list-content");
    this.inputSearchCase = page.locator("#searchInput");
    this.toggle = page.locator(".toggle");
    this.toggleOff = page.locator(".toggle:not(.checked)");
    this.toggleOn = page.locator(".toggle.checked");

    this.manage = {
      print: this.page.locator('.card-bottom .manage-icon [title="Print"]'),
      edit: this.page.locator('.card-bottom .manage-icon [title="Edit"]'),
      delete: this.page.locator('.card-bottom .manage-icon [title="Delete"]'),
    };

    this.successToastDeletedCard = page.getByText(
      /case .*deleted successfully.*case files.*unassigned/i,
    );

    // create case
    this.createCaseHeader = page.getByRole("heading", {
      name: "Create Case",
      level: 6,
    });

    this.inputCaseID = page.getByRole("textbox", { name: "Case ID:" });
    this.inputTitle = page.getByRole("textbox", { name: "Title" });
    this.inputCaseIdAlert = page
      .locator(".alert")
      .getByText("Case ID is required.");
    this.inputTitleAlert = page
      .locator(".alert")
      .getByText("Title is required.");
    this.activeRadio = page.locator('nb-radio:has-text("Active")');
    this.closedRadio = page.locator('nb-radio:has-text("Closed")');
    this.activeRadio = page.locator('nb-radio:has-text("Archived")');
    this.defaultClassification = page.locator("#classification");
    this.classificationButton = page.locator("button.select-button");

    this.overlayContainer = page.locator(
      '.cdk-overlay-container, nb-dialog-container, .overlay, [role="dialog"]',
    );

    this.descriptionTextArea = page.locator("#description");
    this.btnSubmit = page.getByRole("button", { name: "Submit" });
    this.btnCancel = page.getByRole("button", { name: "Cancel" });
    this.createdCaseSuccessToast = page
      .locator(
        '[role="alertdialog"], .toast-message, .toast-success, .ngx-toastr',
      )
      .filter({
        hasText: /case note(s)? .*created successfully|created successfully/i,
      })
      .first();

    this.successToastDeleted = page.getByText(
      /case note(s)? .*deleted successfully|deleted successfully/i,
    );

    // sub menu shared cases
    this.subMenuSharedCases = page.getByRole("link", { name: "Shared Cases" });
    this.textHerderSharedCase = page.locator(
      'nb-card-header h6:has-text("Shared Cases")',
    );
    this.textNoDataSharedCase = page.getByText("No data available.");
    this.searchSharedCase = page.locator("#searchSharedCaseInput");

    // Case page elements
    // Back button
    this.btnBackToMyCases = page.getByRole("button", { name: /back/i });
    // More Actions dropdown
    this.btnMoreActionsDropdown = page.locator("#MoreActionsMenu");
    // Case Notes button
    this.btnCaseNotes = page.getByRole("button", {
      name: /^Case Notes \(\d+\)$/,
    });
    // Upload button
    this.btnUploadTool = page.getByTitle("Upload");
    // Upload header
    this.textHeaderUpload = page.getByRole("heading", {
      name: /^\s*Upload To Case\s*$/,
      level: 6,
    });
    // Upload files success toast
    this.successToastUpload = page.getByText(
      /Files are ready to upload\. Please click Upload button to start uploading files\./,
    );
    // Uploaded file success toast
    this.successToastUploaded = page
      .locator(
        '[role="alertdialog"], .toast-message, .toast-success, .ngx-toastr',
      )
      .filter({ hasText: /file\(s\)\s+uploaded\s+successfully/i })
      .first();

    // Upload failed toast
    this.errorToastUploadFailed = page.getByText(
      /unable to upload(?:ed)? file(?:s)?\s*Please try again later/i,
    );

    // Uploaded file already exists toast
    this.errorToastFileExists = page.getByText(
      /file(?:s) already exists in the system./i,
    );
    // Total items in Case folder
    this.totalItems = page.locator(".card-bottom .total-items.paragraph-2");
    // Upload files button in upload to case page
    this.uploadButton = page.getByRole("button", { name: /^Upload$/ });
    // Cancel button in upload to case page
    this.cancelButton = page.getByRole("button", { name: /^Cancel$/ });
    // Remove All button in upload to case page
    this.removeAllButton = page.getByRole("button", { name: /^Remove All$/ });
    // Upload progress dialog (covers both Nebular and custom implementations)
    this.uploadProgressDialog = page
      .locator(".cdk-overlay-pane, nb-overlay-container")
      .filter({ hasText: /please wait while files are being uploaded/i })
      .last();
    this.uploadDialog = page.locator(".waiting-upload-message");
    this.progressBar = page.locator(
      '#waiting-upload-div-progress[role="progressbar"]',
    );
    this.progressText = page.locator("#waiting-upload-div-spanprogress");
    // Action button
    this.editAction = page.locator("ng2-smart-table-cell a[title='Edit']");
    this.deleteAction = page.locator("ng2-smart-table-cell a[title='Delete']");

    // Case Notes elements
    // Header Case notes
    this.textHeaderCaseNotes = page
      .locator("nb-card-header")
      .filter({ hasText: /^\s*Case Notes\s*$/i })
      .first();

    // Back button in Case Notes
    this.btnCaseNotesBack = page.getByRole("button", { name: /back/i });
    // Add note button
    this.btnAddNote = page.getByRole("button", { name: /ADD/i });
    // Detele note button
    this.btnDeleteAllNote = page.getByTitle("Delete All");
    // Title input in case notes
    this.inputNoteTitle = page.locator("#title");
    // Description textarea in case notes

    this.textareaNoteDescription = page
      .getByRole("textbox", {
        name: /Rich Text Editor/i,
      })
      .first();

    // Submit button in case notes
    this.btnSubmit = page.getByRole("button", { name: /submit/i });
    // Cancel button in case notes
    this.btnCancel = page.getByRole("button", { name: /cancel/i });
    // Success toast in case notes
    this.createCaseNoteSuccessToast = page
      .locator(
        '[role="alertdialog"], .toast-message, .toast-success, .ngx-toastr',
      )
      .filter({
        hasText: /^\s*Case note created successfully\.?\s*$/i,
      })
      .first();
    // Select all button in case notes
    this.selectAllButton = page.getByText("Select All", { exact: true });
    // Deselect all button in case notes
    this.deselectAllButton = page.getByText("Deselect All", { exact: true });
    // Actions in case notes
    this.deleteNoteAction = page.locator(
      'a[title="Delete"][ng-reflect-authorized="case.delete_case_note"]',
    );
    // list of case notes
    this.caseNoteItemPreview = page.locator(
      'img.img-thumbnail[src="assets/images/case-note.png"]',
    );
    this.table = this.page.locator("ng2-smart-table");
    // Header view case note
    this.textHeaderViewCaseNotes = page
      .locator("nb-card-header")
      .filter({ hasText: /^\s*View Case Note\s*$/i })
      .first();
    // Buttons in view case note
    this.btnCancel = page.getByRole("button", { name: /cancel/i });
    this.btnPrint = page.getByRole("button", { name: /print/i });
    // Print success toast
    this.successToastPrint = page.getByText(
      /case note will\s+down\w*load\s+shortly/i,
    );

    // Popup elements
    // Dialog root
    const deleteConfirmDialog = page.locator("ngx-dialog-confirmation").filter({
      has: page.locator("nb-card-header", { hasText: /Delete Confirmation/i }),
    });

    // Header
    this.deleteConfirmDialog = deleteConfirmDialog.locator("nb-card-header", {
      hasText: /Delete Confirmation/i,
    });

    // Buttons (scoped)
    this.btnYes = deleteConfirmDialog.getByRole("button", {
      name: /^\s*Yes\s*$/i,
    });
    this.btnNo = deleteConfirmDialog.getByRole("button", {
      name: /^\s*No\s*$/i,
    });

    this.caseFilesTable = page.locator("ng2-smart-table");

    // File upload restrictions dialog

    this.uploadRestrictedOverlay = this.page
      .locator(".cdk-overlay-pane")
      .filter({ hasText: /file upload restricted/i })
      .last();

    this.dialogTitleUploadRestricted = this.uploadRestrictedOverlay.getByText(
      /^file upload restricted$/i,
    );

    this.dialogMessageUploadRestricted = this.uploadRestrictedOverlay.getByText(
      /exceeds the maximum file upload limit/i,
    );

    this.dialogLimitValue =
      this.uploadRestrictedOverlay.getByText(/^\s*1000 MB\s*$/);

    this.btnUploadRestrictedOk = this.uploadRestrictedOverlay.getByRole(
      "button",
      { name: /^ok$/i },
    );

    this.dialogUploadRestricted = this.uploadRestrictedOverlay;

    // Helper: row exists by Title cell value
    this.fileRowByTitle = (title: string) =>
      this.caseFilesTable.locator("tbody tr").filter({
        has: page
          .locator("td")
          .nth(5)
          .filter({ hasText: new RegExp(`^\\s*${title}\\s*$`) }),
      });

    // - Edit metadata element -
    // page header
    this.textHeaderEditMetadata = page.locator("nb-card-header", {
      hasText: "Edit Metadata",
    });
    // title metadata input field
    this.titleInputMetadata = page.locator("#title");
    // Classification metadata dropdown
    this.classificationDropdownMetadata = page.locator("#classificaition");
    this.classificationButtonMetadata = page.locator(
      "#classification >> .select-button",
    );
    // Case ID metadata dropdown
    this.caseIdDropdownMetadata = page.locator("#caseId");
    this.caseIdButtonMetadata = page.locator("#caseId >> .select-button");
    // Description text area metadata
    this.descriptionInputMetadata = page.locator("#description");
    // Button
    this.submitButtonMetadata = page.locator("button:has-text('Submit')");
    this.cancelButtonMetadata = page.locator("button:has-text('Cancel')");
    // Update success toast
    this.updateMetadataSuccessToast = page
      .locator(
        '[role="alertdialog"], .toast-message, .toast-success, .ngx-toastr',
      )
      .filter({
        hasText: /(metadata|info).*\b(updat|upload)ed\s+success(fully)?/i,
      })
      .first();
  }

  // Sub-menu My cases method
  // Click upload button
  async clickUploadButton() {
    await this.btnUploadTool.click();
  }
  // Click Sub-menu My Cases
  async clickSubMenuMycase() {
    await this.subMenuMyCases.click();
  }
  // Click create cases button
  async clickCreateCasesBtn() {
    await this.btnCreateCase.click();
  }
  // Click toggle on
  async clickToggleOn() {
    await this.toggle.click();
    await expect(this.toggleOn);
  }
  // Click toggle off
  async clickToggleOff() {
    await this.toggle.click();
    await expect(this.toggleOff);
  }

  // Sub-menu Shared cases method
  // Click Sub-menu Shared cases
  async ClickSubMenuSharedCases() {
    await this.subMenuSharedCases.click();
  }

  // Search case method
  async searchCase(caseID: string) {
    await this.inputSearchCase.fill(caseID);
  }

  // Click to open case detail page
  async clickCaseByCaseID(caseID: string) {
    const caseCard = this.myCaseCards.filter({ hasText: caseID }).first();
    await caseCard.click();
  }

  // Verify open case detail page successfully
  async expectOpenCaseDetailPage(caseID: string) {
    const title = this.page.getByText(new RegExp(`^\\s*${caseID}\\s*$`));
    await expect(title).toBeVisible();
  }

  // Create case note
  async createCaseNote(note: string, noteDescription: string) {
    // click add note button
    await this.btnAddNote.click();
    // Fill title and description in case note form
    await this.inputNoteTitle.fill(note);
    await this.textareaNoteDescription.fill(noteDescription);
    // Verify title is required
    if (note === "") {
      return;
    }
    // Submit case note
    await this.btnSubmit.click();
  }

  // Returns a locator for a cell by header name + row index (0-based)
  async cellByHeader(headerName: string, rowIndex = 0) {
    const table = this.table;
    // Find index of the columnheader that matches headerName
    const header = table.getByRole("columnheader", {
      name: new RegExp(`^\\s*${headerName}\\s*$`, "i"),
    });
    await header.first().waitFor({ state: "visible" });

    const colIndex = await header.first().evaluate((el: HTMLElement) => {
      // th/td index among siblings
      const parentRow = el.parentElement;
      const headers = parentRow ? Array.from(parentRow.children) : [];
      return headers.indexOf(el);
    });

    // Get row and the target cell
    const row = table.locator("tbody tr").nth(rowIndex);
    return row.locator("td").nth(colIndex);
  }

  // === selectClassification method for create new case ===
  async selectClassification(classificationName: string) {
    await this.classificationButton.click();

    // Stronger container for Nebular nb-select
    const container = this.page
      .locator(
        '.cdk-overlay-pane:visible, nb-select-overlay:visible, [role="listbox"]',
      )
      .last();

    await container.waitFor({ state: "visible", timeout: 10000 });

    // Ensure at least one option is rendered
    await container
      .locator("nb-option")
      .first()
      .waitFor({ state: "visible", timeout: 5000 });

    // Precise locator for the exact <nb-option>
    const option = container
      .locator("nb-option")
      .filter({
        hasText: new RegExp(`^${escapeRegex(classificationName)}$`),
      }) // exact match
      .first();

    await expect(
      option,
      `Classification "${classificationName}" should be visible`,
    ).toBeVisible({ timeout: 5000 });

    await option.scrollIntoViewIfNeeded();
    await option.click();
  }

  // === selectClassification method for Edit Metadata ===
  async selectClassificationEditMetadata(classificationName: string) {
    await this.classificationButtonMetadata.click();

    // Stronger container for Nebular nb-select
    const overlay = this.page
      .locator(".cdk-overlay-pane:has(nb-option-list)")
      .last();

    // Wait for overlay to be visible and options to render
    await overlay.waitFor({ state: "visible", timeout: 10000 });
    const nbOptions = overlay.locator("nb-option");
    await nbOptions.first().waitFor({ state: "visible", timeout: 5000 });

    // Pick the option by accessible name (trim + case-insensitive)
    const option = nbOptions
      .filter({
        hasText: new RegExp(
          `^\\s*${escapeRegex(classificationName)}\\s*$`,
          "i",
        ),
      })
      .first();

    await expect(
      option,
      `Classification "${classificationName}" should be visible`,
    ).toBeVisible({
      timeout: 5000,
    });
    await option.click();
  }

  // === selectCaseID method ===
  async selectCaseID(caseId: string) {
    await this.caseIdButtonMetadata.click();

    // Stronger container for Nebular nb-select
    const container = this.page.locator(".cdk-overlay-pane nb-option-list");
    await container.waitFor({ state: "visible", timeout: 10000 });
    // Ensure at least one option is rendered
    await container
      .locator("nb-option")
      .first()
      .waitFor({ state: "visible", timeout: 5000 });

    // Precise locator for the exact <nb-option>
    const option = container
      .locator("nb-option")
      .filter({
        hasText: new RegExp(`^${escapeRegex(caseId)}$`),
      }) // exact match
      .first();
    await option.scrollIntoViewIfNeeded();
    await expect(
      option,
      `Classification "${caseId}" should be visible`,
    ).toBeVisible({ timeout: 5000 });

    await option.click();
  }

  // Create case method
  async createNewCase(
    caseID: string,
    title: string,
    description: string,
    classificationSelect: string,
  ) {
    await this.clickCreateCasesBtn();
    await expect(this.createCaseHeader).toBeVisible();
    await this.inputCaseID.fill(caseID);
    await this.inputTitle.fill(title);
    await this.activeRadio.click();
    await this.selectClassification(classificationSelect);
    // Verify Classification is selected
    await expect(this.classificationButton).toHaveText(classificationSelect, {
      timeout: 5000,
    });
    // If Classification is not selected or select another one, select it again
    if (
      (await this.classificationButton.textContent()) !== classificationSelect
    ) {
      await this.selectClassification(classificationSelect);
    }
    await this.descriptionTextArea.fill(description);
    await this.btnSubmit.click();
  }

  // Click delete case card
  async clickDeleteCaseCard(caseID: string) {
    const caseCard = this.myCaseCards.filter({ hasText: caseID }).first();
    await this.manage.delete.click();
    await this.btnYes.click();
  }

  // Click upload button in upload to case page
  async clickUploadButtonInUploadToCase() {
    await this.uploadButton.click();
  }
  // Click cancel button in upload to case page
  async clickCancelButtonInUploadToCase() {
    await this.cancelButton.click();
  }
  // Click remove all button in upload to case page
  async clickRemoveAllButtonInUploadToCase() {
    await this.removeAllButton.click();
  }

  // Get file name locator in file list after upload
  fileNameLocator(fileName: string): Locator {
    return this.page
      .getByRole("row", { name: new RegExp(`^${escapeRegex(fileName)}$`, "i") })
      .getByRole("cell", {
        name: new RegExp(`^${escapeRegex(fileName)}$`, "i"),
      });
  }

  // Helper to wait until upload finishes and dialog closes

  async waitForUploadToFinish(opts: { timeoutMs?: number } = {}) {
    const timeoutMs = opts.timeoutMs ?? 180_000; // allow large files

    // If dialog isn't present, nothing to wait for.
    if (!(await this.uploadDialog.isVisible())) return;

    // Ensure progress elements are attached
    await this.progressBar
      .waitFor({ state: "attached", timeout: 10_000 })
      .catch(() => {});
    await this.progressText
      .waitFor({ state: "attached", timeout: 10_000 })
      .catch(() => {});

    // Wait for dialog to close after finishing
    await this.uploadDialog
      .waitFor({ state: "hidden", timeout: 30_000 })
      .catch(() => {});
  }

  // Error toast for unsupported file type
  async expectErrorToastUnsupportedType(fileNames: string[]) {
    // Build a regex-safe string inside the brackets: [file1, file2, ...]
    const escapedNames = fileNames.map(escapeRegex);
    const listString = escapedNames.join(",\\s*");

    const pattern = `^"?\\s*File\\s+not\\s+supported:\\s*\\[${listString}\\]\\s*"?\\.?$`;

    // Final regex: File not supported [<files>].
    const expectedText = new RegExp(pattern, "i");

    const errorToastUnsupportedType = this.page
      .getByRole("alert")
      .or(this.page.getByRole("alertdialog"))
      .filter({ hasText: expectedText })
      .first();

    // Debug: show if the locator resolves to an element
    // const handle = await errorToastUnsupportedType.elementHandle();
    // console.log("Located error toast element:", handle ? "FOUND" : "NOT FOUND");

    // Assert toast is visible
    await expect(errorToastUnsupportedType).toBeVisible({
      timeout: 5000,
    });
  }

  // Edit Metadata
  async editMetadata(
    title: string,
    classification: string,
    caseID: string,
    description: string,
  ) {
    await this.titleInputMetadata.fill(title);
    await this.selectClassificationEditMetadata(classification);
    // Verify Classification is selected
    await expect(this.classificationButtonMetadata).toHaveText(classification, {
      timeout: 5000,
    });
    // If Classification is not selected or select another one, select it again
    if (
      (await this.classificationButtonMetadata.textContent()) !== classification
    ) {
      await this.selectClassificationEditMetadata(classification);
    }
    await this.selectCaseID(caseID);
    // Verify CaseID is selected
    await expect(this.caseIdDropdownMetadata).toHaveText(caseID, {
      timeout: 5000,
    });
    // If CaseID is not selected or select another one, select it again
    if ((await this.caseIdDropdownMetadata.textContent()) !== caseID) {
      await this.selectCaseID(caseID);
    }
    await this.descriptionInputMetadata.fill(description);
    await this.btnSubmit.click();
  }

  async verifyFileExists(title: string, classification: string) {
    const row = this.page
      .locator("table tbody tr")
      .filter({ has: this.page.getByRole("cell", { name: title }) })
      .first();
    // Verify row is visible
    await expect(
      row,
      `Row with title "${title}" should be found`,
    ).toBeVisible();
    // Check Classification in same Row
    const classificationCell = row.getByRole("cell", { name: classification });

    await expect(
      classificationCell,
      `Classification "${classification}" should be found for Title "${title}"`,
    ).toBeVisible();
  }

  async verifyFileRemoveFromList(title: string, classification: string) {
    const row = this.page
      .locator("table tbody tr")
      .filter({ has: this.page.getByRole("cell", { name: title }) });
    // Verify row is visible
    await expect(
      row,
      `Row with title "${title}" should be removed`,
    ).toHaveCount(0);
    // Check Classification in same Row

    const classificationCell = this.page
      .getByRole("cell", { name: classification })
      .filter({ has: this.page.getByRole("cell", { name: title }) });

    await expect(
      classificationCell,
      `Classification "${classification}" should not appear for title "${title}"`,
    ).toHaveCount(0);
  }
}
