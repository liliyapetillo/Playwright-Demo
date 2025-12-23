import fs from 'fs';
import path from 'path';
import { Page, APIRequestContext, TestInfo } from '@playwright/test';
import { TestUser } from './user';
import { LoginPage } from '../pages/LoginPage';
import { AddContactPage } from '../pages/AddContactPage';

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
  return path.resolve(__dirname, `../../test-results/test-contacts-${workerId}.json`);
}

async function ensureDir(filePath: string) {
  const dir = path.dirname(filePath);
  await fs.promises.mkdir(dir, { recursive: true });
}

export async function getLastContact(workerId?: string): Promise<TestContact | null> {
  const dataPath = getContactDataPath(workerId);
  try {
    const raw = await fs.promises.readFile(dataPath, 'utf8');
    return JSON.parse(raw) as TestContact;
  } catch (e) {
    return null;
  }
}

export async function addContactWithUser(
  page: Page,
  request: APIRequestContext,
  user: TestUser,
  contact: Omit<TestContact, 'createdAt'>,
  testInfo: TestInfo
): Promise<TestContact> {
  const loginPage = new LoginPage(page, request);
  const addContactPage = new AddContactPage(page);

  // Navigate to login page and login (automatically redirects to contactList)
  await page.goto('/');
  await loginPage.loginWithUser(user);

  // Wait for automatic redirect to contact list
  await page.waitForURL('**/contactList');

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

  // Verify contact was added
  await page.waitForSelector(`#myTable:has-text("${contact.email}")`);

  // Save the contact data (inline, without exported helper)
  const contextId = `${testInfo.project.name}-${testInfo.workerIndex}`;
  const dataPath = getContactDataPath(contextId);
  const payload = { ...contact, createdAt: new Date().toISOString() };
  await ensureDir(dataPath);
  const tmp = `${dataPath}.tmp`;
  await fs.promises.writeFile(tmp, JSON.stringify(payload, null, 2), 'utf8');
  await fs.promises.rename(tmp, dataPath);

  console.log(`Added contact: ${contact.email}`);

  return { ...contact, createdAt: new Date().toISOString() };
}

export default { getLastContact, addContactWithUser };
