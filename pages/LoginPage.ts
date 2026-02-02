//Page Object for the Login page. Centralizes selectors and common actions.
import * as dotenv from "dotenv";
dotenv.config();

import { Page, Locator } from "@playwright/test";

class LoginPage {
  page: Page;
  usernameInput: Locator;
  usernamePlaceholder: string;
  passwordInput: Locator;
  passwordPlaceholder: string;
  loginButton: Locator;
  dashboardHeader: Locator;
  toastRegion: Locator;
  toastMessageInvalidUser: Locator;
  brandingLogo: Locator;
  signInHeading: Locator;
  forgotPasswordHeading: Locator;
  forgotPasswordLink: Locator;
  backToLoginLink: Locator;
  btnRequstPassword: Locator;
  toastMessageResetPassword: Locator;
  emailAddressInput: Locator;
  emailAddressPlaceholder: string;

  constructor(page: Page) {
    this.page = page;

    // Username Input Selector - Type: email, min-length: 4, max-length: 50, required
    this.usernameInput = page.locator('input[id="username"][type="email"]');
    this.usernamePlaceholder = "Username or Email";

    // Email Address Input Selector - Type: text, pattern: email, required
    this.emailAddressInput = page.locator('input[id="emailAddress"][type="text"]');
    this.emailAddressPlaceholder = "Email address";

    // Password Input Selector - Type: password, min-length: 4, max-length: 50, required
    this.passwordInput = page.locator('input[id="password"][type="password"]');
    this.passwordPlaceholder = "Password";

    this.loginButton = page.getByRole("button", { name: "Sign In" });

    // Dashboard unique element to verify successful login
    this.dashboardHeader = page.getByRole("link", { name: /Dashboard/ }).first();

    // Toast notification selector
    this.toastRegion = page.locator("#toast-container");
    this.toastMessageInvalidUser = this.toastRegion.getByText(
      "Please specify username and password!",
    );
    this.toastMessageInvalidUser = this.toastRegion.getByText(
      "Incorrect username or password.",
    );
    this.toastMessageResetPassword = this.toastRegion.getByText(
      "Password reset instructions have been successfully sent to email.",
    );

    // Branding and Heading
    this.brandingLogo = page.locator(".wolfcom-wems-logo");
    this.signInHeading = page.getByRole("heading", {
      name: "Sign in to WEMS",
    });
    this.forgotPasswordHeading = page.getByRole("heading", {
      name: "Forgot Password",
    });

    // Forgor password link
    this.forgotPasswordLink = page.getByRole("link", {
      name: "Forgot password?",
    });
    this.btnRequstPassword = page.getByRole("button", {
      name: "Request Password",
    });

    // Back to log in Link
    this.backToLoginLink = page.getByRole("link", { name: "Back to Log in" });
  }

  async goto() {
    await this.page.goto(process.env.BASE_URL || "http://192.168.1.252");
  }

  async fillUsername(value: string) {
    const el = await this._resolve(this.usernameInput);
    await el.fill(value ?? "");
  }

  async fillEmail(value: string) {
    const el = await this._resolve(this.emailAddressInput);
    await el.fill(value ?? "");
  }

  async fillPassword(value: string) {
    const el = await this._resolve(this.passwordInput);
    await el.fill(value ?? "");
  }

  async clickSignIn() {
    const btn = await this._resolve(this.loginButton);
    await btn.click();
  }

  async clickRequestPassword() {
    const btn = await this._resolve(this.btnRequstPassword);
    await btn.click();
  }

  async clickForgotPasswordLink() {
    const link = await this._resolve(this.forgotPasswordLink);
    await link.click();
  }

  async clickBackToLoginLink() {
    const link = await this._resolve(this.backToLoginLink);
    await link.click();
  }

  async login(username: string, password: string) {
    await this.goto();
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickSignIn();
  }

  async expectToast(text: string, opts = { timeout: 5000 }) {
    const toast = await this._resolve(this.toastRegion);
    await toast
      .filter({ hasText: text })
      .waitFor({ state: "visible", timeout: opts.timeout });
  }

  async expectBrandingAndHeading() {
    const logo = await this._resolve(this.brandingLogo);
    const heading = await this._resolve(this.signInHeading);

    await logo.waitFor({ state: "visible", timeout: 5000 });
    await heading.waitFor({ state: "visible", timeout: 5000 });
  }

  async expectedDashboardVisible() {
    // Wait for dashboard header element to appear (increased timeout for parallel test execution)
    await this.dashboardHeader
      .first()
      .waitFor({ state: "visible", timeout: 20000 });
  }

  async checkPlaceholders() {
    const usernameElement = await this._resolve(this.usernameInput);
    const passwordElement = await this._resolve(this.passwordInput);

    const usernamePlaceholderValue =
      await usernameElement.getAttribute("placeholder");
    const passwordPlaceholderValue =
      await passwordElement.getAttribute("placeholder");

    console.log(`Username Placeholder: ${usernamePlaceholderValue}`);
    console.log(`Password Placeholder: ${passwordPlaceholderValue}`);

    if (usernamePlaceholderValue !== this.usernamePlaceholder) {
      throw new Error(
        `Username placeholder mismatch. Expected: "${this.usernamePlaceholder}", Got: "${usernamePlaceholderValue}"`,
      );
    }

    if (passwordPlaceholderValue !== this.passwordPlaceholder) {
      throw new Error(
        `Password placeholder mismatch. Expected: "${this.passwordPlaceholder}", Got: "${passwordPlaceholderValue}"`,
      );
    }

    console.log("✓ Both placeholders are correct!");
  }

  async expectForgotPasswordLinkVisible() {
    const link = await this._resolve(this.forgotPasswordLink);
    await link.waitFor({ state: "visible", timeout: 5000 });
  }

  async expectForgotPasswordHeadingVisible() {
    const heading = await this._resolve(this.forgotPasswordHeading);
    await heading.waitFor({ state: "visible", timeout: 5000 });
  }

  async _resolve(preferred: Locator): Promise<Locator> {
    try {
      await preferred.first().waitFor({ state: "attached", timeout: 20000 });
      return preferred;
    } catch (error) {
      console.warn(
        `Preferred selector not found, falling back. Error: ${error}`,
      );
      throw error;
    }
  }
}

export { LoginPage };
