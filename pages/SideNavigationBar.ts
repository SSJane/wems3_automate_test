import { Page, Locator, expect } from "@playwright/test";
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
  myCasesMenu: Locator;
  myFavoritesMenu: Locator;
  myBookmarksMenu: Locator;
  myPhotosMenu: Locator;
  myVideosMenu: Locator;
  myAudioMenu: Locator;
  myDocumentsMenu: Locator;
  rolesMenu: Locator;
  groupsMenu: Locator;
  permissionsMenu: Locator;
  allFilesMenu: Locator;
  sharedFilesMenu: Locator;
  licenseMenu: Locator;
  classificationsMenu: Locator;
  servicesMenu: Locator;
  emailMenu: Locator;
  webappMenu: Locator;
  storageMenu: Locator;
  connectionMenu: Locator;
  databaseMenu: Locator;
  ActivityLogsMenu: Locator;
  verifyFilesMenu: Locator;
  submitTicketMenu: Locator;
  feedbackMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    // Helper: resolve locators by '.menu-title' text and climb to parent 'a' tag
   

    // ---- Sidebar Navigation ----
    this.dashboardMenu = page.getByRole('link', { name: 'Dashboard' });
    // Files Menu
    this.filesMenu = page.getByRole('link', { name: 'Files' })
    this.myCasesMenu = page.getByRole('link', { name: 'My Cases' });
    this.myFavoritesMenu = page.getByRole('link', { name: 'My Favorites' });
    this.myBookmarksMenu = page.getByRole('link', { name: 'My Bookmarks' });
    this.myPhotosMenu = page.getByRole('link', { name: 'My Photos' });
    this.myVideosMenu = page.getByRole('link', { name: 'My Videos' });
    this.myAudioMenu = page.getByRole('link', { name: 'My Audio' });
    this.myDocumentsMenu = page.getByRole('link', { name: 'My Documents' });
    this.allFilesMenu = page.getByRole('link', { name: 'All Files' });
    this.sharedFilesMenu = page.getByRole('link', { name: 'Shared Files' });
    // Cameras Menu
    this.camerasMenu = page.getByRole('link', { name: 'Cameras' });
    // Asset Archive Menu
    this.assetArchiveMenu = page.getByRole('link', { name: 'Asset Archive' });
    // Retention Menu
    this.retentionMenu = page.getByRole('link', { name: 'Retention' });
    // Recycle Bin Menu
    this.RecycleBinMenu = page.getByRole('link', { name: 'Recycle Bin' });
    // Crime Map Menu
    this.crimeMapMenu = page.getByRole('link', { name: 'Crime Map' });
    // Access Control Menu
    this.accessControlMenu = page.getByRole('link', { name: 'Access Control' });
    this.usersMenu = page.getByRole('link', { name: 'Users' });
    this.rolesMenu = page.getByRole('link', { name: 'Roles' });
    this.groupsMenu = page.getByRole('link', { name: 'Groups' });
    this.permissionsMenu = page.getByRole('link', { name: 'Permissions' });
    // Settings Menu
    this.settingsMenu = page.getByRole('link', { name: 'Settings' });
    this.ganeralMenu = page.getByRole('link', { name: 'General' });
    this.databaseMenu = page.getByRole('link', { name: 'Database' });
    this.storageMenu = page.getByRole('link', { name: 'Storage' });
    this.connectionMenu = page.getByRole('link', { name: 'Connection' });
    this.webappMenu = page.getByRole('link', { name: 'Web App' });
    this.emailMenu = page.getByRole('link', { name: 'Email' });
    this.servicesMenu = page.getByRole('link', { name: 'Service' });
    this.classificationsMenu = page.getByRole('link', { name: 'Classifications' });
    this.licenseMenu = page.getByRole('link', { name: 'License' });
    // Security Menu
    this.securityMenu = page.getByRole('link', { name: 'Security' });
    this.sessionsMenu = page.getByRole('link', { name: 'Sessions' });
    this.ActivityLogsMenu = page.getByRole('link', { name: 'Activity Logs' });
    this.verifyFilesMenu = page.getByRole('link', { name: 'Verify Files' });
    // Maintenance Menu
    this.maintenanceMenu = page.getByRole('link', { name: 'Maintenance' });
    // Analytics Menu
    this.analyticsMenu = page.getByRole('link', { name: 'Analytics' });
    // Help Menu
    this.helpMenu = page.getByRole('link', { name: 'Help' });
    this.videoTutorialsMenu = page.getByRole('link', { name: 'Video Tutorials' });
    this.submitTicketMenu = page.getByRole('link', { name: 'Submit a Ticket' });
    this.feedbackMenu = page.getByRole('link', { name: 'Feedback' });
    // Downloads Menu
    this.downloadsMenu = page.getByRole('link', { name: 'Downloads' });
    // About Menu
    this.aboutMenu = page.getByRole('link', { name: 'About us' });
  }

  // ---- Sidebar Navigation Methods ----

  // Utility: safe regex
  escapeRegex(text: string) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  async dashboardVisible() {
    await this.page.waitForLoadState("networkidle");
    try {
      await expect(this.dashboardMenu).toBeVisible({ timeout: 3000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async clickDashboardMenu() {
    await this.dashboardMenu.click();
  }
  // Files Menu
  async clickFilesMenu() {
    await this.filesMenu.click();
  }
  // Submenus under Files
  async clickMyCasesMenu() {
    await this.myCasesMenu.click();
  }
  async clickMyFavoritesMenu() {
    await this.myFavoritesMenu.click();
  }
  async clickMyBookmarksMenu() {
    await this.myBookmarksMenu.click();
  }
  async clickMyPhotosMenu() {
    await this.myPhotosMenu.click();
  }
  async clickMyVideosMenu() {
    await this.myVideosMenu.click();
  }
  async clickMyAudioMenu() {
    await this.myAudioMenu.click();
  }
  async clickMyDocumentsMenu() {
    await this.myDocumentsMenu.click();
  }
  async clickAllFilesMenu() {
    await this.allFilesMenu.click();
  }
  async clickSharedFilesMenu() {
    await this.sharedFilesMenu.click();
  }
  // Cameras Menu
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

  // Function to click all locators separated by parent menu
  async clickAllLocatorsByParentMenu(parentMenuName: string) {
    const menuMap: Record<string, Locator[]> = {
      Files: [
        this.myCasesMenu,
        this.myFavoritesMenu,
        this.myBookmarksMenu,
        this.myPhotosMenu,
        this.myVideosMenu,
        this.myAudioMenu,
        this.myDocumentsMenu,
        this.allFilesMenu,
        this.sharedFilesMenu,
      ],
      "Access Control": [
        this.usersMenu,
        this.rolesMenu,
        this.groupsMenu,
        this.permissionsMenu,
      ],
      Settings: [
        this.ganeralMenu,
        this.databaseMenu,
        this.storageMenu,
        this.connectionMenu,
        this.webappMenu,
        this.emailMenu,
        this.servicesMenu,
        this.classificationsMenu,
        this.licenseMenu,
      ],
      Security: [
        this.sessionsMenu,
        this.ActivityLogsMenu,
        this.verifyFilesMenu,
      ],
      Help: [this.videoTutorialsMenu, this.submitTicketMenu, this.feedbackMenu],
    };

    const locatorsToClick = menuMap[parentMenuName];
    if (!locatorsToClick) {
      throw new Error(
        `Parent menu "${parentMenuName}" not found. Available menus: ${Object.keys(menuMap).join(", ")}`,
      );
    }

    for (const locator of locatorsToClick) {
      await locator.click();
    }
  }
}

export { SideNavigationBar };
