import { test, expect } from './fixtures';
import { LoginPage } from './pages/LoginPage';
import { ContactListPage } from './pages/ContactListPage';
import { AddContactPage } from './pages/AddContactPage';
import { generateContact } from './utils/contactGenerator';
import { contextIdFor, attachOnFailure, ensureUserExists, ensureContactExists } from './utils/testHelpers';
import { waitForRowWithText } from './utils/resilience';

// Shared teardown: attach screenshot on failure and clear session
test.afterEach(async ({ page }, testInfo) => {
  await attachOnFailure(page, testInfo);
  const contactListPage = new ContactListPage(page);
  await contactListPage.logoutIfPossible();
});

// [TC-CONTACT-001] Add a new valid contact appears in list
test('[TC-CONTACT-001] Add contact shows in list', async ({ loggedInPage }, testInfo) => {
  const page = loggedInPage;
  const addContact = new AddContactPage(page);
  const contact = generateContact();
  await addContact.addContact(contact);
  await expect(await waitForRowWithText(page, '#myTable', contact.email)).toBeTruthy();
});

// [TC-CONTACT-002] Edit an existing contact; changes visible in list
test('[TC-CONTACT-002] Edit contact and see changes', async ({ loggedInPage, request }, testInfo) => {
  const page = loggedInPage;
  const contextId = contextIdFor(testInfo);
  const user = await ensureUserExists(contextId, page, request);
  const contact = await ensureContactExists(contextId, page, request, user);

  const row = await waitForRowWithText(page, '#myTable', contact.email);
  await row.click();
  await page.getByRole('button', { name: 'Edit Contact' }).click();
  await page.waitForURL('**/editContact');

  const firstNameField = page.locator('#firstName');
  const lastNameField = page.locator('#lastName');
  await expect(firstNameField).not.toHaveValue('', { timeout: 10000 });
  await expect(lastNameField).not.toHaveValue('', { timeout: 10000 });
  const currentFirst = await firstNameField.inputValue();
  const currentLast = await lastNameField.inputValue();
  const newFirst = `${currentFirst || 'Test'}Edited`;
  const newLast = `${currentLast || 'User'}Edited`;
  await firstNameField.fill(newFirst);
  await lastNameField.fill(newLast);
  await expect(firstNameField).toHaveValue(newFirst);
  await expect(lastNameField).toHaveValue(newLast);
  await page.getByRole('button', { name: 'Submit' }).click();

  // Wait for navigation back to details before asserting
  await page.waitForURL('**/contactDetails');
  await page.reload();
  const firstNameDetail = page.locator('p').filter({ hasText: `First Name: ${newFirst}` });
  const lastNameDetail = page.locator('p').filter({ hasText: `Last Name: ${newLast}` });
  await expect(firstNameDetail).toBeVisible();
  await expect(lastNameDetail).toBeVisible();

  await page.getByRole('button', { name: 'Return to Contact List' }).click();
  const updatedRow = page.locator('#myTable tr').filter({ hasText: contact.email });
  await expect(updatedRow).toContainText(newFirst);
  await expect(updatedRow).toContainText(newLast);
});
