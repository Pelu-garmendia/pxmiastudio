// spec: specs/pxm-studio.plan.md
import { test, expect } from '@playwright/test';
import { answerAll, startDiagnostico, whatsappText } from './helpers';

test.describe('Diagnóstico', () => {
  test('should score 10/10 and suggest the next step when every answer is the best one', async ({ page }) => {
    await startDiagnostico(page, 'Ropa o accesorios', 'Tienda Sol');
    await answerAll(page, 'A');

    await expect(page.locator('#counter')).toHaveText('RESULTADO');
    await expect(page.locator('#res-pill')).toHaveText('Resultado de Tienda Sol');
    await expect(page.locator('#score')).toHaveText('10');
    await expect(page.locator('#level')).toHaveText('Negocio digital');

    const bars = page.locator('#bars .bar-row');
    await expect(bars).toHaveCount(11);
    await expect(bars.locator('.st')).toHaveText(Array(11).fill('BIEN'));

    await expect(page.locator('#recs-title')).toHaveText('Tu próximo paso');
    await expect(page.locator('#recs .rec')).toHaveCount(1);
    await expect(page.locator('#recs .sol')).toHaveText('Tienda online, caja y stock conectados en un solo sistema');

    const text = await whatsappText(page);
    expect(text).toContain('saqué 10/10 (Negocio digital)');
    expect(text).toContain('Negocio: Tienda Sol (Ropa o accesorios)');
    expect(text).not.toContain('Quiero mejorar');
  });
});
