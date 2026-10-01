// spec: specs/pxm-studio.plan.md
import { test, expect } from '@playwright/test';
import { answerAll, startDiagnostico, whatsappText } from './helpers';

test.describe('Diagnóstico', () => {
  test('should score 0/10 and list the top 3 things to improve when every answer is the worst one', async ({ page }) => {
    await startDiagnostico(page, 'Comidas, rotisería o bar');
    await answerAll(page, 'C');

    await expect(page.locator('#res-pill')).toHaveText('Resultado de tu negocio');
    await expect(page.locator('#score')).toHaveText('0');
    await expect(page.locator('#level')).toHaveText('Negocio offline');
    await expect(page.locator('#bars .st')).toHaveText(Array(10).fill('BAJO'));

    await expect(page.locator('#recs-title')).toHaveText('Lo que más te conviene mejorar');
    await expect(page.locator('#recs h3')).toHaveText(['Menú digital', 'Pedidos y delivery', 'Comandas']);

    const text = await whatsappText(page);
    expect(text).toContain('saqué 0/10 (Negocio offline)');
    expect(text).toContain('Rubro: Comidas, rotisería o bar');
    expect(text).toContain('Quiero mejorar: menú digital, pedidos y delivery, comandas.');
  });

  test('should show a decimal score with a comma and the middle level', async ({ page }) => {
    // 10 questions: 9 best + 1 middle → 19/20 → 9,5
    await startDiagnostico(page, 'Peluquería o barbería');
    await answerAll(page, ['A', 'A', 'A', 'A', 'B', 'A', 'A', 'A', 'A', 'A']);
    await expect(page.locator('#score')).toHaveText('9,5');
    await expect(page.locator('#level')).toHaveText('Negocio digital');
    await expect(page.locator('#recs h3')).toHaveText(['Fidelización']);

    // All middle answers → 5/10
    await page.getByRole('button', { name: 'Hacer el test de nuevo' }).click();
    await page.getByRole('button', { name: 'Empezar el diagnóstico →' }).click();
    await page.getByRole('button', { name: 'Siguiente →' }).click();
    await answerAll(page, 'B');
    await expect(page.locator('#score')).toHaveText('5');
    await expect(page.locator('#level')).toHaveText('A mitad de camino');
  });
});
