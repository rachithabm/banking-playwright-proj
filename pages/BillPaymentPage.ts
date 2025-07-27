import { Page, expect } from '@playwright/test';
import { getSharedDataByKey } from '../utils/dataManager';
import { saveSharedData } from '../utils/dataManager';

interface BillPayParams {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  account: string;
  amount: string;
  fromAccountId?: string;  // Optional: use saved account if not provided
}

export class BillPaymentPage {
   page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.click('text=Bill Pay');
    await expect(this.page).toHaveURL(/billpay.htm/);
  }

  async payBill(params: BillPayParams) {
    const {
      name,
      address,
      city,
      state,
      zipCode,
      phone,
      account,
      amount,
      fromAccountId
    } = params;

    // Use fromAccountId from params or fallback to shared data
    const accountIdToUse = fromAccountId ?? getSharedDataByKey('fromAccountId');
    if (!accountIdToUse) {
      throw new Error('fromAccountId not provided and not found in shared data');
    }

    await this.page.fill('input[name="payee.name"]', name);
    await this.page.fill('input[name="payee.address.street"]', address);
    await this.page.fill('input[name="payee.address.city"]', city);
    await this.page.fill('input[name="payee.address.state"]', state);
    await this.page.fill('input[name="payee.address.zipCode"]', zipCode);
    await this.page.fill('input[name="payee.phoneNumber"]', phone);
    await this.page.fill('input[name="payee.accountNumber"]', account);
    await this.page.fill('input[name="verifyAccount"]', account);
    await this.page.fill('input[name="amount"]', amount);
    await this.page.selectOption('select[name="fromAccountId"]', accountIdToUse);

    // Save payment amount to shared store
    saveSharedData('billPaymentAmount', amount);
    saveSharedData('billPaymentAccount', accountIdToUse);
    console.log('✅ Saved bill payment data:', amount, accountIdToUse);

    await this.page.click('input[value="Send Payment"]');

    const successMessage = this.page.locator('div#billpayResult');
    const successMessageAccountId = this.page.locator('div#billpayResult p:nth-of-type(1) #fromAccountId');
    await expect(successMessage).toContainText('Bill Payment Complete');
    await expect(successMessageAccountId).toContainText(accountIdToUse);

    console.log(successMessage);

  }
}
