import { expect, Page, Locator } from "@playwright/test";
import * as dotenv from "dotenv";
dotenv.config();

class DashboardPage {
  page: Page;
  dashboardMyCases: Locator;
  dashboardMyPhoto: Locator;
  dashboardMyVideo: Locator;
  dashboardAllFiles: Locator;
  dashboardShop: Locator;
  headerMyCases: Locator;
  headerMyPhotos: Locator;
  headerMyVideos: Locator;
  headerAllFiles: Locator;

  constructor(page: Page) {
    this.page = page;

    // ---- Dashboard Page Elements ----
    this.dashboardMyCases = page
      .locator("div.dashboard-card")
      .filter({ hasText: "My Cases" });
    this.dashboardMyPhoto = page
      .locator("div.dashboard-card")
      .filter({ hasText: "My Photos" });
    this.dashboardMyVideo = page
      .locator("div.dashboard-card")
      .filter({ hasText: "My Videos" });
    this.dashboardAllFiles = page
      .locator("div.dashboard-card")
      .filter({ hasText: "All Files" });
    this.dashboardShop = page
      .locator("nb-card")
      .filter({ hasText: "SHOP" })
      .locator("img");
    // --- Header Elements ---

    const myCasesHeaderSection = page.locator(
      "nb-card-header.main-card-header",
    );
    this.headerMyCases = myCasesHeaderSection.getByRole("heading", {
      name: /My Cases/i,
    });

    this.headerMyPhotos = myCasesHeaderSection.getByRole("heading", { name: /My Photos/i });
    this.headerMyVideos = myCasesHeaderSection.getByRole("heading", { name: /My Videos/i });
    this.headerAllFiles = myCasesHeaderSection.getByRole("heading", { name: /All Files/i });
  }

  async clickMyCases() {
    await this.dashboardMyCases.click();
  }

  async clickMyPhotos() {
    await this.dashboardMyPhoto.click();
  }

  async clickMyVideos() {
    await this.dashboardMyVideo.click();
  }

  async clickAllFiles() {
    await this.dashboardAllFiles.click();
  }

  async clickShop() {
    await this.dashboardShop.click();
  }

  async expectedDashboardWidgetsVisible() {
    await expect(this.dashboardMyCases).toBeVisible();
    await expect(this.dashboardMyPhoto).toBeVisible();
    await expect(this.dashboardMyVideo).toBeVisible();
    await expect(this.dashboardAllFiles).toBeVisible();
    await expect(this.dashboardShop).toBeVisible();
  }

  // verify My Cases page is loaded by checking the header
  async expectedMyCasesPageVisible() {
    await expect(this.headerMyCases).toBeVisible();
  }
  // verify My Photos page is loaded by checking the header
  async expectedMyPhotosPageVisible() {
    await expect(this.headerMyPhotos).toBeVisible();
  }
  // verify My Videos page is loaded by checking the header
  async expectedMyVideosPageVisible() {
    await expect(this.headerMyVideos).toBeVisible();
  }
  // verify All Files page is loaded by checking the header
  async expectedAllFilesPageVisible() {
    await expect(this.headerAllFiles).toBeVisible();
  }
}

export { DashboardPage };
