// spec: specs/pxm-studio.plan.md
import { test, expect } from '@playwright/test';
import { answerAll, startDiagnostico } from './helpers';

test.use({ viewport: { width: 360, height: 740 } });

test.describe('Diagnóstico', () => {
  test('should not scroll horizontally on a phone', async ({ page }) => {
    const noOverflow = () =>
      page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);

    await startDiagnostico(page, 'Consultorio o profesional de salud', 'Consultorio Dra. Fernández Gutiérrez');
    expect(await noOverflow()).toBe(true);

    await answerAll(page, 'C');
    expect(await noOverflow()).toBe(true);
  });
});
