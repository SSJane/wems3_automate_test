# WEMS3 — Feature Coverage Matrix

> ตารางนี้แสดงภาพรวมว่า feature ใดของ WEMS3 ได้รับการทดสอบแบบ automated แล้วบ้าง
> อัปเดตล่าสุด: 2026-03-13

---

## สัญลักษณ์

| สัญลักษณ์ | ความหมาย |
|---|---|
| ✅ | Automated แล้ว |
| 🔄 | กำลังดำเนินการ |
| 📋 | วางแผนแล้ว / ยังไม่ได้ทำ |
| ❌ | ไม่อยู่ใน scope |
| ✔️ | Checklist item เสร็จแล้ว |
| ⬜ | Checklist item ยังไม่เสร็จ |

---

## 1. Authentication (Login)

**Test File:** `tests/login.spec.ts` | **Total:** 12 test cases | **Status:** ✅ Done

| # | Test Case ID | คำอธิบาย | ประเภท | Status |
|---|---|---|---|---|
| 1 | TC_LoginBasic_01 | Empty username & password | Negative | ✅ |
| 2 | TC_LoginBasic_02 | Empty username only | Negative | ✅ |
| 3 | TC_LoginBasic_03 | Empty password only | Negative | ✅ |
| 4 | TC_LoginBasic_04 | Invalid username | Negative | ✅ |
| 5 | TC_LoginBasic_05 | Invalid password | Negative | ✅ |
| 6 | TC_LoginBasic_06 | Valid credentials | Positive | ✅ |
| 7 | TC_LoginBasic_07 | Whitespace in username | Edge Case | ✅ |
| 8 | TC_LoginSecurity_01 | XSS injection attempt | Security | ✅ |
| 9 | TC_LoginSecurity_02 | SQL Injection attempt | Security | ✅ |
| 10-12 | TC_LoginUI_01-03 | UI elements & layout validation | UI | ✅ |

---

## 2. Dashboard

**Test File:** `tests/dashboard.spec.ts` | **Total:** 5 test cases | **Status:** ✅ Done

| # | Test Case ID | คำอธิบาย | ประเภท | Status |
|---|---|---|---|---|
| 1 | TC_Dashboard_01 | My Cases widget visible | UI | ✅ |
| 2 | TC_Dashboard_02 | Photos widget visible | UI | ✅ |
| 3 | TC_Dashboard_03 | Videos widget visible | UI | ✅ |
| 4 | TC_Dashboard_04 | All Files widget visible | UI | ✅ |
| 5 | TC_Dashboard_05 | Widget click navigation | Functional | ✅ |

---

## 3. Top Navigation Bar

**Test File:** `tests/topNavigationBar.spec.ts` | **Total:** 21 test cases | **Status:** ✅ Done

| Feature | # TC | Status |
|---|---|---|
| Logo visibility & click | 2 | ✅ |
| Sidebar toggle | 3 | ✅ |
| Search bar interaction | 5 | ✅ |
| User profile menu | 4 | ✅ |
| Notifications | 3 | ✅ |
| Breadcrumb navigation | 4 | ✅ |

---

## 4. Advanced Search & Menu Access Control

**Test File:** `tests/advancedMenuAccessControl.spec.ts` | **Total:** 21 test cases | **Status:** ✅ Done

| Feature | # TC | Status |
|---|---|---|
| Advanced search filters | 8 | ✅ |
| Menu items visibility | 6 | ✅ |
| Access control per role | 4 | ✅ |
| Filter combinations | 3 | ✅ |

---

## 5. Menu Access Control (Standard)

**Test File:** `tests/menuAccessControl.spec.ts` | **Total:** 13 test cases | **Status:** ✅ Done

| Feature | # TC | Status |
|---|---|---|
| Menu navigation | 7 | ✅ |
| Access permission validation | 6 | ✅ |

---

## 6. Footer Navigation Bar

**Test File:** `tests/footerNavigationBar.spec.ts` | **Total:** 1 test case | **Status:** ✅ Done

| Feature | # TC | Status |
|---|---|---|
| Footer links validation | 1 | ✅ |

---

## 7. My Cases — Files & Case Management

**Test File:** `tests/Files/myCasesPage.spec.ts` | **Total:** 20 test cases | **Status:** 🔄 In Progress

### 7.1 Case Actions
| Checklist Item | Automated | Status |
|---|---|---|
| ✔️ Create case (+ validations) | ✅ | Done |
| ✔️ Edit case | ✅ | Done |
| ✔️ Delete case (+ error paths) | ✅ | Done |
| ⬜ Lock / Unlock case + reason prompt | 📋 | Planned |
| ⬜ Change owner | 📋 | Planned |

### 7.2 Case Notes
| Checklist Item | Automated | Status |
|---|---|---|
| ✔️ Add note | ✅ | Done |
| ✔️ Edit note | ✅ | Done |
| ✔️ Delete single note | ✅ | Done |
| ✔️ Delete bulk notes | ✅ | Done |
| ✔️ Print single note | ✅ | Done |
| ✔️ Print Case Report | ✅ | Done |
| ✔️ Sorting, search, pagination | ✅ | Done |

### 7.3 Case Files Operations
| Checklist Item | Automated | Status |
|---|---|---|
| ✔️ Upload valid files | ✅ | Done |
| ✔️ Upload invalid file type | ✅ | Done |
| ✔️ Upload oversize file | ✅ | Done |
| ✔️ Update metadata (single) | ✅ | Done |
| ✔️ Update metadata (bulk) | ✅ | Done |
| ✔️ Download single file | ✅ | Done |
| ✔️ Download multiple (ZIP) | ✅ | Done |
| ✔️ Remove single file | ✅ | Done |
| ✔️ Remove bulk files | ✅ | Done |
| ⬜ Print evidence label preview | 📋 | Planned |
| ⬜ Burn to ISO | 📋 | Planned |
| ⬜ Merge video | 📋 | Planned |

### 7.4 Sharing
| Checklist Item | Automated | Status |
|---|---|---|
| ⬜ Share case to WEMS users | 📋 | Planned |
| ⬜ Public link with options | 📋 | Planned |
| ⬜ Unshare case | 📋 | Planned |
| ⬜ Shared Cases tab | 📋 | Planned |

### 7.5 Permissions / RBAC
| Checklist Item | Automated | Status |
|---|---|---|
| ⬜ Notes buttons per permission | 📋 | Planned |
| ⬜ Restricted access (locked case) | 📋 | Planned |
| ⬜ Full-permission user visibility | 📋 | Planned |

---

## สรุปภาพรวม (Summary)

| Feature Area | Total TC (Automated) | Status | Coverage |
|---|---|---|---|
| Authentication | 12 | ✅ Done | 100% |
| Dashboard | 5 | ✅ Done | 100% |
| Top Navigation Bar | 21 | ✅ Done | 100% |
| Advanced Search | 21 | ✅ Done | 100% |
| Menu Access Control | 13 | ✅ Done | 100% |
| Footer Navigation | 1 | ✅ Done | 100% |
| My Cases (Core) | 20 | 🔄 In Progress | ~60% |
| Case Locking | 0 | 📋 Planned | 0% |
| Case Sharing | 0 | 📋 Planned | 0% |
| Video Merge | 0 | 📋 Planned | 0% |
| ISO Burn | 0 | 📋 Planned | 0% |
| RBAC/Permissions | 0 | 📋 Planned | 0% |
| **รวม** | **93** | | **~65%** |

---

## หมายเหตุ

- TC ที่ระบุ "Planned" อยู่ใน `document/feature_MyCases_checklist.md`
- Pass Rate จะอัปเดตหลัง run test แต่ละรอบ (ดูได้จาก HTML report)
- Coverage % คำนวณจาก feature checklist items ที่มี automated test
