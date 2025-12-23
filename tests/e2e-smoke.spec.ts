// E2E smoke: signup → login → add contact → edit contact (golden path)
import { test, expect } from './fixtures';
import * as allure from "allure-js-commons";
import { generateTimestampedEmail } from './utils/email';
import { getLastUser, saveUser } from './utils/user';
import { getLastContact, addContactWithUser } from './utils/contact';
import { generateContact } from './utils/contactGenerator';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { ContactListPage } from './pages/ContactListPage';
import { contextIdFor, attachOnFailure, ensureUserExists, ensureContactExists } from './utils/testHelpers';
import { waitForRowWithText } from './utils/resilience';

test.describe.configure({ mode: 'serial' });

test.afterEach(async ({ page }, testInfo) => {
  await attachOnFailure(page, testInfo);

  const contactListPage = new ContactListPage(page);
  await contactListPage.logoutIfPossible();
});

test.afterAll(async ({ browser }) => {
  await browser.close();
});

test('Sign Up', async ({ page }, testInfo) => {
  const signupPage = new SignupPage(page);
  const contactListPage = new ContactListPage(page);
  const contextId = contextIdFor(testInfo);

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
    }, contextId);
  });
  console.log(`User: ${userEmail} — this user name exists now in the file`);
});

test('Login with existing user', async ({ loggedInPage }, testInfo) => {
  await expect(loggedInPage.getByRole('heading')).toContainText('Contact List');
});

test('Add new contact', async ({ loggedInPage, request }, testInfo) => {
  const page = loggedInPage;
  const contextId = contextIdFor(testInfo);
  const user = await ensureUserExists(contextId, page, request);
  const contact = generateContact();
  await addContactWithUser(page, request, user, contact, testInfo);
});

test('Add multiple contacts', async ({ loggedInPage, request }, testInfo) => {
  const page = loggedInPage;
  const contextId = contextIdFor(testInfo);
  const user = await ensureUserExists(contextId, page, request);
  const contact1 = generateContact();
  await addContactWithUser(page, request, user, contact1, testInfo);
  const contact2 = generateContact();
  await addContactWithUser(page, request, user, contact2, testInfo);
});

test('Edit Contact', async ({ page, request }, testInfo) => {
  const loginPage = new LoginPage(page, request);
  const contextId = contextIdFor(testInfo);
  const lastUser = await ensureUserExists(contextId, page, request);
  const lastCreated = await ensureContactExists(contextId, page, request, lastUser);

  await allure.step('Login and navigate to contact list', async () => {
    await page.goto('/');
    await loginPage.loginWithUser(lastUser);
    await page.waitForURL('**/contactList');
    await expect(page.locator('#myTable')).toContainText('Birthdate');
  });

  // Wait for the contact row to appear, then open it once
  const row = await waitForRowWithText(page, '#myTable', lastCreated.email);
  await allure.step(`Open contact with email ${lastCreated.email}`, async () => {
    await row.click();
    await expect(page.locator('#edit-contact')).toContainText('Edit Contact');
    await page.getByText(`Email: ${lastCreated.email}`).click();
  });

  // Edit and save contact details
  await page.getByRole('button', { name: 'Edit Contact' }).click();
  
  // Wait for the form to become editable
  await page.waitForURL('**/editContact');
  const firstNameField = page.locator('#firstName');
  const lastNameField = page.locator('#lastName');
  await expect(firstNameField).not.toHaveValue('', { timeout: 10000 });
  await expect(lastNameField).not.toHaveValue('', { timeout: 10000 });
  const currentFirst = await firstNameField.inputValue();
  const currentLast = await lastNameField.inputValue();
  const newFirst = `${currentFirst || lastCreated.firstName}Edited`;
  const newLast = `${currentLast || lastCreated.lastName}Edited`;
  await firstNameField.click();
  await firstNameField.fill(newFirst);
  await lastNameField.click();
  await lastNameField.fill(newLast);
  await expect(firstNameField).toHaveValue(newFirst);
  await expect(lastNameField).toHaveValue(newLast);
  await allure.step('Submit edited contact', async () => {
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForURL('**/contactDetails');
    await page.reload();
    const firstNameDetail = page.locator('p').filter({ hasText: `First Name: ${newFirst}` });
    const lastNameDetail = page.locator('p').filter({ hasText: `Last Name: ${newLast}` });
    await expect(firstNameDetail).toBeVisible();
    await expect(lastNameDetail).toBeVisible();
    await page.getByRole('button', { name: 'Return to Contact List' }).click();
  });

  await allure.step('Verify updated contact displayed in list', async () => {
    const row = page.locator('#myTable tr').filter({ hasText: lastCreated.email });
    await expect(row).toContainText(newFirst);
    await expect(row).toContainText(newLast);
  });

  // eslint-disable-next-line no-console
  console.log(`Edited contact for user: ${lastCreated.email} to ${lastCreated.firstName}Edited ${lastCreated.lastName}Edited`);
});
