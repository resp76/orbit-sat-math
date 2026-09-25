import { expect, test } from '@playwright/test';

async function onboard(page, name = 'Avery') {
  await page.goto('/sat/');
  const dialog = page.getByRole('dialog', { name: /make 680 feel possible/i });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel(/what should we call you/i).fill(name);
  await dialog.getByRole('button', { name: 'Continue' }).click();
  await dialog.getByLabel(/latest math score/i).fill('540');
  await dialog.getByLabel(/goal math score/i).fill('680');
  await dialog.getByRole('button', { name: /build my study plan/i }).click();
  await expect(dialog).toBeHidden();
}

test('onboards a learner and preserves the personalized goal', async ({ page }) => {
  await onboard(page);
  await expect(page.getByRole('heading', { name: /next 140 points, Avery/i })).toBeVisible();
  await expect(page.locator('#goal-current')).toHaveText('540');
  await expect(page.locator('#goal-target')).toHaveText('680');
  await page.reload();
  await expect(page.getByRole('dialog', { name: /make 680 feel possible/i })).toBeHidden();
  await expect(page.getByRole('heading', { name: /Avery/i })).toBeVisible();
});

test('completes the diagnostic and starts a focused drill', async ({ page }) => {
  await onboard(page);
  await page.getByRole('button', { name: /start diagnostic/i }).click();
  const diagnostic = page.locator('#diagnostic-dialog');
  await expect(diagnostic).toBeVisible();
  await diagnostic.getByRole('button', { name: /begin diagnostic/i }).click();
  for (let index = 0; index < 8; index += 1) {
    await diagnostic.locator('[data-diagnostic-answer="0"]').click();
    await diagnostic.getByRole('button', { name: index === 7 ? /see my plan/i : /next question/i }).click();
  }
  await expect(diagnostic.getByRole('heading', { name: /starting path is ready/i })).toBeVisible();
  await diagnostic.getByRole('button', { name: /first focused drill/i }).click();
  await expect(page.getByRole('heading', { name: /Practice with purpose/i })).toBeVisible();
  await expect(page.locator('#question-card .question-prompt')).toBeVisible();
});

test('coaches a practice answer and records review and progress', async ({ page }) => {
  await onboard(page);
  await page.getByRole('button', { name: 'Practice', exact: true }).click();
  await page.getByRole('button', { name: /start smart practice/i }).click();
  await page.getByRole('button', { name: /give me a hint/i }).click();
  await expect(page.locator('.hint-box')).toContainText('Tutor hint');
  await page.locator('[data-answer="0"]').click();
  await page.getByRole('button', { name: /check answer/i }).click();
  await expect(page.locator('.feedback-box')).toBeVisible();
  await page.getByRole('button', { name: 'Progress', exact: true }).click();
  await expect(page.getByText('Minutes practiced')).toBeVisible();
  await expect(page.locator('#history-list .history-row')).toHaveCount(1);
});

test('works as a mobile app with bottom navigation and settings', async ({ page }) => {
  await onboard(page, 'Mia');
  const mobileNav = page.locator('.mobile-nav');
  await expect(mobileNav).toBeVisible();
  await mobileNav.getByRole('button', { name: /review/i }).click();
  await expect(page.getByRole('heading', { name: /Turn misses into points/i })).toBeVisible();
  await page.getByRole('button', { name: /open learner settings/i }).click();
  await expect(page.getByRole('heading', { name: /learner settings/i })).toBeVisible();
  await expect(page.getByLabel('First name')).toHaveValue('Mia');
});
