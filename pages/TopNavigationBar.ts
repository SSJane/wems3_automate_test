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