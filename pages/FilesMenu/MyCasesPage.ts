import { Page, expect, Locator } from "@playwright/test";
import * as dotenv from "dotenv";
import { CaseCard } from "../components/caseCard";
dotenv.config();

export class MyCasesPage {
  page: Page;
  btnCreateCase: Locator;
  searchCase: Locator;
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
  btnSummit: Locator;
  btnCancel: Locator;
  textHeaderMyCases: Locator;
  textHerderSharedCase: Locator;
  searchSharedCase: Locator;
  subMenuSharedCases: Locator;
  subMenuMyCases: Locator;
  textNodataMyCases: Locator;
  textNoDataSharedCase: Locator;
  myCaseCards: Locator;

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
    this.searchCase = page.locator("#searchInput");
    this.toggle = page.locator(".toggle");
    this.toggleOff = page.locator(".toggle:not(.checked)");
    this.toggleOn = page.locator(".toggle.checked");
    // create case
    this.createCaseHeader = page.locator(
      'nb-card-header:has-text("Ceate Case")',
    );
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
    this.descriptionTextArea = page.locator("#description");
    this.btnSummit = page.getByRole("button", { name: "Summit" });
    this.btnCancel = page.getByRole("button", { name: "Cancel" });

    // sub menu shared cases
    this.subMenuSharedCases = page.getByRole("link", { name: "Shared Cases" });
    this.textHerderSharedCase = page.locator(
      'nb-card-header h6:has-text("Shared Cases")',
    );
    this.textNoDataSharedCase = page.getByText("No data available.");
    this.searchSharedCase = page.locator("#searchSharedCaseInput");
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
    await expect(this.toggleOff)
  }

  // Sub-menu Shared cases method
  // Click Sub-menu Shared cases
  async ClickSubMenuSharedCases() {
    await this.subMenuSharedCases.click();
  }
}
