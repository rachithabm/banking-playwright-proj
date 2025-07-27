import { Page, expect } from '@playwright/test';
import { saveSharedData } from '../utils/dataManager';

export class RegistrationPage {
   page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToRegistrationPage() {
    await this.page.click('text=Register');
    await expect(this.page).toHaveURL(/register.htm/);
  }

  async registerUser() {
    const timestamp = Date.now();
    const username = `user_${timestamp}`;
    const password = 'smile';

    // Fill out the registration form
    await this.page.fill('input[name="customer.firstName"]', 'Test');
    await this.page.fill('input[name="customer.lastName"]', 'User');
    await this.page.fill('input[name="customer.address.street"]', '123 Test Street');
    await this.page.fill('input[name="customer.address.city"]', 'TestCity');
    await this.page.fill('input[name="customer.address.state"]', 'TS');
    await this.page.fill('input[name="customer.address.zipCode"]', '12345');
    await this.page.fill('input[name="customer.phoneNumber"]', '1234567890');
    await this.page.fill('input[name="customer.ssn"]', '123-45-6789');
    await this.page.fill('input[name="customer.username"]', username);
    await this.page.fill('input[name="customer.password"]', password);
    await this.page.fill('input[name="repeatedPassword"]', password);

    // Submit the form
    await this.page.click('input[value="Register"]');

    // Assert that registration succeeded
    const welcomeText = this.page.locator("div[id='rightPanel'] h1");
    await expect(welcomeText).toContainText('Welcome');
    const message = this.page.locator("div[id='rightPanel'] p");
    await expect(message).toContainText('Your account was created successfully. You are now logged in.');

    // Save credentials to shared storage for Login
    saveSharedData({ username, password });

    console.log(`✅ Registered user: ${username} / ${password}`);
  }
}
