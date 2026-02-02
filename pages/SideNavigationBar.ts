import { Page, Locator } from "@playwright/test";
import * as dotenv from "dotenv";
dotenv.config();

class SideNavigationBar {
  page: Page;
  dashboardMenu: Locator;
  filesMenu: Locator;
  camerasMenu: Locator;
  assetArchiveMenu: Locator;
  retentionMenu: Locator;
  RecycleBinMenu: Locator;
  crimeMapMenu: Locator;
  accessControlMenu: Locator;
  usersMenu: Locator;
  settingsMenu: Locator;
  ganeralMenu: Locator;
  securityMenu: Locator;
  sessionsMenu: Locator;
  maintenanceMenu: Locator;
  analyticsMenu: Locator;
  helpMenu: Locator;
  videoTutorialsMenu: Locator;
  downloadsMenu: Locator;
  aboutMenu: Locator;

  constructor(page: Page) {
    this.page = page;

    // ---- Sidebar Navigation ----
    this.dashboardMenu = page.getByRole("link", { name: "Dashboard" });
    this.filesMenu = page.getByRole("link", { name: "Files" });
    this.camerasMenu = page.getByRole("link", { name: "Cameras" });
    this.assetArchiveMenu = page.getByRole("link", { name: "Asset Archive" });
    this.retentionMenu = page.getByRole("link", { name: "Retention" });
    this.RecycleBinMenu = page.getByRole("link", { name: "Recycle Bin" });
    this.crimeMapMenu = page.getByRole("link", { name: "Crime Map" });
    this.accessControlMenu = page.getByRole("link", { name: "Access Control" });
    this.usersMenu = page.getByRole("link", { name: "Users" });
    this.settingsMenu = page.getByRole("link", { name: "Settings" });
    this.ganeralMenu = page.getByRole("link", { name: "General" });
    this.securityMenu = page.getByRole("link", { name: "Security" });
    this.sessionsMenu = page.getByRole("link", { name: "Sessions" });
    this.maintenanceMenu = page.getByRole("link", { name: "Maintenance" });
    this.analyticsMenu = page.getByRole("link", { name: "Analytics" });
    this.helpMenu = page.getByRole("link", { name: "Help" });
    this.videoTutorialsMenu = page.getByRole("link", {
      name: "Video Tutorials",
    });
    this.downloadsMenu = page.getByRole("link", { name: "Downloads" });
    this.aboutMenu = page.getByRole("link", { name: "About us" });
  }

  // ---- Sidebar Navigation Methods ----
  async clickDashboardMenu() {
    await this.dashboardMenu.click();
  }

  async clickFilesMenu() {
    await this.filesMenu.click();
  }

  async clickCamerasMenu() {
    await this.camerasMenu.click();
  }

  async clickAssetArchiveMenu() {
    await this.assetArchiveMenu.click();
  }

  async clickRetentionMenu() {
    await this.retentionMenu.click();
  }

  async clickRecycleBinMenu() {
    await this.RecycleBinMenu.click();
  }

  async clickCrimeMapMenu() {
    await this.crimeMapMenu.click();
  }

  async clickAccessControlMenu() {
    await this.accessControlMenu.click();
  }

  async clickUsersMenu() {
    await this.usersMenu.click();
  }

  async clickSettingsMenu() {
    await this.settingsMenu.click();
  }

  async clickGeneralMenu() {
    await this.ganeralMenu.click();
  }

  async clickSecurityMenu() {
    await this.securityMenu.click();
  }

  async clickSessionsMenu() {
    await this.sessionsMenu.click();
  }

  async clickMaintenanceMenu() {
    await this.maintenanceMenu.click();
  }

  async clickAnalyticsMenu() {
    await this.analyticsMenu.click();
  }

  async clickHelpMenu() {
    await this.helpMenu.click();
  }

  async clickVideoTutorialsMenu() {
    await this.videoTutorialsMenu.click();
  }

  async clickDownloadsMenu() {
    await this.downloadsMenu.click();
  }

  async clickAboutMenu() {
    await this.aboutMenu.click();
  }
}

export { SideNavigationBar };
