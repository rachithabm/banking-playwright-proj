import { Page, expect } from '@playwright/test';
import { getSharedDataByKey } from '../utils/dataManager';

export class FundTransferPage {
   page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to Transfer Funds page
  async navigate() {
    await this.page.click('text=Transfer Funds');
    await expect(this.page).toHaveURL(/transfer.htm/);
  }

  /**
   * Transfer funds between accounts
   */
  async transfer(params: { amount: string; fromAccountId?: string; toAccountId?: string }) {
    const { amount } = params;

    // If accounts not provided explicitly, get from shared data
    const fromAccountId = params.fromAccountId ?? getSharedDataByKey('fromAccountId');
    const toAccountId = params.toAccountId ?? getSharedDataByKey('toAccountId');

    if (!fromAccountId || !toAccountId) {
      throw new Error('Account IDs not found in parameters or shared data store.');
    }

    await this.page.fill('input[id="amount"]', amount);
    await this.page.selectOption('select[id="fromAccountId"]', fromAccountId);
    await this.page.selectOption('select[id="toAccountId"]', toAccountId);
    await this.page.click('input[value="Transfer"]');

    const successMessage = this.page.locator('#showResult');
    await expect(successMessage).toContainText('Transfer Complete!');
    await expect(successMessage).toContainText(fromAccountId);
    await expect(successMessage).toContainText(toAccountId);
    await expect(successMessage).toContainText(amount);


    console.log('Funds Transfer Complete! From Account: ' +fromAccountId+ ' || To Account: ' +toAccountId);
  }
}
