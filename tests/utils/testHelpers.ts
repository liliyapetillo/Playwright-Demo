import { Page, type TestInfo, APIRequestContext } from '@playwright/test';
import { SignupPage } from '../pages/SignupPage';
import { ContactListPage } from '../pages/ContactListPage';
import { getLastUser, saveUser, type TestUser } from './user';
import { getLastContact, addContactWithUser, type TestContact } from './contact';
import { generateContact } from './contactGenerator';
import { generateTimestampedEmail } from './email';

export const contextIdFor = (testInfo: TestInfo) => `${testInfo.project.name}-${testInfo.workerIndex}`;

export async function attachOnFailure(page: Page, testInfo: TestInfo) {
  if (testInfo.status !== 'failed') return;

  try {
    const screenshotPath = testInfo.outputPath('failed.png');
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });

    await testInfo.attach('screenshot', {
      path: screenshotPath,
      contentType: 'image/png',
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Unable to capture failure screenshot', error);
  }
}

export async function ensureUserExists(
  contextId: string,
  page: Page,
  request: APIRequestContext
): Promise<TestUser> {
  const existing = await getLastUser(contextId);
  if (existing) return existing;

  const signup = new SignupPage(page);
  const contactList = new ContactListPage(page);

  const email = generateTimestampedEmail('test', 'testliliyap.com');
  const firstName = `Test${Date.now().toString().slice(-6)}`;
  const lastName = `McTesterson${Date.now().toString().slice(-3)}`;

  await signup.goto();
  await signup.signUp(firstName, lastName, email, 'password');
  await contactList.expectHeadingToContainText('Contact List');

  const user = { email, firstName, lastName };
  await saveUser(user, contextId);
  return user;
}

export async function ensureContactExists(
  contextId: string,
  page: Page,
  request: APIRequestContext,
  user: TestUser
): Promise<TestContact> {
  const existing = await getLastContact(contextId);
  if (existing) return existing;

  const contact = generateContact();
  const created = await addContactWithUser(page, request, user, contact, {
    // Minimal TestInfo shim to satisfy signature
    project: { name: contextId.split('-')[0] } as any,
    workerIndex: Number(contextId.split('-')[1]) || 0,
  } as unknown as TestInfo);
  return created;
}
