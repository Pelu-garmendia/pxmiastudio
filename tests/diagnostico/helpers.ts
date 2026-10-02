import { expect, type Page } from '@playwright/test';

export const DIAG_URL = '/diagnostico/';

/** Goes from the intro screen to the first question for the given rubro. */
export async function startDiagnostico(page: Page, rubro: string, nombre = '') {
  await page.goto(DIAG_URL);
  await page.getByRole('button', { name: 'Empezar el chequeo →' }).click();
  if (nombre) await page.getByLabel('Nombre del negocio').fill(nombre);
  await page.getByLabel('Rubro').selectOption({ label: rubro });
  await page.getByRole('button', { name: 'Siguiente →' }).click();
  await expect(page.locator('#s-q')).toBeVisible();
}

/** Total number of questions, read from the "01 / NN" counter. */
export async function totalQuestions(page: Page) {
  const txt = await page.locator('#q-count').textContent();
  return Number(txt!.split('/')[1].trim());
}

/**
 * Answers each question with the given option letter (A-D). `letters` can be a
 * single letter for every question or one per question.
 */
export async function answerAll(page: Page, letters: string | string[]) {
  const total = await totalQuestions(page);
  for (let i = 0; i < total; i++) {
    const letter = Array.isArray(letters) ? letters[i] : letters;
    await expect(page.locator('#q-count')).toHaveText(
      `${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`,
    );
    await page.locator('#q-opts .opt').nth('ABCD'.indexOf(letter)).click();
  }
  await expect(page.locator('#s-res')).toBeVisible();
}

/** The prefilled text of the WhatsApp CTA. */
export async function whatsappText(page: Page) {
  const href = await page.getByRole('link', { name: 'Quiero mejorar mi puntaje' }).getAttribute('href');
  const url = new URL(href!);
  expect(url.origin + url.pathname).toBe('https://wa.me/5491135943909');
  return url.searchParams.get('text')!;
}
