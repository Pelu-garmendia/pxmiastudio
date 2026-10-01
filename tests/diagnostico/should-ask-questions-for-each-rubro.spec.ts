// spec: specs/pxm-studio.plan.md
import { test, expect } from '@playwright/test';
import { startDiagnostico, totalQuestions } from './helpers';

// Rubro-specific questions + the 5 common ones.
const CASES: [rubro: string, total: number, firstArea: string][] = [
  ['Ropa o accesorios', 11, 'Catálogo online'],
  ['Mayorista o distribuidora', 10, 'Lista de precios'],
  ['Comidas, rotisería o bar', 10, 'Menú digital'],
  ['Peluquería o barbería', 10, 'Turnos'],
  ['Gimnasio o estudio de entrenamiento', 9, 'Socios y cuotas'],
  ['Artista o banda', 9, 'Web propia'],
  ['Otro', 9, 'Catálogo online'],
];

test.describe('Diagnóstico', () => {
  for (const [rubro, total, firstArea] of CASES) {
    test(`should ask ${total} questions for "${rubro}"`, async ({ page }) => {
      await startDiagnostico(page, rubro);

      expect(await totalQuestions(page)).toBe(total);
      await expect(page.locator('#q-area')).toHaveText(`${rubro} · ${firstArea}`);
      await expect(page.locator('#counter')).toHaveText(`PREGUNTA 1 DE ${total}`);
      await expect(page.getByRole('radio')).not.toHaveCount(0);
    });
  }
});
