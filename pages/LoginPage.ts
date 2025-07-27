import { Page, expect } from '@playwright/test';
import { getSharedData } from '../utils/dataManager';
import fs from 'fs';
import path from 'path';

export class LoginPage {
   page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async loginWithSavedCredentials() {
    const { username, password } = getSharedData();

    if (!username || !password) {
      throw new Error('Username or password not found in shared data store.');
    }

    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('input[type="submit"]');

    // ✅ Assert successful login by checking presence of "Log Out" link or account overview
    await expect(this.page.locator('text=Log Out')).toBeVisible();

    // ✅ Save JSESSIONID cookie for API usage
    const cookies = await this.page.context().cookies();
    const sessionCookie = cookies.find(cookie => cookie.name === 'JSESSIONID');
    if (sessionCookie) {
      const outputPath = path.join(__dirname, '../utils/session.json');
      fs.writeFileSync(outputPath, JSON.stringify(sessionCookie, null, 2));
      console.log('✅ Saved session cookie to session.json:', sessionCookie.value);
    } else {
      console.warn('⚠️ JSESSIONID cookie not found');
    }
  }

  
}
