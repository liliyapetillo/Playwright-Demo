import { Page, APIRequestContext, TestInfo, expect } from '@playwright/test';
import { TestUser } from './user';
import { LoginPage } from '../pages/LoginPage';
import { AddContactPage } from '../pages/AddContactPage';
import { getTestResultsPath, saveJsonFile, loadJsonFile } from './fileHelpers';

export type TestContact = {
  email: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  phone?: string;
  country?: string;
  postalCode?: string;
  city?: string;
  state?: string;
  address?: string;
  createdAt?: string;
};

function getContactDataPath(workerId = 'default'): string {
  return getTestResultsPath('test-contacts', workerId);
}

export async function getLastContact(workerId?: string): Promise<TestContact | null> {
  const dataPath = getContactDataPath(workerId);
  return loadJsonFile<TestContact>(dataPath);
}

/**
 * Add a contact using the page object (assumes already logged in)
 */
export async function addContact(
  page: Page,
  contact: Omit<TestContact, 'createdAt'>,
  testInfo: TestInfo
): Promise<TestContact> {
  const addContactPage = new AddContactPage(page);

  // Add the contact
  await addContactPage.addContact({
    firstName: contact.firstName || '',
    lastName: contact.lastName || '',
    dob: contact.dob || '',
    email: contact.email,
    phone: contact.phone || '',
    country: contact.country || '',
    postalCode: contact.postalCode || '',
    city: contact.city || '',
    state: contact.state || '',
    address: contact.address || '',
  });

  // Verify contact was added using expect.poll() for eventual consistency
  await expect.poll(async () => {
    return await page.locator('#myTable').textContent();
  }, {
    timeout: 20000,
  }).toContain(contact.email);

  // Save the contact data
  const contextId = `${testInfo.project.name}-${testInfo.workerIndex}`;
  const dataPath = getContactDataPath(contextId);
  const payload = { ...contact, createdAt: new Date().toISOString() };
  await saveJsonFile(dataPath, payload);

  console.log(`Added contact: ${contact.email}`);

  return { ...contact, createdAt: new Date().toISOString() };
}

/**
 * @deprecated Use addContact() directly with loggedInPage fixture
 * Legacy helper that performs login before adding contact
 */
export async function addContactWithUser(
  page: Page,
  request: APIRequestContext,
  user: TestUser,
  contact: Omit<TestContact, 'createdAt'>,
  testInfo: TestInfo
): Promise<TestContact> {
  const loginPage = new LoginPage(page, request);

  // Navigate to login page and login (automatically redirects to contactList)
  await page.goto('/');
  await loginPage.loginWithUser(user);

  // Wait for automatic redirect to contact list
  await page.waitForURL('**/contactList');

  return addContact(page, contact, testInfo);
}

export default { getLastContact, addContact, addContactWithUser };
