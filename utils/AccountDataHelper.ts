import accountBaseData from "../data/account_base.json";

/**
 * Helper utility for working with account_base.json data
 */
export class AccountDataHelper {
  /**
   * Get all users from account_base.json
   */
  static getAllUsers() {
    return accountBaseData.users;
  }

  /**
   * Get all groups from account_base.json
   */
  static getAllGroups() {
    return accountBaseData.groups;
  }

  /**
   * Get all roles from account_base.json
   */
  static getAllRoles() {
    return accountBaseData.roles;
  }

  /**
   * Get user by username
   */
  static getUserByUsername(username: string) {
    return accountBaseData.users.find((user) => user.username === username);
  }

  /**
   * Get user by ID
   */
  static getUserById(id: string) {
    return accountBaseData.users.find((user) => user.id === id);
  }

  /**
   * Get group by name
   */
  static getGroupByName(groupName: string) {
    return accountBaseData.groups.find((group) => group.name === groupName);
  }

  /**
   * Get role by name
   */
  static getRoleByName(roleName: string) {
    return accountBaseData.roles.find((role) => role.name === roleName);
  }

  /**
   * Get accessible menus for a user
   */
  static getAccessibleMenusForUser(username: string) {
    const user = this.getUserByUsername(username);
    if (!user) return [];

    const group = this.getGroupByName(user.group);
    return group ? group.permission.modules : [];
  }

  /**
   * Get accessible menus for a group
   */
  static getAccessibleMenusForGroup(groupName: string) {
    const group = this.getGroupByName(groupName);
    return group ? group.permission.modules : [];
  }

  /**
   * Check if user has access to a specific menu
   */
  static userHasMenuAccess(username: string, menuName: string): boolean {
    const accessibleMenus = this.getAccessibleMenusForUser(username);
    return accessibleMenus.includes(menuName);
  }

  /**
   * Get all users with a specific role
   */
  static getUsersByRole(roleName: string) {
    return accountBaseData.users.filter((user) => user.role === roleName);
  }

  /**
   * Get all users in a specific group
   */
  static getUsersByGroup(groupName: string) {
    return accountBaseData.users.filter((user) => user.group === groupName);
  }

  /**
   * Get menus that are NOT accessible to a user
   */
  static getInaccessibleMenusForUser(username: string, allMenus: string[]) {
    const accessibleMenus = this.getAccessibleMenusForUser(username);
    return allMenus.filter((menu) => !accessibleMenus.includes(menu));
  }

  /**
   * Validate user credentials exist in account base
   */
  static validateUserCredentials(
    username: string,
    password: string
  ): boolean {
    const user = this.getUserByUsername(username);
    return user ? user.password === password : false;
  }

  /**
   * Get user details with full group and role information
   */
  static getFullUserDetails(username: string) {
    const user = this.getUserByUsername(username);
    if (!user) return null;

    const group = this.getGroupByName(user.group);
    const role = this.getRoleByName(user.role);

    return {
      ...user,
      groupDetails: group,
      roleDetails: role,
      accessibleMenus: group ? group.permission.modules : [],
    };
  }

  /**
   * Compare permissions between two users
   */
  static compareUserPermissions(username1: string, username2: string) {
    const menus1 = new Set(this.getAccessibleMenusForUser(username1));
    const menus2 = new Set(this.getAccessibleMenusForUser(username2));

    return {
      user1: username1,
      user2: username2,
      commonMenus: Array.from(menus1).filter((menu) => menus2.has(menu)),
      onlyUser1: Array.from(menus1).filter((menu) => !menus2.has(menu)),
      onlyUser2: Array.from(menus2).filter((menu) => !menus1.has(menu)),
    };
  }

  /**
   * Get summary statistics of the account base
   */
  static getAccountBaseSummary() {
    return {
      totalUsers: accountBaseData.users.length,
      totalGroups: accountBaseData.groups.length,
      totalRoles: accountBaseData.roles.length,
      groupPermissionSummary: accountBaseData.groups.map((group) => ({
        name: group.name,
        moduleCount: group.permission.modules.length,
        modules: group.permission.modules,
      })),
      usersByGroup: this.getAllUsers().reduce(
        (acc, user) => {
          if (!acc[user.group]) {
            acc[user.group] = [];
          }
          acc[user.group].push(user.username);
          return acc;
        },
        {} as Record<string, string[]>
      ),
    };
  }
}
