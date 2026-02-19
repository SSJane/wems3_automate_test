import {test, expect} from "@playwright/test";
import { MyCasesPage } from "../../pages/FilesMenu/MyCasesPage";
import { DashboardPage } from "../../pages/DashboardPage";
import { SideNavigationBar } from "../../pages/SideNavigationBar";
import { LoginPage } from "../../pages/LoginPage";
import * as dotenv from "dotenv";
dotenv.config();