import { Page, expect } from '@playwright/test';

export class AccountPage {
   page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async gotoOverview() {
    await this.page.click('text=Accounts Overview');
  }

  async getAccountIds(): Promise<string[]> {
    const links = this.page.locator('table#accountTable td a');
    const count = await links.count();
    const accountIds: string[] = [];

    for (let i = 0; i < count; i++) {
      accountIds.push(await links.nth(i).innerText());
    }

    return accountIds;
  }

  async viewAccountDetails(accountId: string) {
    await this.page.click(`text=${accountId}`);
    await expect(this.page.locator('h1.title')).toContainText('Account Details');
  }

  async getAccountBalance(): Promise<number> {
    const balanceText = await this.page.locator('td:has-text("Balance") + td').innerText();
    return parseFloat(balanceText.replace(/[^0-9.]/g, ''));
  }

  async assertBalancePositive() {
    const balance = await this.getAccountBalance();
    expect(balance).toBeGreaterThanOrEqual(0);
  }
}
