import { test, expect } from './fixtures';
import { AddContactPage } from './pages/AddContactPage';
import { generateContact } from './utils/contactGenerator';
import { attachOnFailure } from './utils/testHelpers';

// Shared teardown: attach screenshot on failure and clear session
test.afterEach(async ({ page }, testInfo) => {
  await attachOnFailure(page, testInfo);
});

// [TC-LIST-001] User is on contact list page after login
test('[TC-LIST-001] Contact list page is loaded', async ({ loggedInPage }) => {
  const page = loggedInPage;

  await test.step('Verify page URL contains contactList', async () => {
    expect(page.url()).toContain('contactList');
  });
});

// [TC-LIST-002] Add a contact successfully
test('[TC-LIST-002] New contact can be added', async ({ loggedInPage }) => {
  const page = loggedInPage;
  const addContact = new AddContactPage(page);
  const contact = generateContact();

  await test.step('Add contact via form', async () => {
    await addContact.addContact(contact);
  });

  await test.step('Verify we return to contact list', async () => {
    expect(page.url()).toContain('contactList');
  });
});

// [TC-LIST-003] Multiple contacts can be added
test('[TC-LIST-003] Multiple contacts can be added', async ({ loggedInPage }) => {
  const page = loggedInPage;
  const addContact = new AddContactPage(page);
  const contact1 = generateContact();
  const contact2 = generateContact();

  await test.step('Add first contact', async () => {
    await addContact.addContact(contact1);
  });

  await test.step('Add second contact', async () => {
    await addContact.addContact(contact2);
  });

  await test.step('Verify on contact list page', async () => {
    expect(page.url()).toContain('contactList');
  });
});

// [TC-LIST-004] Contact list page remains accessible
test('[TC-LIST-004] Contact list page is stable', async ({ loggedInPage }) => {
  const page = loggedInPage;

  await test.step('Verify page is accessible', async () => {
    expect(page.url()).toContain('contactList');
  });

  await test.step('Reload page and verify stability', async () => {
    await page.reload();
    expect(page.url()).toContain('contactList');
  });
});
