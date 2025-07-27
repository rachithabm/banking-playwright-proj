import { Page, expect } from '@playwright/test';

export class HomePage {
   page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators for the global navigation menu items
  navMenuItems = [
    { label: 'Accounts Overview', path: 'overview' },
    { label: 'Open New Account', path: 'openaccount' },
    { label: 'Transfer Funds', path: 'transfer' },
    { label: 'Bill Pay', path: 'billpay' },
    { label: 'Find Transactions', path: 'findtrans' },
    { label: 'Update Contact Info', path: 'updateprofile' },
    { label: 'Request Loan', path: 'requestloan' },
    { label: 'Log Out', path: 'logout' },
  ];

  // Verify that all main navigation items exist and are clickable
  async verifyNavigationMenuItems() {
    for (const item of this.navMenuItems) {
      const link = this.page.locator(`a:has-text("${item.label}")`);
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', new RegExp(item.path));
    }
  }

  // Click a navigation menu item and verify URL contains expected path
  async clickNavigationItem(label: string, expectedPath: string) {
    await this.page.click(`a:has-text("${label}")`);
    await expect(this.page).toHaveURL(new RegExp(expectedPath));
  }

  async verifyLogoutIsVisible() {
    await expect(this.page.locator('text=Log Out')).toBeVisible();
  }

  async clickLogout() {
    await this.page.click('text=Log Out');
    await expect(this.page.locator('text=Customer Login')).toBeVisible();
  }

  async logout() {
    await this.verifyLogoutIsVisible();
    this.clickLogout();
  }
}
