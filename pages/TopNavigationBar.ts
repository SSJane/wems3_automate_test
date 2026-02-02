import { Page, Locator } from "@playwright/test";
import * as dotenv from "dotenv";
dotenv.config();

class TopNavigationBar {
  page: Page;
  sidebarToggle: Locator;
  logo: Locator;
  advanceSearch: Locator;
  process: Locator;
  userProfileMenu: Locator;
  profile: Locator;
  signOutButton: Locator;
  advanceSearchHeading: Locator;
  inputKeyword: Locator;
  checkBoxAudio: Locator;
  checkBoxPicture: Locator;
  checkBoxDocument: Locator;
  checkBoxVideo: Locator;
  cancel: Locator;
  searchBtn: Locator;
  datepickerSearchByDate: Locator;
  radioSearchByDateRange: Locator;
  radioSearchByDate: Locator;
  selectUsers: Locator;
  radioSearchByUser: Locator;
  radioRecycleBin: Locator;
  radioAssetArchive: Locator;
  radioMyFiles: Locator;
  radioAllFiles: Locator;

  constructor(page: Page) {
    this.page = page;

    // ---- Top Navigation Elements ----
    this.sidebarToggle = page.locator(".sidebar-toggle");
    this.logo = page.getByRole("link").nth(1);
    this.advanceSearch = page.getByRole("link", { name: "Advance Search" });
    this.process = page.getByRole("link", { name: "Processes" });
    this.userProfileMenu = page.locator(".user-picture");
    this.profile = page.getByRole("link", { name: "Profile" });
    this.signOutButton = page.getByRole("link", { name: "Sign Out" });

    // ---- Advance search ----
    // Heading and Title are verified in AdvanceSearchPage
    this.advanceSearchHeading = page.getByRole("heading", {
      name: "Advance Search",
    });
    // Input keyword
    this.inputKeyword = page.getByRole("textbox", { name: "Keyword" });
    // Filler by file types
    this.checkBoxAudio = page.getByRole("checkbox", { name: "Audio" });
    this.checkBoxDocument = page.getByRole("checkbox", { name: "Document" });
    this.checkBoxPicture = page.getByRole("checkbox", { name: "Picture" });
    this.checkBoxVideo = page.getByRole("checkbox", { name: "Video" });
    // Catogory
    this.radioAllFiles = page.locator("#rdofilterType").getByText("All files");
    this.radioMyFiles = page.locator("#rdofilterType").getByText("My files");
    this.radioAssetArchive = page
      .locator("#rdofilterType")
      .getByText("Asset Archive");
    this.radioRecycleBin = page
      .locator("#rdofilterType")
      .getByText("Asset Archive");
    this.radioSearchByUser = page
      .locator("#rdofilterType")
      .getByText("Search By User");
    this.selectUsers = page
      .locator("nb-select#users")
      .getByRole("button", { name: /select a users\.\.\./i });
    // Search by date
    this.radioSearchByDate = page
      .locator("#searchByDate")
      .getByText("Search By Date");
    this.datepickerSearchByDate = page
      .locator(".datepicker-container")
      .locator('input[name="searchByExactlyDate"]');
    this.radioSearchByDateRange = page
      .locator("#searchByDate")
      .getByText("Search By Date Range");
    this.datepickerSearchByDate = page
      .locator(".datepicker-container")
      .locator('input[name="searchByDateStart"]');
    this.datepickerSearchByDate = page
      .locator(".datepicker-container")
      .locator('input[name="searchByDateEnd"]');

    // Button
    this.searchBtn = page.getByRole("button", { name: "Search" });
    this.cancel = page.getByRole("button", { name: "Cancel" });
  }

  // ---- Top Navigation Methods ----
  async clickSidebarToggle() {
    await this.sidebarToggle.click();
  }

  async clickAdvanceSearch() {
    await this.advanceSearch.click();
  }

  async clickUserProfileMenu() {
    await this.userProfileMenu.click();
  }

  async clickProfile() {
    await this.profile.click();
  }

  async clickSignOut() {
    await this.signOutButton.click();
  }

  async expectLogoVisible() {
    await this.logo.waitFor({ state: "visible", timeout: 5000 });
  }

  async expectAdvanceSearchVisible() {
    await this.advanceSearch.waitFor({ state: "visible", timeout: 5000 });
  }

  async expectUserProfileMenuVisible() {
    await this.userProfileMenu.waitFor({ state: "visible", timeout: 5000 });
  }

  async expectSidebarToggleVisible() {
    await this.sidebarToggle.waitFor({ state: "visible", timeout: 5000 });
  }
}

export { TopNavigationBar };
