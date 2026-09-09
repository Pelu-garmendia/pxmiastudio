// spec: specs/pxm-studio.plan.md
// seed: tests/seed.spec.ts
import { test, expect } from '../fixtures';

test.describe('Contact', () => {
  test('should show whatsapp and instagram links', async ({ page }) => {
    // 1. Navigate to the contact section via the footer
    await page.locator('.footer-links').getByRole('link', { name: 'Contacto' }).click();

    const whatsappLink = page.getByRole('link', { name: 'Escribinos por WhatsApp' });
    await expect(whatsappLink).toBeVisible();
    await expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/5491135943909');

    const instagramLink = page.getByRole('link', { name: '@pxmiastudio' });
    await expect(instagramLink).toBeVisible();
    await expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/pxmiastudio');
  });
});
