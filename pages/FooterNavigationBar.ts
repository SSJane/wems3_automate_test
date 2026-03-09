import { Page,Locator, expect } from "@playwright/test";
import * as dotenv from "dotenv";
dotenv.config();

class FooterNavigationBar {
    page: Page;
    WolfcomLink: Locator;

    constructor(page: Page) {
        this.page = page;
        // Footer Navigation Bar

        // Wolfcom website link
        this.WolfcomLink = page.getByRole('link', { name: 'Wolfcom Enterprises' })
        
    }

    // click on the Wolfcom website link in the footer
    async clickWolfcomLink() {
        await this.WolfcomLink.click();
    }
    // verify that the Wolfcom website link is visible in the footer
    async verifyWolfcomLinkVisible() {
        await expect(this.WolfcomLink).toBeVisible();
    }
    
}
export { FooterNavigationBar };