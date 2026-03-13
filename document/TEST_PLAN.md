# Test Plan — WEMS3 Automated Testing

**Project:** WEMS 3.0 (Wolfcom Evidence Management System)
**Version:** 1.0
**Prepared by:** QA Team — Thaweesin Saengprasit
**Date:** 2026-03-13
**Branch:** QA/Tester-Thaweesin

---

## 1. Project Overview

WEMS 3.0 เป็นระบบจัดการหลักฐาน (Evidence Management System) ของ Wolfcom ใช้งานผ่าน Web Browser โปรเจคนี้มีจุดประสงค์เพื่อสร้างชุด Automated Test ครอบคลุม features หลักของระบบ เพื่อลดเวลาการทดสอบ Manual และเพิ่มความมั่นใจในคุณภาพของซอฟต์แวร์

**Tech Stack ของ Test Project:**
- Framework: Playwright 1.58.0
- Language: TypeScript 5.9.3
- Pattern: Page Object Model (POM)

---

## 2. Objectives

1. **ตรวจสอบ Functionality** — ระบบทำงานถูกต้องตาม requirement
2. **ตรวจสอบ UI** — elements แสดงผลครบและถูกต้อง
3. **ตรวจสอบ Security** — ป้องกัน XSS, SQL Injection ที่ login
4. **Regression Testing** — มั่นใจว่า feature เดิมไม่ถูก break เมื่อมี update ใหม่
5. **สร้าง Automated Test Suite** — ลด manual testing effort ในอนาคต

---

## 3. Test Scope

### 3.1 อยู่ใน Scope (In Scope)

| Feature Area | ระดับ Priority |
|---|---|
| Authentication (Login / Logout) | High |
| Dashboard widgets | Medium |
| Top Navigation Bar | Medium |
| Side Navigation & Menu Access | Medium |
| Footer Navigation | Low |
| My Cases — Case CRUD | High |
| My Cases — Case Notes CRUD | High |
| My Cases — File Upload / Download / Delete | High |
| My Cases — Metadata Management | Medium |
| Advanced Search & Filters | Medium |

### 3.2 ไม่อยู่ใน Scope ปัจจุบัน (Out of Scope — Phase 2)

| Feature | เหตุผล |
|---|---|
| Case Locking / Unlocking | อยู่ระหว่างพัฒนา |
| Case Sharing & Public Link | อยู่ระหว่างพัฒนา |
| Video Merge | ต้องใช้ test environment พิเศษ |
| ISO Burn | ต้องใช้ SFTP configuration |
| RBAC / Permission testing | รอ user role setup |
| Mobile / Multi-browser | Firefox/Safari planned ใน Phase 2 |

---

## 4. Test Environment

| รายการ | ค่า |
|---|---|
| Test URL | `http://192.168.1.252` (Staging) |
| Browser | Google Chrome (Desktop) |
| OS | Windows 11 |
| Playwright Mode | Headed (local) / Headless (CI) |
| Parallel Workers | 3 (local), 2 (CI) |
| Timeout per test | 120 วินาที |
| Assertion timeout | 10 วินาที |
| Retries on CI | 2 ครั้ง |

### Test Accounts

| บัญชี | ใช้สำหรับ |
|---|---|
| wolfcom / Wolfcom_5910 | Valid login tests |
| invalid_user | Negative login tests |
| XSS payload | Security tests |
| SQL payload | Security tests |

> ดูรายละเอียด accounts เพิ่มเติมใน `data/account_base.md`

---

## 5. Test Types

| ประเภท | คำอธิบาย | ตัวอย่าง |
|---|---|---|
| **Functional** | ทดสอบว่าระบบทำงานถูกต้อง | Login สำเร็จด้วย valid credentials |
| **Negative** | ทดสอบ error handling | Login ด้วย invalid credentials → เห็น error toast |
| **UI Validation** | ทดสอบ element ปรากฏถูกต้อง | ปุ่ม, ข้อความ, icon แสดงผลครบ |
| **Security** | ทดสอบ input validation | XSS / SQL Injection ถูก sanitize |
| **Edge Case** | ทดสอบกรณีพิเศษ | Whitespace ใน username |
| **Regression** | ทดสอบ feature เดิมหลัง update | Run full suite หลัง deploy |

---

## 6. Test Naming Convention

```
TC_[FeatureName]_[Number]: [คำอธิบายสั้น]
```

**ตัวอย่าง:**
- `TC_LoginBasic_01: empty username & password → toast "Please specify..."`
- `TC_MyCases_Create_01: create case with valid data → success`

---

## 7. Entry & Exit Criteria

### Entry Criteria (เงื่อนไขเริ่มทดสอบ)
- [ ] Application deploy บน staging environment แล้ว
- [ ] Test accounts พร้อมใช้งาน
- [ ] `.env` file ตั้งค่าถูกต้อง
- [ ] Test data files อยู่ใน `data/files/`
- [ ] `npm install` และ `npx playwright install` เสร็จแล้ว

### Exit Criteria (เงื่อนไขสิ้นสุดการทดสอบ)
- [ ] Test cases ทั้งหมดใน scope ถูก execute
- [ ] Pass Rate ≥ 95% สำหรับ P1 (High Priority) tests
- [ ] Bug ระดับ Critical ทั้งหมดได้รับการ fix แล้ว
- [ ] HTML Report สร้างและบันทึกแล้ว

---

## 8. Test Phases & Progress

### Phase 1 — Core Features (ปัจจุบัน)

| Feature | TC | Status | ผู้รับผิดชอบ |
|---|---|---|---|
| Authentication | 12 | ✅ Done | Thaweesin |
| Dashboard | 5 | ✅ Done | Thaweesin |
| Top Navigation | 21 | ✅ Done | Thaweesin |
| Advanced Search | 21 | ✅ Done | Thaweesin |
| Menu Access | 13 | ✅ Done | Thaweesin |
| Footer Nav | 1 | ✅ Done | Thaweesin |
| My Cases (Core) | 20 | 🔄 In Progress | Thaweesin |

**Phase 1 Total:** 93 test cases | **Completion:** ~85%

### Phase 2 — Advanced Features (แผน)

| Feature | TC (ประมาณ) | Status |
|---|---|---|
| Case Locking / Unlocking | 8-10 | 📋 Planned |
| Case Sharing | 10-15 | 📋 Planned |
| Video Merge | 5-8 | 📋 Planned |
| ISO Burn | 5-8 | 📋 Planned |
| RBAC / Permissions | 8-12 | 📋 Planned |
| Multi-browser | - | 📋 Planned |

---

## 9. Defect Management

เมื่อพบ bug จากการ run test:

1. **บันทึก** — ระบุ TC ID, steps to reproduce, actual vs expected
2. **ประเมิน severity:**
   - 🔴 **Critical** — ระบบ crash หรือ data loss
   - 🟠 **High** — Feature ใช้งานไม่ได้
   - 🟡 **Medium** — Feature ทำงานได้แต่มีปัญหาบางส่วน
   - 🟢 **Low** — UI/cosmetic issues

3. **แนบหลักฐาน** — Screenshot/Video จาก `test-results/` folder
4. **รายงาน** ใน Progress Report Template

---

## 10. Deliverables

| รายการ | รูปแบบ | ที่เก็บ |
|---|---|---|
| HTML Test Report | `.html` | `playwright-report/index.html` |
| JUnit XML Report | `.xml` | `test-results/junit.xml` |
| Feature Coverage Matrix | `.md` | `document/FEATURE_COVERAGE_MATRIX.md` |
| Progress Report | `.md` | `document/PROGRESS_REPORT_TEMPLATE.md` |
| Test Screenshots (on fail) | `.png` | `test-results/[test-name]/` |
| Test Videos (on fail) | `.webm` | `test-results/[test-name]/` |

---

## 11. วิธีดู Report

```bash
# Run tests
npm test

# เปิด HTML Report
npx playwright show-report
```

HTML Report แสดง:
- สรุปผล: Passed / Failed / Skipped
- รายละเอียดแต่ละ test case
- Screenshot เมื่อ fail
- Video recording เมื่อ fail
- Trace viewer สำหรับ debug

---

## 12. References

- [document/FEATURE_COVERAGE_MATRIX.md](./FEATURE_COVERAGE_MATRIX.md) — รายละเอียด test coverage
- [document/PROJECT_STRUCTURE_GUIDE.md](./PROJECT_STRUCTURE_GUIDE.md) — โครงสร้างโปรเจค
- [document/feature_MyCases_checklist.md](./feature_MyCases_checklist.md) — Living checklist
- [data/account_base.md](../data/account_base.md) — Test accounts
- [playwright.config.ts](../playwright.config.ts) — Test configuration
