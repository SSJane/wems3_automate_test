import { Locator, Page, expect } from "@playwright/test";

export class CaseCard {
  page: Page;
  root: Locator;
  title: Locator;
  shortDesc: Locator;
  totalItems: Locator;
  manage: { print: Locator; edit: Locator; delete: Locator };
  icons: { folderNormal: Locator; folderShared: Locator; folderLock: Locator };

  constructor(page: Page, root: Locator) {
    this.page = page;
    this.root = root;

    this.title = this.root.locator(".case-list-box .details .title.h5");
    this.shortDesc = this.root.locator(
      ".card-list-box .details .short-desc.paragraph-2",
    );
    this.totalItems = this.root.locator(
      ".card-bottom .total-items.paragraph-2",
    );
    this.manage = {
      print: this.root.locator('.card-bottom .manage-icon [title="Print"]'),
      edit: this.root.locator('.card-bottom .manage-icon [title="Edit"]'),
      delete: this.root.locator('.card-bottom .manage-icon [title="Delete"]'),
    };

    this.icons = {
      folderNormal: this.root.locator(".icon .fa-duotone.fa-folder-open"),
      folderShared: this.root.locator(".icon .fa-solid.fa-folder-user"),
      folderLock: this.root.locator(".icon img.lock-icon"),
    };
  }

  // Click to open case
  async clickCase() {
    await this.root.click();
  }
  // Click print icon
  async clickPrint() {
    await this.manage.print.click();
  }
  // Click edit icon
  async clickEdit() {
    await this.manage.edit.click();
  }
  // Click delete icon
  async clickDelete() {
    await this.manage.delete.click();
  }

  // Get case title
  async getTitle(): Promise<string> {
    return (await this.title.textContent())?.trim() ?? "";
  }
  // Get case decription
  async getShortDesc(): Promise<string> {
    return (await this.shortDesc.textContent())?.trim() ?? "";
  }

  // Get total items in case
  async getTotalItems(): Promise<number> {
    const txt = (await this.totalItems.textContent())?.trim() ?? "0";
    const n = Number(txt.replace(/[^\d]/g, ""));
    return Number.isNaN(n) ? 0 : n;
  }

  // Check folder status: Normal
  async hasFolderNormalIcon(): Promise<boolean> {
    return await this.icons.folderNormal.isVisible().catch(() => false);
  }
  // Check folder status: Shared
  async hasFolderShared(): Promise<boolean> {
    return await this.icons.folderShared.isVisible().catch(() => false);
  }
  // Check folder status: Lock
  async hasFolderLock(): Promise<boolean> {
    return await this.icons.folderLock.isVisible().catch(() => false);
  }

  // Verify case have title
  async expectTitle(name: string) {
    await expect(this.title).toHaveText(
      new RegExp(`^\\s*${escapeRegExp(name)}\\s*$`),
    );
  }

  // Verify total of item in case is number
  async expectTotalItemsIsNumber() {
    await expect(this.totalItems).toHaveText(/\d+/);
  }
}

// ---- Helper ----
function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
