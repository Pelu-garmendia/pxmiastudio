// spec: specs/pxm-studio.plan.md
// seed: tests/seed.spec.ts
import { test, expect } from '../fixtures';

test.describe('Quote form', () => {
  test('should show an inline error when detail is empty', async ({ page }) => {
    // 1. Navigate to the quote section via the header nav
    await page.locator('.nav').getByRole('link', { name: 'Cotización' }).click();

    // 2. Submit without filling the project detail
    await page.getByRole('button', { name: 'Enviar cotización por WhatsApp' }).click();

    const error = page.getByRole('alert');
    await expect(error).toBeVisible();
    await expect(error).toHaveText('Contanos un poco tu proyecto antes de enviar.');
  });
});
