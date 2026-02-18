import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { SideNavigationBar } from "../pages/SideNavigationBar";
import * as dotenv from "dotenv";
import accountBaseData from "../data/account_base.json";

dotenv.config();

// ---- Data ----
const BASE = process.env.BASE_URL_STAGING || "http://192.168.1.252";

// All available menus in the system
const allMenus = [
  "Dashboard",
  "Files",
  "Cameras",
  "Asset Archive",
  "Retention",
  "Recycle Bin",
  "Crime Map",
  "Access Control",
  "Settings",
  "Security",
  "Maintenance",
  "Analytics",
  "Help",
  "Downloads",
  "About us",
];

// ---- Helper Functions ----

/**
 * Get user details from account_base.json
 */
function getUserByUsername(username: string) {
  return accountBaseData.users.find((user) => user.username === username);
}

/**
 * Get group details from account_base.json
 */
function getGroupByName(groupName: string) {
  return accountBaseData.groups.find((group) => group.name === groupName);
}

/**
 * Check if a menu item is visible on the page
 */
async function isMenuVisible(
  sideNav: SideNavigationBar,
  menuName: string,
): Promise<boolean> {
 
  const locator = sideNav.page
    .locator(`li.menu-item:has-text("${menuName}")`)
    .first();

  try {
    await expect(locator).toBeVisible({ timeout: 3000 });
    return true;
  } catch (e) {
    if (!sideNav.page.isClosed()) {
      await sideNav.page.screenshot({ path: `debug-menu-${menuName}.png` }).catch(() => {});
    }
   
    return false;
  }
}

// ---- Tests ----

test.beforeAll(() => {
  if (!BASE) throw new Error("BASE_URL_STAGING not defined.");
});

test.describe("Menu Access Control - Based on account_base.json", () => {
  accountBaseData.users.forEach((user) => {
    test.describe(`User: ${user.username} (${user.role})`, () => {
      const userGroup = getGroupByName(user.group);
      const accessibleMenus = userGroup ? userGroup.permission.modules : [];

      test(`TC_MenuAccess_${user.id}_01: Should login as ${user.username}`, async ({
        page,
      }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.fillUsername(user.username);
        await loginPage.fillPassword(user.password);
        await loginPage.clickSignIn();

        // Wait for dashboard to load, indicating successful login
        await expect(page).toHaveURL(/.*dashboard/i);
      });

      test(`TC_MenuAccess_${user.id}_02: ${user.username} - Should have access to all assigned menus`, async ({
        page,
      }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.fillUsername(user.username);
        await loginPage.fillPassword(user.password);
        await loginPage.clickSignIn();

        await expect(page).toHaveURL(/.*dashboard/i);

        const sideNav = new SideNavigationBar(page);
        await sideNav.page.waitForLoadState("networkidle");
        await sideNav.page.waitForTimeout(1000);

        //Verify each accessible menu is visible (only check sidebar menus)
        for (const menuName of accessibleMenus) {
          const isVisible = await isMenuVisible(sideNav, menuName);
          expect(isVisible, `Menu "${menuName}" should be visible`).toBe(true);
        }
      });

      test(`TC_MenuAccess_${user.id}_03: ${user.username} - Should NOT have access to unauthorized menus`, async ({
        page,
      }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.fillUsername(user.username);
        await loginPage.fillPassword(user.password);
        await loginPage.clickSignIn();

        await expect(page).toHaveURL(/.*dashboard/i);

        const sideNav = new SideNavigationBar(page);
        await sideNav.page.waitForLoadState("networkidle");
        await sideNav.page.waitForTimeout(1000);

        // Verify unauthorized menus are NOT visible (only check sidebar menus)
        const unauthorizedMenus = allMenus.filter(
          (menu) => !accessibleMenus.includes(menu),
        );

        // Verify unauthorized menus are NOT visible (only check sidebar menus)
        for (const menuName of unauthorizedMenus) {
          const isVisible = await isMenuVisible(sideNav, menuName);
          expect(isVisible, `Menu "${menuName}" should be hidden`).toBe(false);
        }
      });

      test(`TC_MenuAccess_${user.id}_04: ${user.username} - Menu list should match group permissions`, async ({
        page,
      }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.fillUsername(user.username);
        await loginPage.fillPassword(user.password);
        await loginPage.clickSignIn();

        await expect(page).toHaveURL(/.*dashboard/i);

        // Verify group information
        expect(userGroup).toBeDefined();
        expect(userGroup?.name).toBe(user.group);
        expect(userGroup?.permission.modules).toEqual(
          expect.arrayContaining(accessibleMenus),
        );
      });
    });
  });

  test.describe("Group Permission Validation", () => {
    test("TC_GroupPerm_01: Device Automate test - Should have Dashboard Files Help and About us", () => {
      const group = getGroupByName("Device Automate test");
      expect(group?.permission.modules).toEqual(["Dashboard", "Files", "Help", "About us"]);
    });

    test("TC_GroupPerm_02: Department Automate test - Should have 9 modules", () => {
      const group = getGroupByName("Department Automate test");
      expect(group?.permission.modules).toHaveLength(9);
      expect(group?.permission.modules).toEqual(
        expect.arrayContaining([
          "Files",
          "Cameras",
          "Asset Archive",
          "Recycle Bin",
          "Retention",
          "Help",
          "Crime Map",
          "About us",
        ]),
      );
    });

    test("TC_GroupPerm_03: System Admin AutomateTest - Should have all permission modules", () => {
      const group = getGroupByName("System Admin AutomateTest");
      expect(group?.permission.modules).toHaveLength(allMenus.length);
      expect(group?.permission.modules).toContain("Access Control");
      expect(group?.permission.modules).toContain("Settings");
      expect(group?.permission.modules).toContain("Security");
    });
  });

  test.describe("User Role Validation", () => {
    test("TC_Role_01: AdminAutoTest user should exist with correct credentials", () => {
      const user = getUserByUsername("AdminAutoTest");
      expect(user).toBeDefined();
      expect(user?.role).toBe("AdminAutoTest");
      expect(user?.email).toBe("adminautotest@wolfcomglobal.com");
    });

    test("TC_Role_02: UserAutoTest user should exist with correct credentials", () => {
      const user = getUserByUsername("UserAutoTest");
      expect(user).toBeDefined();
      expect(user?.role).toBe("UserAutoTest");
      expect(user?.email).toBe("userautotest@wolfcomglobal.com");
    });

    test("TC_Role_03: DeviceAutoTest user should exist with correct credentials", () => {
      const user = getUserByUsername("DeviceAutoTest");
      expect(user).toBeDefined();
      expect(user?.role).toBe("DeviceAutoTest");
      expect(user?.email).toBe("DeviceAutoTest@wolfcomglobal.com");
    });
  });

  test.describe("Cross-Group Permission Comparison", () => {
    test("TC_CompPerm_01: Admin should have more access than User", () => {
      const adminGroup = getGroupByName("System Admin AutomateTest");
      const userGroup = getGroupByName("Department Automate test");

      expect(adminGroup!.permission.modules.length).toBeGreaterThan(
        userGroup!.permission.modules.length,
      );
    });

    test("TC_CompPerm_02: User should have more access than Device", () => {
      const userGroup = getGroupByName("Department Automate test");
      const deviceGroup = getGroupByName("Device Automate test");

      expect(userGroup!.permission.modules.length).toBeGreaterThan(
        deviceGroup!.permission.modules.length,
      );
    });

    test("TC_CompPerm_03: All groups should have access to 'Files' and 'Help'", () => {
      const groups = accountBaseData.groups;
      groups.forEach((group) => {
        expect(group.permission.modules).toContain("Files");
        expect(group.permission.modules).toContain("Help");
      });
    });
  });
});
