import { test, expect, request } from '@playwright/test';
import { RegistrationPage } from '../../pages/RegistrationPage';
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';
import { OpenAccountPage } from '../../pages/OpenAccountPage';
import { BillPaymentPage } from '../../pages/BillPaymentPage';
import { FundTransferPage } from '../../pages/FundTransferPage';
import { saveSharedData, getSharedData } from '../../utils/dataManager';
import fs from 'fs';

test('End-to-End test: register, login, open account, transfer funds, pay bill and api check for bill payment', async ({ page }) => {
  // Navigate to ParaBank
  await page.goto('https://parabank.parasoft.com/');

  // Register a new user
  const registrationPage = new RegistrationPage(page);
  await registrationPage.navigateToRegistrationPage();
  await registrationPage.registerUser();

  //logout and perform login
  const homePage = new HomePage(page);
  await homePage.logout();

  // Login using saved credentials
  const loginPage = new LoginPage(page);
  await loginPage.loginWithSavedCredentials();

  // Verify navigation menu
  await homePage.verifyNavigationMenuItems();

  // Open two accounts: Savings and Checking
  const openAccountPage = new OpenAccountPage(page);

  await openAccountPage.navigate();
  const savingsAccountId = await openAccountPage.openNewSavingsAccount();
  const checkingAccountId = await openAccountPage.openNewCheckingAccount();

  // Save both account numbers to shared data for transfer
  saveSharedData({ fromAccountId: savingsAccountId, toAccountId: checkingAccountId });

  expect(savingsAccountId).not.toBeNull();
  expect(checkingAccountId).not.toBeNull();


 // Transfer funds from savings to checking account and confirm transfer success
  const transferFundsPage = new FundTransferPage(page);
  await transferFundsPage.navigate();
  await transferFundsPage.transfer({ amount: '150' }); // from/to account IDs picked from shared data


  // Pay bill from savings account and confirm bill pay success
  const billPaymentPage = new BillPaymentPage(page);
  await billPaymentPage.navigate();
  await billPaymentPage.payBill({
    name: 'Electric Co',
    address: '456 Main Rd',
    city: 'Billtown',
    state: 'TX',
    zipCode: '78910',
    phone: '5555555555',
    account: '12345',
    amount: '15',
    fromAccountId: savingsAccountId
  });
  console.log('✅ Bill payment done in UI.');

  // 5️⃣ Fetch data for API check
  const { billPaymentAmount, billPaymentAccount } = getSharedData();

  const baseURL = `https://parabank.parasoft.com/parabank/services_proxy/bank/billpay?accountId=${billPaymentAccount}&amount=${billPaymentAmount}`;

  const sessionCookie = JSON.parse(fs.readFileSync('utils/session.json', 'utf-8'));

  const context = await request.newContext({
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Cookie': `JSESSIONID=${sessionCookie.value}`,
      'X-Requested-With': 'XMLHttpRequest',
    }
  });

const requestBody = {
  "address": {
    "street": "456 Main Rd",
    "city": "Billtown",
    "state": "TX",
    "zipCode": "78910"
  },
  "name": "Electric Co",
  "phoneNumber": "5555555555",
  "accountNumber": "12345"
};

const response = await context.post(baseURL, {
  data: requestBody,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});
console.log('API response:', response);

  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  console.log('✅ Transaction API Response:', responseBody);

  //API Call: Validate transaction using amount
  expect(JSON.stringify(responseBody)).toContain(billPaymentAmount);
  console.log('✅ API validated transaction with amount:', billPaymentAmount);
  

});

