# WEMS3 Automate Test — Project Structure Guide

> คู่มืออธิบายโครงสร้างโปรเจคสำหรับทีม QA และผู้ที่ต้องการเข้าใจภาพรวมของระบบ Automated Testing

---

## Tech Stack

| ส่วนประกอบ | เวอร์ชัน | หน้าที่ |
|---|---|---|
| [Playwright](https://playwright.dev/) | 1.58.0 | Web testing framework |
| TypeScript | 5.9.3 | ภาษาที่ใช้เขียน test |
| Node.js | 16+ | Runtime |
| dotenv | 17.2.3 | จัดการ environment variables |
| xlsx | 0.18.5 | อ่าน/เขียนไฟล์ Excel |

---

## โครงสร้าง Folder

```
wems3_automate_test/
│
├── tests/                          # Test spec files (จุดศูนย์กลางของ test cases)
│   ├── login.spec.ts               # ทดสอบ login (12 TC)
│   ├── dashboard.spec.ts           # ทดสอบ dashboard (5 TC)
│   ├── topNavigationBar.spec.ts    # ทดสอบ top nav bar (21 TC)
│   ├── advancedMenuAccessControl.spec.ts # ทดสอบ advanced search & menu (21 TC)
│   ├── menuAccessControl.spec.ts   # ทดสอบ menu access (13 TC)
│   ├── footerNavigationBar.spec.ts # ทดสอบ footer nav (1 TC)
│   └── Files/
│       └── myCasesPage.spec.ts     # ทดสอบ My Cases (20 TC)
│
├── pages/                          # Page Object Models (POM)
│   ├── LoginPage.ts                # UI elements และ actions ของหน้า Login
│   ├── DashboardPage.ts            # UI elements ของหน้า Dashboard
│   ├── TopNavigationBar.ts         # Top navigation bar elements
│   ├── SideNavigationBar.ts        # Side navigation elements
│   ├── FooterNavigationBar.ts      # Footer elements
│   ├── FilesMenu/
│   │   └── MyCasesPage.ts          # My Cases page (100+ locators)
│   └── components/
│       └── caseCard.ts             # Reusable case card component
│
├── data/                           # Test data
│   ├── account_base.json           # Test user accounts
│   ├── account_base.md             # อธิบาย test accounts
│   ├── footer_links.json           # Footer link data
│   └── files/                      # ไฟล์สำหรับ upload testing
│       ├── audios/                 # ไฟล์เสียงตัวอย่าง
│       ├── images/                 # รูปภาพตัวอย่าง
│       ├── videos/                 # วิดีโอตัวอย่าง
│       ├── document/               # เอกสารตัวอย่าง
│       ├── corrupted/              # ไฟล์เสียหาย (negative test)
│       ├── oversize/               # ไฟล์ขนาดเกิน (negative test)
│       └── invalidFilesType/       # ไฟล์ประเภทไม่ถูกต้อง (negative test)
│
├── utils/                          # Utility / Helper functions
│   ├── uploadMultiple.ts           # Helper สำหรับ upload ไฟล์หลายรูปแบบ
│   ├── AccountDataHelper.ts        # จัดการ test account data
│   ├── consoleErrors.ts            # ตรวจ browser console errors
│   └── escapeRegax.ts              # Escape regex special characters
│
├── document/                       # เอกสารโปรเจค
│   ├── PROJECT_STRUCTURE_GUIDE.md  # ไฟล์นี้
│   ├── TEST_PLAN.md                # แผนการทดสอบ
│   ├── FEATURE_COVERAGE_MATRIX.md  # ตาราง feature coverage
│   ├── PROGRESS_REPORT_TEMPLATE.md # Template รายงานความคืบหน้า
│   └── feature_MyCases_checklist.md # Living checklist สำหรับ My Cases
│
├── playwright-report/              # HTML report (auto-generated)
│   └── index.html                  # เปิดเพื่อดูผลการทดสอบ
│
├── test-results/                   # Test artifacts (auto-generated)
│   ├── junit.xml                   # JUnit XML สำหรับ CI/CD
│   └── [test-name]/                # Screenshots / Videos เมื่อ test fail
│
├── .env                            # Environment variables (ไม่ commit ใน git)
├── playwright.config.ts            # Playwright configuration
├── package.json                    # Dependencies และ npm scripts
└── tsconfig.json                   # TypeScript configuration
```

---

## Design Pattern: Page Object Model (POM)

โปรเจคนี้ใช้ **Page Object Model** เพื่อแยก UI logic ออกจาก test logic

```
Test Spec (tests/)          Page Object (pages/)        Application
      │                            │                          │
      │── page.doSomething() ──►  │── locator + action ──►  │── UI interaction
      │                            │                          │
      │◄── result ────────────────│◄── return value ─────────│
```

**ข้อดี:** เมื่อ UI เปลี่ยน แก้ไขแค่ `pages/` ไม่ต้องแก้ทุก test

---

## วิธี Run Tests

### ติดตั้ง (ครั้งแรก)

```bash
npm install
npx playwright install chromium
```

### ตั้งค่า Environment

สร้างไฟล์ `.env` ใน root folder:

```env
BASE_URL_STAGING=http://192.168.1.252
TEST_USERNAME=wolfcom
TEST_PASSWORD=Wolfcom_5910
TEST_INVALID_USERNAME=invalid_user
TEST_INVALID_PASSWORD=invalid_pass
TEST_EMAIL=test@example.com
```

### คำสั่ง Run

| คำสั่ง | ผลลัพธ์ |
|---|---|
| `npm test` | Run ทุก test (headless) |
| `npm run test:headed` | Run พร้อมเปิด browser ให้เห็น |
| `npm run test:debug` | Debug mode + Playwright Inspector |
| `npx playwright test login.spec.ts` | Run เฉพาะ login tests |
| `npx playwright test --grep "TC_LoginBasic"` | Run เฉพาะ test ที่ตรง keyword |

### ดู Report

```bash
npx playwright show-report
```

เปิด browser อัตโนมัติที่ `http://localhost:9323` แสดงผลทุก test พร้อม screenshot/video

---

## วิธีเพิ่ม Test Case ใหม่

1. **เพิ่ม locator** ใน `pages/[FeaturePage].ts` หากต้องการ element ใหม่
2. **สร้าง test** ใน `tests/[feature].spec.ts` โดยใช้ชื่อตามรูปแบบ:
   ```typescript
   test("TC_[FeatureName]_[Number]: [คำอธิบาย]", async ({ page }) => {
     // arrange
     // act
     // assert
   });
   ```
3. **เพิ่ม test data** ใน `data/` หากจำเป็น
4. **อัปเดต** `FEATURE_COVERAGE_MATRIX.md` เพื่อ track coverage

---

## Naming Convention

| ประเภท | รูปแบบ | ตัวอย่าง |
|---|---|---|
| Test case | `TC_[Feature]_[NN]: [คำอธิบาย]` | `TC_LoginBasic_01: empty username` |
| Spec file | `[feature].spec.ts` | `topNavigationBar.spec.ts` |
| Page class | `[Feature]Page.ts` | `MyCasesPage.ts` |
| Locator | `camelCase` | `btnCreateCase`, `inputSearchKeyword` |

---

## CI/CD Integration

- **JUnit XML:** `test-results/junit.xml` — ใช้กับ CI tools (Jenkins, GitLab CI)
- **HTML Report:** `playwright-report/index.html` — ดูด้วย browser
- **GitHub Workflow:** `.github/workflows/playwright.yml` (ปัจจุบัน disabled)
- **Artifacts:** Screenshots + Videos บันทึกเฉพาะเมื่อ test fail
