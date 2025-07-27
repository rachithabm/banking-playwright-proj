import { Page, expect } from '@playwright/test';


export class OpenAccountPage {
   page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to the Open New Account page
  async navigate() {
    await this.page.click('text=Open New Account');
    await expect(this.page).toHaveURL(/openaccount.htm/);
  }

  // Open a new account with the given account type ("SAVINGS" or "CHECKING")
  async openNewAccount(accountType: 'SAVINGS' | 'CHECKING'): Promise<string> {
    const accountTypeIndex = accountType === 'SAVINGS' ? 1 : 0;

    // Select account type by index
    const accountTypeSelect = this.page.locator('div#openAccountForm select#type');
    await accountTypeSelect.selectOption({ index: accountTypeIndex });


    // Select existing account for funding (select first available)
    const fromAccountSelect = this.page.locator('select#fromAccountId');
    //const optionsCount = await fromAccountSelect.locator('option').count();

    // Select the first account by default
    await fromAccountSelect.selectOption({ index: 0 });

    // Click Open New Account button
    await this.page.click('input[value="Open New Account"]');

    // Wait for and capture new account number link on confirmation page
    const newAccountLink = this.page.locator('div[id="openAccountResult"] a[id="newAccountId"]');
    await expect(newAccountLink).toBeVisible();

    const newAccountId = await newAccountLink.innerText();
    console.log('Opened new account with ID:', newAccountId);

    return newAccountId;
  }

  // Convenience method for opening a savings account specifically
  async openNewSavingsAccount(): Promise<string> {
    await this.navigate();
    return await this.openNewAccount('SAVINGS');
  }

    // Convenience method for opening a checking account specifically
    async openNewCheckingAccount(): Promise<string> {
        await this.navigate();
        return await this.openNewAccount('CHECKING');
      }
  
}
