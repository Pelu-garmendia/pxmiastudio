// spec: specs/pxm-studio.plan.md
// seed: tests/seed.spec.ts
import { test, expect } from '../fixtures';

test.describe('Hero', () => {
  test('should render hero content', async ({ page }) => {
    // 1. Load the homepage
    // (handled by the seed fixture)

    await expect(
      page.getByRole('heading', {
        name: 'Construimos el motor digital que hace crecer tu negocio.',
      })
    ).toBeVisible();
  });
});
