import { test, expect } from '@playwright/test';
import * as allure from "allure-js-commons";
import { generateTimestampedEmail } from './utils/email';
import { getLastUser, saveUser } from './utils/user';
import { getLastContact, addContactWithUser } from './utils/contact';
import { generateContact } from './utils/contactGenerator';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { ContactListPage } from './pages/ContactListPage';

test.describe.configure({ mode: 'serial' });

test.afterEach(async ({ page }) => {
  const contactListPage = new ContactListPage(page);
  await contactListPage.logoutIfPossible();
});

test.afterAll(async ({ browser }) => {
  await browser.close();
});

test('Sign Up', async ({ page }, testInfo) => {
  const signupPage = new SignupPage(page);
  const contactListPage = new ContactListPage(page);

  await allure.step('Navigate to signup page', async () => {
    await signupPage.goto();
  });

  const userEmail = generateTimestampedEmail('test', 'testliliyap.com');
  const firstName = `Test${Date.now().toString().slice(-6)}`;
  const lastName = `McTesterson${Date.now().toString().slice(-3)}`;

  await allure.step('Fill and submit signup form', async () => {
    await signupPage.signUp(firstName, lastName, userEmail, 'password');
  });

  await allure.step('Verify contact list page loaded', async () => {
    await contactListPage.expectHeadingToContainText('Contact List');
  });

  // eslint-disable-next-line no-console
  console.log(`Created user: ${userEmail} — this user name was created`);

  await allure.step('Save user data for reuse', async () => {
    await saveUser({
      email: userEmail,
      firstName: firstName,
      lastName: lastName,
    }, testInfo.workerIndex.toString());
  });
  console.log(`User: ${userEmail} — this user name exists now in the file`);
});

test('Login with existing user', async ({ page, request }, testInfo) => {
  const loginPage = new LoginPage(page, request);
  const contactListPage = new ContactListPage(page);
  const lastUser = await getLastUser(testInfo.workerIndex.toString());
  if (!lastUser) {
    throw new Error('No saved test user found. Run the signup test first.');
  }
  
  await allure.step('Navigate to login page', async () => {
    await page.goto('/');
  });

  await allure.step('Login with UI credentials', async () => {
    await loginPage.loginWithUser(lastUser);
  });

  await allure.step('Verify API login success and token retrieval', async () => {
    await loginPage.verifyAPILoginSuccess(lastUser, testInfo);
  });

  await allure.step('Verify contact list page displayed', async () => {
    await expect(page.getByRole('heading')).toContainText('Contact List');
  });

  // eslint-disable-next-line no-console
  console.log(`Reused user: ${lastUser.email}`);
});

test('Add new contact', async ({ page, request }, testInfo) => {
  const lastUser = await getLastUser(testInfo.workerIndex.toString());
  if (!lastUser) {
    throw new Error('No saved test user found. Run the signup test first.');
  }

  const contact = generateContact();
  console.log(`New contact email: ${contact.email}`);

  await allure.step(`Add contact with email ${contact.email}`, async () => {
    await addContactWithUser(page, request, lastUser, contact, testInfo);
  });

  // eslint-disable-next-line no-console
  console.log(`Added contact for user: ${contact.email}`);
});

test('Add multiple contacts', async ({ page, request }, testInfo) => {
  const lastUser = await getLastUser(testInfo.workerIndex.toString());
  if (!lastUser) {
    throw new Error('No saved test user found. Run the signup test first.');
  }

  // Add first contact
  const contact1 = generateContact();
  console.log(`New contact email: ${contact1.email}`);

  await allure.step(`Add first contact with email ${contact1.email}`, async () => {
    await addContactWithUser(page, request, lastUser, contact1, testInfo);
  });

  // Add second contact
  const contact2 = generateContact();
  console.log(`New contact email 2: ${contact2.email}`);

  await allure.step(`Add second contact with email ${contact2.email}`, async () => {
    await addContactWithUser(page, request, lastUser, contact2, testInfo);
  });

  // eslint-disable-next-line no-console
  console.log(`Added multiple contacts for user: ${contact1.email}, ${contact2.email}`);
});

test('Edit Contact', async ({ page, request }, testInfo) => {
  const loginPage = new LoginPage(page, request);
  const lastUser = await getLastUser(testInfo.workerIndex.toString());
  if (!lastUser) {
    throw new Error('No saved test user found. Run the signup test first.');
  }

  const lastCreated = await getLastContact(testInfo.workerIndex.toString());
  if (!lastCreated) {
    throw new Error('No saved contact found. Run the add contact test first.');
  }

  await allure.step('Login and navigate to contact list', async () => {
    await page.goto('/');
    await loginPage.loginWithUser(lastUser);
    await page.waitForURL('**/contactList');
    await expect(page.locator('#myTable')).toContainText('Birthdate');
  });

  // Wait for the contact row to appear, then open it once
  await page.waitForSelector(`#myTable tr:has-text("${lastCreated.email}")`);
  await allure.step(`Open contact with email ${lastCreated.email}`, async () => {
    await page.locator('#myTable tr').filter({ hasText: lastCreated.email }).click();
    await expect(page.locator('#edit-contact')).toContainText('Edit Contact');
    await page.getByText(`Email: ${lastCreated.email}`).click();
  });

  // Edit and save contact details
  await page.getByRole('button', { name: 'Edit Contact' }).click();
  
  // Wait for the form to become editable
  await page.waitForURL('**/editContact');
  await page.getByRole('textbox', { name: 'First Name:' }).click();
  await page.getByRole('textbox', { name: 'First Name:' }).fill(`${lastCreated.firstName}Edited`);  
  await page.getByRole('textbox', { name: 'Last Name:' }).click(); 
  await page.getByRole('textbox', { name: 'Last Name:' }).fill(`${lastCreated.lastName}Edited`);
  await allure.step('Submit edited contact', async () => {
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('#firstName')).toContainText(`${lastCreated.firstName}Edited`);
    await page.getByRole('button', { name: 'Return to Contact List' }).click();
  });

  await allure.step('Verify updated contact displayed in list', async () => {
    await expect(page.locator('#myTable')).toContainText(`${lastCreated.firstName}Edited ${lastCreated.lastName}Edited`);
  });

  // eslint-disable-next-line no-console
  console.log(`Edited contact for user: ${lastCreated.email} to ${lastCreated.firstName}Edited ${lastCreated.lastName}Edited`);
});
