import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { SideNavigationBar } from "../pages/SideNavigationBar";
import { AccountDataHelper } from "../utils/AccountDataHelper";
import * as dotenv from "dotenv";

dotenv.config();

// ---- Data ----
const BASE = process.env.BASE_URL_STAGING || "http://192.168.1.252";

// All available menus in the system
const ALL_MENUS = [
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

test.describe("Advanced Menu Access Control - Using AccountDataHelper", () => {
  const users = AccountDataHelper.getAllUsers();

  test.describe("Individual User Menu Access Tests", () => {
    users.forEach((user) => {
      test(`${user.username}: Login and verify menu visibility`, async ({
        page,
      }) => {
        const loginPage = new LoginPage(page);
        const fullUserDetails = AccountDataHelper.getFullUserDetails(
          user.username
        );

        // Login
        await loginPage.goto();
        await loginPage.fillUsername(user.username);
        await loginPage.fillPassword(user.password);
        await loginPage.clickSignIn();
        await expect(page).toHaveURL(/.*dashboard/i);

        const sideNav = new SideNavigationBar(page);

        // Get accessible menus for this user
        const accessibleMenus = fullUserDetails?.accessibleMenus || [];
        const inaccessibleMenus = ALL_MENUS.filter(
          (menu) => !accessibleMenus.includes(menu)
        );

        // Verify accessible menus are visible
        for (const menu of accessibleMenus) {
          const visible = await isMenuVisible(sideNav, menu);
          expect(visible).toBe(true);
        }

        // Verify inaccessible menus are not visible
        for (const menu of inaccessibleMenus) {
          const visible = await isMenuVisible(sideNav, menu);
          expect(visible).toBe(false);
        }
      });
    });
  });

  test.describe("User Role and Group Verification", () => {
    users.forEach((user) => {
      test(`${user.username}: Verify role and group assignment`, () => {
        const userDetails = AccountDataHelper.getFullUserDetails(
          user.username
        );

        // Verify role
        expect(userDetails?.role).toBe(user.role);
        expect(userDetails?.roleDetails).toBeDefined();

        // Verify group
        expect(userDetails?.group).toBe(user.group);
        expect(userDetails?.groupDetails).toBeDefined();

        // Verify group has menu permissions
        expect(userDetails?.groupDetails?.permission.modules).toBeDefined();
        expect(Array.isArray(userDetails?.groupDetails?.permission.modules)).toBe(
          true
        );
      });
    });
  });

  test.describe("Cross-User Permission Comparison", () => {
    test("Compare AdminAutoTest vs UserAutoTest permissions", () => {
      const comparison = AccountDataHelper.compareUserPermissions(
        "AdminAutoTest",
        "UserAutoTest"
      );

      expect(comparison.commonMenus).toBeDefined();
      expect(comparison.onlyUser1.length).toBeGreaterThan(0); // Admin has exclusive menus
      expect(comparison.onlyUser2.length).toEqual(0); // User doesn't have menus Admin doesn't have
    });

    test("Compare UserAutoTest vs DeviceAutoTest permissions", () => {
      const comparison = AccountDataHelper.compareUserPermissions(
        "UserAutoTest",
        "DeviceAutoTest"
      );

      expect(comparison.commonMenus).toContain("Files");
      expect(comparison.commonMenus).toContain("Help");
      expect(comparison.onlyUser1.length).toBeGreaterThan(0);
      expect(comparison.onlyUser2.length).toEqual(0);
    });
  });

  test.describe("Group-Level Permission Tests", () => {
    const groups = AccountDataHelper.getAllGroups();

    test("Each group should have defined modules", () => {
      groups.forEach((group) => {
        expect(group.permission.modules).toBeDefined();
        expect(Array.isArray(group.permission.modules)).toBe(true);
        expect(group.permission.modules.length).toBeGreaterThan(0);
      });
    });

    test("Group hierarchy: Admin > Department > Device", () => {
      const adminModules = AccountDataHelper.getAccessibleMenusForGroup(
        "System Admin AutomateTest"
      ).length;
      const deptModules = AccountDataHelper.getAccessibleMenusForGroup(
        "Department Automate test"
      ).length;
      const deviceModules = AccountDataHelper.getAccessibleMenusForGroup(
        "Device Automate test"
      ).length;

      expect(adminModules).toBeGreaterThan(deptModules);
      expect(deptModules).toBeGreaterThan(deviceModules);
    });

    test("All groups should have Files and Help modules", () => {
      groups.forEach((group) => {
        expect(group.permission.modules).toContain("Files");
        expect(group.permission.modules).toContain("Help");
      });
    });
  });

  test.describe("User Access Pattern Tests", () => {
    test("AdminAutoTest should have access to all System Admin modules", () => {
      const adminMenus = AccountDataHelper.getAccessibleMenusForUser(
        "AdminAutoTest"
      );
      const requiredMenus = [
        "Access Control",
        "Settings",
        "Security",
        "Maintenance",
        "Analytics",
      ];

      requiredMenus.forEach((menu) => {
        expect(adminMenus).toContain(menu);
      });
    });

    test("DeviceAutoTest should have limited access (Dashdoard, Files, Help and About us only)", () => {
      const deviceMenus = AccountDataHelper.getAccessibleMenusForUser(
        "DeviceAutoTest"
      );

      expect(deviceMenus).toEqual(
        expect.arrayContaining(["Dashboard", "Files", "Help", "About us"])
      );
      expect(deviceMenus.length).toBe(4);
    });

    test("UserAutoTest should have department-level access", () => {
      const userMenus = AccountDataHelper.getAccessibleMenusForUser(
        "UserAutoTest"
      );

      expect(userMenus).toContain("Cameras");
      expect(userMenus).toContain("Asset Archive");
      expect(userMenus).not.toContain("Access Control");
      expect(userMenus).not.toContain("Settings");
    });
  });

  test.describe("Account Base Data Integrity", () => {
    test("Should have exactly 3 users in test data", () => {
      const users = AccountDataHelper.getAllUsers();
      expect(users).toHaveLength(3);
    });

    test("Should have exactly 3 groups in test data", () => {
      const groups = AccountDataHelper.getAllGroups();
      expect(groups).toHaveLength(3);
    });

    test("Should have exactly 3 roles in test data", () => {
      const roles = AccountDataHelper.getAllRoles();
      expect(roles).toHaveLength(3);
    });

    test("Each user should be assigned to a valid group", () => {
      const users = AccountDataHelper.getAllUsers();
      const groups = AccountDataHelper.getAllGroups();
      const groupNames = groups.map((g) => g.name);

      users.forEach((user) => {
        expect(groupNames).toContain(user.group);
      });
    });

    test("Each user should have a valid role", () => {
      const users = AccountDataHelper.getAllUsers();
      const roles = AccountDataHelper.getAllRoles();
      const roleNames = roles.map((r) => r.name);

      users.forEach((user) => {
        expect(roleNames).toContain(user.role);
      });
    });
  });

  test.describe("Account Data Helper Functions", () => {
    test("getUserByUsername should return correct user", () => {
      const user = AccountDataHelper.getUserByUsername("AdminAutoTest");
      expect(user?.email).toBe("adminautotest@wolfcomglobal.com");
      expect(user?.role).toBe("AdminAutoTest");
    });

    test("getUserById should return correct user", () => {
      const user = AccountDataHelper.getUserById("User1");
      expect(user?.username).toBe("AdminAutoTest");
    });

    test("getGroupByName should return correct group", () => {
      const group = AccountDataHelper.getGroupByName(
        "System Admin AutomateTest"
      );
      expect(group?.permission.modules).toContain("Access Control");
    });

    test("getFullUserDetails should include all user information", () => {
      const userDetails = AccountDataHelper.getFullUserDetails("AdminAutoTest");
      expect(userDetails?.username).toBe("AdminAutoTest");
      expect(userDetails?.roleDetails).toBeDefined();
      expect(userDetails?.groupDetails).toBeDefined();
      expect(userDetails?.accessibleMenus).toBeDefined();
    });

    test("getAccountBaseSummary should return statistics", () => {
      const summary = AccountDataHelper.getAccountBaseSummary();
      expect(summary.totalUsers).toBe(3);
      expect(summary.totalGroups).toBe(3);
      expect(summary.totalRoles).toBe(3);
      expect(summary.groupPermissionSummary).toHaveLength(3);
      expect(summary.usersByGroup).toBeDefined();
    });

    test("validateUserCredentials should validate correctly", () => {
      const valid = AccountDataHelper.validateUserCredentials(
        "AdminAutoTest",
        "Wolfcom_5910"
      );
      expect(valid).toBe(true);

      const invalid = AccountDataHelper.validateUserCredentials(
        "AdminAutoTest",
        "WrongPassword"
      );
      expect(invalid).toBe(false);
    });
  });
});
