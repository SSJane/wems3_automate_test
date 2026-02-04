import { Page, Locator, expect } from "@playwright/test";
import * as dotenv from "dotenv";
dotenv.config();

class TopNavigationBar {
  page: Page;
  sidebarToggle: Locator;
  logo: Locator;
  advanceSearch: Locator;
  processes: Locator;
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
  searchResultsTable: Locator;
  searchResultsRows: Locator;
  searchResultsCount: Locator;
  totalResults: Locator;

  constructor(page: Page) {
    this.page = page;

    // ---- Top Navigation Elements ----
    this.sidebarToggle = page.locator(".sidebar-toggle");
    this.logo = page.getByRole("link").nth(1);
    this.advanceSearch = page.getByRole("link", { name: "Advance Search" });
    this.processes = page.getByTitle("Processes");
    this.userProfileMenu = page.locator(".user-picture");
    this.profile = page.getByRole("link", { name: "Profile" });
    this.signOutButton = page.getByTitle("Sign out");

    // ---- Advance search ----
    this.advanceSearchHeading = page
      .locator("ngx-advance-search")
      .getByText("Advance Search");
    this.inputKeyword = page.getByRole("textbox", { name: "Keyword" });
    this.checkBoxAudio = page.getByRole("checkbox", { name: "Audio" });
    this.checkBoxDocument = page.getByRole("checkbox", { name: "Document" });
    this.checkBoxPicture = page.getByRole("checkbox", { name: "Picture" });
    this.checkBoxVideo = page.getByRole("checkbox", { name: "Video" });

    this.radioAllFiles = page.locator("#rdofilterType").getByText("All files");
    this.radioMyFiles = page.locator("#rdofilterType").getByText("My files");
    this.radioAssetArchive = page
      .locator("#rdofilterType")
      .getByText("Asset Archive");
    this.radioRecycleBin = page
      .locator("#rdofilterType")
      .getByText("Recycle Bin");
    this.radioSearchByUser = page
      .locator("#rdofilterType")
      .getByText("Search By User");
    this.selectUsers = page
      .locator("nb-select#users")
      .getByRole("button", { name: /select a users\.\.\./i });

    this.radioSearchByDate = page
      .locator("#searchByDate")
      .getByText("Search By Date");
    this.datepickerSearchByDate = page
      .locator(".datepicker-container")
      .locator('input[name="searchByExactlyDate"]');
    this.radioSearchByDateRange = page
      .locator("#searchByDate")
      .getByText("Search By Date Range");

    this.searchBtn = page.getByRole("button", { name: "Search" });
    this.cancel = page.getByRole("button", { name: "Cancel" });

    // ---- Search Results ----
    this.searchResultsTable = page.locator("table").first();

    this.searchResultsRows = this.page.locator(
      'tbody > tr:has(td) >> :scope:not(:has-text("No data available."))',
    );

    this.searchResultsCount = page.locator(".total-results, [class*='total']");
    this.totalResults = page.getByRole("heading", { name: "Total Results" });
  }

  // ---- Top Navigation Methods ----
  async clickSidebarToggle() {
    await this.sidebarToggle.click();
  }

  async clickAdvanceSearch() {
    await this.advanceSearch.click();
  }

  async clickProcesses() {
    await this.processes.click();
  }

  async clickUserProfileMenu() {
    await this.userProfileMenu.click();
  }

  async clickProfile() {
    await this.profile.click();
  }

  async clickSignOut() {
    // 1) Ensure the item is visible
    await expect(this.signOutItem).toBeVisible({ timeout: 5000 });

    // 2) Click and wait for redirect to login/auth route
    await Promise.all([
      this.page.waitForURL(/(auth|login)/i, { timeout: 15000 }),
      this.signOutItem.click(),
    ]);
  }

  async expectLogoVisible() {
    await this.logo.waitFor({ state: "visible", timeout: 5000 });
  }

  async expectAdvanceSearchVisible() {
    await this.advanceSearch.waitFor({ state: "visible", timeout: 5000 });
  }

  async expectProcessesVisible() {
    await this.processes.waitFor({ state: "visible", timeout: 5000 });
  }

  async expectUserProfileMenuVisible() {
    await this.userProfileMenu.waitFor({ state: "visible", timeout: 5000 });
  }

  async expectSidebarToggleVisible() {
    await this.sidebarToggle.waitFor({ state: "visible", timeout: 5000 });
  }

  // ---- Advance Search Methods ----
  async enterKeyword(keyword: string) {
    await this.inputKeyword.fill(keyword);
  }

  async selectFileType(fileType: "Audio" | "Document" | "Picture" | "Video") {
    await this.toggleFileType(fileType, true);
  }

  async deselectFileType(fileType: "Audio" | "Document" | "Picture" | "Video") {
    await this.toggleFileType(fileType, false);
  }

  async deselectAllFileTypes() {
    await this.deselectFileType("Audio");
    await this.deselectFileType("Document");
    await this.deselectFileType("Picture");
    await this.deselectFileType("Video");
  }

  async selectMultipleFileTypes(
    fileTypes: Array<"Audio" | "Document" | "Picture" | "Video">,
  ) {
    await this.deselectAllFileTypes();
    for (const fileType of fileTypes) {
      await this.selectFileType(fileType);
    }
  }

  get signOutItem() {
    const menuItem = this.page
      .getByRole("menuitem", { name: /sign out|general\.sign_out/i })
      .first();
    const linkItem = this.page
      .getByRole("link", { name: /sign out|general\.sign_out/i })
      .first();
    return menuItem.or(linkItem);
  }

  async selectCategory(
    category:
      | "All Files"
      | "My Files"
      | "Asset Archive"
      | "Recycle Bin"
      | "Search By User",
  ) {
    const categoryMap: Record<
      | "All Files"
      | "My Files"
      | "Asset Archive"
      | "Recycle Bin"
      | "Search By User",
      Locator
    > = {
      "All Files": this.radioAllFiles,
      "My Files": this.radioMyFiles,
      "Asset Archive": this.radioAssetArchive,
      "Recycle Bin": this.radioRecycleBin,
      "Search By User": this.radioSearchByUser,
    };
    await categoryMap[category].click();
  }

  async selectUser(userName: string) {
    await this.selectUsers.click();
    await this.page.waitForTimeout(500);

    let found = false;
    const maxAttempts = 10;
    let attempts = 0;

    while (!found && attempts < maxAttempts) {
      const option = this.page.getByRole("option", {
        name: new RegExp(userName, "i"),
      });
      const count = await option.count();

      if (count > 0) {
        await option.first().click();
        found = true;
      } else {
        const optionsList = this.page.locator("[role='listbox']");
        if (await optionsList.isVisible()) {
          await optionsList.evaluate((el) => (el.scrollTop += 150));
          await this.page.waitForTimeout(300);
        }
      }
      attempts++;
    }

    if (!found) {
      throw new Error(
        `User "${userName}" not found in dropdown after scrolling`,
      );
    }
  }

  async toggleFileType(
    fileType: "Audio" | "Document" | "Picture" | "Video",
    desiredChecked: boolean,
  ) {
    // Target the visible custom checkbox span (common in Nebular/NgBootstrap custom checkboxes)
    const customCheckbox = this.page
      .getByRole("checkbox", { name: fileType })
      .locator("xpath=..") // go to parent (nb-checkbox)
      .locator("span.custom-checkbox");

    const isChecked = await customCheckbox.evaluate((el) =>
      el.classList.contains("checked"),
    );

    if (isChecked !== desiredChecked) {
      await customCheckbox.click(); // clicks the visible overlay directly
    }
  }

  async searchByExactDate(date: string) {
    await this.radioSearchByDate.click();
    await this.datepickerSearchByDate.fill(date);
  }

  async searchByDateRange(startDate: string, endDate: string) {
    await this.radioSearchByDateRange.click();
    const startDateInput = this.page
      .locator(".datepicker-container")
      .locator('input[name="searchByDateStart"]');
    const endDateInput = this.page
      .locator(".datepicker-container")
      .locator('input[name="searchByDateEnd"]');
    await startDateInput.fill(startDate);
    await endDateInput.fill(endDate);
  }

  async clickSearch() {
    await this.searchBtn.click();
  }

  async clickCancel() {
    await this.cancel.click();
  }

  async performAdvancedSearch(options: {
    keyword?: string;
    fileTypes?: Array<"Audio" | "Document" | "Picture" | "Video">;
    category?:
      | "All Files"
      | "My Files"
      | "Asset Archive"
      | "Recycle Bin"
      | "Search By User";
    userName?: string;
    searchByDate?: string;
    searchByDateRange?: { startDate: string; endDate: string };
  }) {
    if (options.keyword) {
      await this.enterKeyword(options.keyword);
    }

    if (options.fileTypes && options.fileTypes.length > 0) {
      await this.selectMultipleFileTypes(options.fileTypes);
    }

    if (options.category) {
      await this.selectCategory(options.category);
    }

    if (options.category === "Search By User" && options.userName) {
      await this.selectUser(options.userName);
    }

    if (options.searchByDate) {
      await this.searchByExactDate(options.searchByDate);
    }

    if (options.searchByDateRange) {
      await this.searchByDateRange(
        options.searchByDateRange.startDate,
        options.searchByDateRange.endDate,
      );
    }

    await this.clickSearch();
    await this.page.waitForLoadState("networkidle", { timeout: 20000 });
  }

  async expectAdvanceSearchHeadingVisible() {
    await this.advanceSearchHeading.waitFor({
      state: "visible",
      timeout: 5000,
    });
  }

  async getKeywordInputValue(): Promise<string | null> {
    return await this.inputKeyword.inputValue();
  }

  async isFileTypeChecked(
    fileType: "Audio" | "Document" | "Picture" | "Video",
  ): Promise<boolean> {
    return await this.page
      .getByRole("checkbox", { name: fileType })
      .isChecked();
  }

  // Search Results Methods
  async waitForSearchResultsToLoad() {
    await this.totalResults.waitFor({ state: "visible", timeout: 10000 });
  }

  async getSearchResultsCount(): Promise<number> {
    await this.searchResultsTable
      .waitFor({ state: "visible", timeout: 15000 })
      .catch(() => {});
    return await this.searchResultsRows.count();
  }

  async verifySearchResultsContainKeyword(keyword: string): Promise<boolean> {
    await this.waitForSearchResultsToLoad();
    const rows = this.searchResultsRows;
    const rowCount = await rows.count();

    if (rowCount === 0) {
      return false;
    }

    for (let i = 0; i < rowCount; i++) {
      const rowText = await rows.nth(i).textContent();
      if (rowText && rowText.toLowerCase().includes(keyword.toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  async verifyAllSearchResultsContainKeyword(
    keyword: string,
  ): Promise<boolean> {
    await this.waitForSearchResultsToLoad();
    const rows = this.searchResultsRows;
    const rowCount = await rows.count();

    if (rowCount === 0) {
      return false;
    }

    for (let i = 0; i < rowCount; i++) {
      const rowText = await rows.nth(i).textContent();
      if (!rowText || !rowText.toLowerCase().includes(keyword.toLowerCase())) {
        return false;
      }
    }
    return true;
  }

  async getSearchResultsColumnData(columnHeader: string): Promise<string[]> {
    await this.waitForSearchResultsToLoad();

    const headers = this.page.locator("thead th");
    const headerCount = await headers.count();

    let colIndex = -1;
    for (let i = 0; i < headerCount; i++) {
      const headerText = (await headers.nth(i).textContent())?.trim();
      if (headerText === columnHeader) {
        colIndex = i;
        break;
      }
    }

    if (colIndex === -1) {
      throw new Error(`Column "${columnHeader}" not found in results table`);
    }

    const cells = this.page.locator(`tbody tr td:nth-child(${colIndex + 1})`);
    const cellCount = await cells.count();

    const data: string[] = [];
    for (let i = 0; i < cellCount; i++) {
      const text = await cells.nth(i).textContent();
      if (text) {
        data.push(text.trim());
      }
    }

    return data;
  }

  async getSearchResultsTitles(): Promise<string[]> {
    return this.getSearchResultsColumnData("Title");
  }

  async getSearchResultsTypes(): Promise<string[]> {
    return this.getSearchResultsColumnData("Type");
  }

  async verifyAllSearchResultsAreType(
    types: string | string[],
  ): Promise<boolean> {
    const typeArray = Array.isArray(types) ? types : [types];
    const resultTypes = await this.getSearchResultsTypes();

    if (resultTypes.length === 0) {
      return false;
    }

    return resultTypes.every((type) => {
      const normalizedType = type.toLowerCase().trim();
      return typeArray.some(
        (expectedType) => normalizedType === expectedType.toLowerCase(),
      );
    });
  }

  get totalResultsHeading() {
    // Matches e.g. "Total Results : 761" (case/space tolerant)
    return this.page
      .getByRole("heading", { name: /Total\s*Results\s*:\s*\d+/i })
      .first();
  }

  get emptyStateCell() {
    return this.page
      .getByRole("cell", { name: /No data available\./i })
      .first();
  }

  async getTotalResultsCountFromUI(): Promise<number> {
    const el = this.totalResultsHeading;

    // Wait for the visible counter and for it to have the expected shape
    await expect(el).toBeVisible({ timeout: 15000 });
    await expect(el).toHaveText(/Total\s*Results\s*:\s*[\d.,\s]+/i);

    // Read from the SAME locator you just validated
    const text = (await el.innerText()).trim();
    console.log(`Total Results text: "${text}"`);

    // Parse number robustly (handles commas/dots/spaces, case-insensitive)
    const match = text.match(/Total\s*Results\s*:\s*([\d.,\s]+)/i);
    console.log(`Regex match result: ${match}`);
    if (!match) {
      throw new Error(`Parse failed for: "${text}"`);
    }

    const value = parseInt(match[1].replace(/[.,\s]/g, ""), 10);
    return Number.isFinite(value) ? value : 0;
  }

  async verifySearchResultsNotEmpty(): Promise<boolean> {
    const count = await this.getSearchResultsCount();
    if (count === 0) {
      return false;
    }
    const dataCells = await this.page.locator("td[data-title]").count();
    return dataCells > 0;
  }

  async verifyNoDataAvailable(): Promise<boolean> {
    // Wait until the counter shows 0
    await expect(this.totalResultsHeading).toHaveText(
      /Total\s*Results\s*:\s*0/i,
      { timeout: 15000 },
    );

    // The table exists, but should show the empty-state cell
    await expect(this.emptyStateCell).toBeVisible({ timeout: 15000 });
    return await this.emptyStateCell.isVisible();
  }

  async verifyResultsWithData(): Promise<boolean> {
    const count = await this.getSearchResultsCount();
    if (count === 0) {
      return false;
    }
    const dataCells = await this.page.locator("td").count();
    return dataCells > 0;
  }

  async clickSearchResultByTitle(title: string) {
    const titleCell = this.page.locator(`td:has-text("${title}")`);
    await titleCell.click();
  }

  async getSearchResultRowData(
    rowIndex: number,
  ): Promise<Record<string, string>> {
    const row = this.searchResultsRows.nth(rowIndex);
    const cells = row.locator("td");
    const cellCount = await cells.count();
    const data: Record<string, string> = {};
    const columnHeaders = [
      "Preview",
      "Type",
      "Size",
      "CaseNo",
      "Title",
      "Classification",
      "UploadedBy",
      "UploadedDate",
      "AuditLog",
    ];

    for (let i = 0; i < cellCount && i < columnHeaders.length; i++) {
      const cellText = await cells.nth(i).textContent();
      data[columnHeaders[i]] = cellText?.trim() || "";
    }
    return data;
  }
}

export { TopNavigationBar };
