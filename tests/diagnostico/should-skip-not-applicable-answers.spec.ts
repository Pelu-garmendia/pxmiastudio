// spec: specs/pxm-studio.plan.md
import { test, expect } from '@playwright/test';
import { answerAll, startDiagnostico } from './helpers';

test.describe('Diagnóstico', () => {
  test('should leave "no aplica" answers out of the score', async ({ page }) => {
    // Gimnasio: cuotas, acceso, clases, retencion + 5 common. "D" on clases = no aplica.
    await startDiagnostico(page, 'Gimnasio o estudio de entrenamiento');
    await answerAll(page, ['C', 'C', 'D', 'C', 'C', 'C', 'C', 'C', 'C']);

    await expect(page.locator('#score')).toHaveText('0');
    await expect(page.locator('#bars .bar-row')).toHaveCount(8);
    await expect(page.locator('#bars .name')).not.toContainText(['Clases con cupo']);
  });
});
