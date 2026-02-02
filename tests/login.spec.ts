import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import * as dotenv from "dotenv";
dotenv.config();

// ---Helper---

const T = {
  EMPTY_BOTH: "Please specify username and password!",
  USER_NOT_FOUND: "User not found!",
  WRONG_PASSWORD: "Incorrect username or password.",
};

// Attemps login and returns whether a modal with given text appeared
async function loginAndDetectModal(
  page: { getByRole: (arg0: string, arg1: { name: any }) => any },
  loginPage: { login: (arg0: any, arg1: any) => any },
  modalRegex: any,
  username: any,
  password: any,
) {
  await loginPage.login(username, password);
  const modal = page.getByRole("dialog", { name: modalRegex });
  try {
    await modal.first().waitFor({ state: "visible", timeout: 3000 });
    return true;
  } catch (error) {
    console.error("Modal wait failed:", error);
    return false;
  }
}

// ---- Data -----
const BASE = process.env.BASE_URL_STAGING || "http://192.168.1.252";
const VALID_USERNAME = process.env.TEST_USERNAME || "wolfcom";
const VALID_PASSWORD = process.env.TEST_PASSWORD || "Wolfcom_5910";
const INVALID_USERNAME = process.env.TEST_INVALID_USERNAME || "invalid_user";
const INVALID_PASSWORD = process.env.TEST_INVALID_PASSWORD || "invalid_pass";
const VALID_EMAIL = process.env.TEST_EMAIL || "thaweesin@wolfcomglobal.com";
const INVALID_EMAIL =
  process.env.TEST_INVALID_EMAIL || "thaweesin@wolfcomglobal";
const XSS_USERNAME =
  process.env.TEST_XXS_USERNAME || '<script>alert("XSS")</script>';
const SQL_INJECTION_USERNAME =
  process.env.TEST_SQL_INJECTION_USERNAME || "' OR '1'='1";
const WHITESPACE_USERNAME =
  process.env.TEST_INVALID_WHITESPACE_USERNAME || "     superjane  ";

// ---- Tests ----

// Guardrails for required env
test.beforeAll(() => {
  if (!BASE) throw new Error("BASE_URL_STAGING not defined.");
  if (!VALID_USERNAME || !VALID_PASSWORD) {
    throw new Error("VALID_USERNAME and VALID_PASSWORD must be provided.");
  }
});

// ----Basic Login----
test.describe("Basic Login", () => {
  test('TC_LoginBasic_01: empty username & password -> toast "Please specify username and password!"', async ({
    page,
  }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.fillUsername("");
    await login.fillPassword("");
    await login.clickSignIn();

    await login.expectToast(T.EMPTY_BOTH);
  });

  test('TC_LoginBasic_02: non-existent username/email -> toast "User not found!"', async ({
    page,
  }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.fillUsername(INVALID_USERNAME);
    await login.fillPassword(VALID_PASSWORD);
    await login.clickSignIn();

    await login.expectToast(T.USER_NOT_FOUND);
  });

  test('TC_LoginBasic_03: wrong password -> toast "Incorrect username or password."', async ({
    page,
  }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.fillUsername(VALID_USERNAME);
    await login.fillPassword(INVALID_PASSWORD);
    await login.clickSignIn();

    await login.expectToast(T.WRONG_PASSWORD);
  });

  test("TC_LoginBasic_04: valid credentials -> login successful -> redirect to dashboard", async ({
    page,
  }) => {
    const login = new LoginPage(page);
    await login.login(VALID_USERNAME, VALID_PASSWORD);
    await login.expectedDashboardVisible();
  });

  test("TC_LoginBasic_05: Leading/trailing whitespace trimmed -> Login success", async ({
    page,
  }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.fillUsername(WHITESPACE_USERNAME);
    await login.fillPassword(VALID_PASSWORD);
    await login.clickSignIn();

    await login.expectedDashboardVisible();
  });
});

// ---- UI & content Integrity ----
test.describe("UI & content Integrity", () => {
  test("Branding and heading render --> Verify WOLFCOM logo/text and “Sign in to WEMS” heading render on first paint.", async ({
    page,
  }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.expectBrandingAndHeading();
  });

  test("Placeholder", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.checkPlaceholders();
  });

  test("Forgot Password Link Visible", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.expectForgotPasswordLinkVisible();
    await login.clickForgotPasswordLink();
    await login.expectForgotPasswordHeadingVisible();
    await login.clickBackToLoginLink();
    await login.expectBrandingAndHeading();
  });

  test("SIGN IN ALWAYs Enable", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    const signInBtn = await login._resolve(login.loginButton);
    const isDisabled = await signInBtn.isDisabled();
    expect(isDisabled).toBeFalsy();
  });
});

test.describe("Forgot password Flow", () => {
  test("Forgot Password Flow", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.expectForgotPasswordLinkVisible();
    await login.clickForgotPasswordLink();
    await login.expectForgotPasswordHeadingVisible();
    await login.fillEmail(VALID_EMAIL);
    await login.clickRequestPassword();
    await login.expectToast(
      "Password reset instructions have been successfully sent to email.",
    );
    await login.clickBackToLoginLink();
    await login.expectBrandingAndHeading();
  });
});

test.describe("Security", () => {
  test("Login with XSS Injecttion", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.fillUsername(XSS_USERNAME);
    await login.fillPassword(VALID_PASSWORD);
    await login.clickSignIn();
    await login.expectToast(T.USER_NOT_FOUND);
  });

  test("Login with SQL Injection", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.fillUsername(SQL_INJECTION_USERNAME);
    await login.fillPassword(VALID_PASSWORD);
    await login.clickSignIn();
    await login.expectToast(T.USER_NOT_FOUND);
  });
});
