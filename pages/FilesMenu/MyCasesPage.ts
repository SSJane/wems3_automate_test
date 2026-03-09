import { Page, expect, Locator } from "@playwright/test";
import * as dotenv from "dotenv";
import { escapeRegex } from "../../utils/escapeRegax";
import { CaseCard } from "../components/caseCard";
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
  successToast: Locator;
  classificationButton: Locator;
  overlayContainer: Locator;
  btnSubmit: Locator;
  btnBack: Locator;
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
  successToastCreated: Locator;
  successToastDeleted: Locator;
  textHeaderViewCaseNotes: Locator;
  btnPrint: Locator;
  successToastPrint: Locator;
  caseNoteItemPreview: Locator;
  table: any;

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
    this.successToastCreated = page.getByText(/case note(s)? .*created successfully|created successfully/i);
    this.successToastDeleted = page.getByText(/case note(s)? .*deleted successfully|deleted successfully/i);

    // sub menu shared cases
    this.subMenuSharedCases = page.getByRole("link", { name: "Shared Cases" });
    this.textHerderSharedCase = page.locator(
      'nb-card-header h6:has-text("Shared Cases")',
    );
    this.textNoDataSharedCase = page.getByText("No data available.");
    this.searchSharedCase = page.locator("#searchSharedCaseInput");

    // Case page elements
    // Back button
    this.btnBack = page.getByRole("button", { name: /back/i });
    // More Actions dropdown
    this.btnMoreActionsDropdown = page.locator("#MoreActionsMenu");
    // Case Notes button
    this.btnCaseNotes = page.getByRole("button", {
      name: /^Case Notes \(\d+\)$/,
    });

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
    this.successToast = page.getByText("Case note created successfully");
    // Select all button in case notes
    this.selectAllButton = page.getByText("Select All", { exact: true });
    // Deselect all button in case notes
    this.deselectAllButton = page.getByText("Deselect All", { exact: true });
    // Actions in case notes
    this.deleteAction = page.locator(
      'a[title="Delete"][ng-reflect-authorized="case.delete_case_note"]',
    );
    // list of case notes
    this.caseNoteItemPreview = page.locator(
      'img.img-thumbnail[src="assets/images/case-note.png"]',
    );
    this.table = this.page.locator('ng2-smart-table');
    // Header view case note
    this.textHeaderViewCaseNotes = page
      .locator("nb-card-header")
      .filter({ hasText: /^\s*View Case Note\s*$/i })
      .first();
    // Buttons in view case note
    this.btnCancel = page.getByRole("button", { name: /cancel/i });
    this.btnPrint = page.getByRole("button", { name: /print/i });
    // Print success toast
    this.successToastPrint = page.getByText(/case note will\s+down\w*load\s+shortly/i);

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
  }

  // Sub-menu My cases method
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
  async clickCaseByTitle(caseID: string) {
    const caseCard = this.myCaseCards.filter({ hasText: caseID }).first();
    await caseCard.click();
  }

  // Create case note
  async createCaseNote(note: string, noteDescription: string) {
    // click add note button
    await this.btnAddNote.click();
    // Fill title and description in case note form
    await this.inputNoteTitle.fill(note);
    await this.textareaNoteDescription.fill(noteDescription);
    // Submit case note
    await this.btnSubmit.click();
  }

  
// Returns a locator for a cell by header name + row index (0-based)
async cellByHeader(headerName: string, rowIndex = 0) {
  const table = this.table;
  // Find index of the columnheader that matches headerName
  const header = table.getByRole('columnheader', { name: new RegExp(`^\\s*${headerName}\\s*$`, 'i') });
  await header.first().waitFor({ state: 'visible' });

  const colIndex = await header.first().evaluate((el: HTMLElement) => {
    // th/td index among siblings
    const parentRow = el.parentElement;
    const headers = parentRow ? Array.from(parentRow.children) : [];
    return headers.indexOf(el);
  });

  // Get row and the target cell
  const row = table.locator('tbody tr').nth(rowIndex);
  return row.locator('td').nth(colIndex);
}


  // === Updated selectClassification method ===
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
}
