import { Page, Locator, expect } from '@playwright/test';

export async function clickButton(page: Page, names: string[], options: { timeout?: number } = {}) {
  const timeout = options.timeout ?? 10000;
  for (const name of names) {
    try {
      const byRole = page.getByRole('button', { name, exact: false });
      await byRole.waitFor({ state: 'visible', timeout });
      await byRole.click();
      return;
    } catch {}

    try {
      const byText = page.locator('button').filter({ hasText: name });
      await byText.first().waitFor({ state: 'visible', timeout });
      await byText.first().click();
      return;
    } catch {}

    try {
      const generic = page.getByText(name, { exact: false });
      await generic.first().waitFor({ state: 'visible', timeout });
      await generic.first().click();
      return;
    } catch {}
  }
  throw new Error(`Unable to click button. Tried names: ${names.join(', ')}`);
}

export async function fillInput(
  page: Page,
  value: string,
  variants: Array<
    | { placeholder: string }
    | { id: string }
    | { label: string }
  >,
  options: { timeout?: number; clear?: boolean } = {}
) {
  const timeout = options.timeout ?? 10000;
  const clear = options.clear ?? true;

  for (const v of variants) {
    let locator: Locator | null = null;
    try {
      if ('placeholder' in v) locator = page.getByPlaceholder(v.placeholder);
      else if ('label' in v) locator = page.getByLabel(v.label, { exact: false });
      else if ('id' in v) locator = page.locator(v.id.startsWith('#') ? v.id : `#${v.id}`);

      if (!locator) continue;
      await locator.waitFor({ state: 'visible', timeout });
      if (clear) await locator.fill('');
      await locator.fill(value);
      return;
    } catch {}
  }
  throw new Error(
    `Unable to fill input with value '${value}'. Tried variants: ${variants
      .map((v) => ('placeholder' in v ? `placeholder=${v.placeholder}` : 'label' in v ? `label=${v.label}` : `id=${v.id}`))
      .join(', ')}`
  );
}

export async function waitForRowWithText(page: Page, tableSelector: string, text: string, options: { timeout?: number } = {}) {
  const timeout = options.timeout ?? 15000;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    // Strategy 1: direct has-text on table
    try {
      const table = page.locator(tableSelector);
      await expect(table).toContainText(text, { timeout: 3000 });
      return table.locator('tr').filter({ hasText: text }).first();
    } catch {}

    // Strategy 2: row-level has-text
    try {
      const row = page.locator(`${tableSelector} tr`).filter({ hasText: text }).first();
      await row.waitFor({ state: 'visible', timeout: 3000 });
      return row;
    } catch {}

    // Strategy 3: generic text fallback within table
    try {
      const fallback = page.locator(tableSelector).getByText(text, { exact: false }).first();
      await fallback.waitFor({ state: 'visible', timeout: 3000 });
      return page.locator(`${tableSelector} tr`).filter({ hasText: text }).first();
    } catch {}

    // If all strategies failed, reload and retry
    try {
      await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
      await page.waitForTimeout(500); // Brief pause after reload
    } catch {}
  }

  throw new Error(`Row containing '${text}' not found in ${tableSelector}`);
}
