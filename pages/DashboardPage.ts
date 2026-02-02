import { expect, Page, Locator } from "@playwright/test";
import * as dotenv from "dotenv";
dotenv.config();

class DashboardPage {
  page: Page;
  root: Locator;
  shopCardImage: Locator;
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
  dashboardMyCases: Locator;
  dashboardMyPhoto: Locator;
  dashboardMyVideo: Locator;
  dashboardAllFiles: Locator;
  dashboardNews: Locator;
  dashboardSupport: Locator;
  dashboardQuickLinks: Locator;
  wolfcomLink: Locator;
  facebookLink: Locator;
  twitterLink: Locator;
  linkedinLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // ---- High-level roots----
    this.root = page
      .locator('[data-testid="dashboard-root"]')
      .or(page.getByRole("main"));

    // ---- Sidebar Navigation ----
    this.dashboardMenu = page.getByRole("link", { name: "Dashboard" });
    this.filesMenu = page.getByRole("link", { name: "Files" });
    this.filesMenu = page.getByRole("link", { name: "All Files" });
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

    // ---- Dashboard Page Elements ----
    this.dashboardMyCases = page.getByRole("link", { name: "My Cases" });
    this.dashboardMyPhoto = page.getByRole("link", { name: "My Photos" });
    this.dashboardMyVideo = page.getByRole("link", { name: "My Videos" });
    this.dashboardAllFiles = page.getByRole("link", { name: "All Files" });
    this.dashboardNews = page.getByRole("link", { name: "News" });
    this.shopCardImage = page.locator("nb-card.shop img.openLink");
    this.dashboardSupport = page.getByRole("link", { name: "Support" });
    this.dashboardQuickLinks = page.getByRole("link", { name: "Forums" });

    // ---- Bottom Navigation ----
    this.wolfcomLink = page.getByRole("link", { name: "Wolfcom Enterprise" });
    this.facebookLink = page.locator("i.fab.fa-facebook-f");
    this.twitterLink = page.locator("i.fab.fa-twitter");
    this.linkedinLink = page.locator("i.fab.fa-linkedin");
  }

  async goto(url?: string) {
    await this.page.goto(
      url ||
        process.env.DASHBOARD_URL_STAGING ||
        "http://192.168.1.252/#/pages/dashboard",
    );
  }
}

export { DashboardPage };
