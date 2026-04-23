import { test, expect } from "@playwright/test";
import { setupBaseMocks, setFakeSession, waitForApp } from "./helpers.js";

// ─── Тест 6: Успешная отправка отзыва ─────────────────────────────────────────

test("Успешная отправка отзыва", async ({ page }) => {
  // Инжектируем fake-сессию ДО загрузки страницы
  await setFakeSession(page);
  await setupBaseMocks(page);

  await page.goto("/");
  await waitForApp(page);

  // Переходим на страницу отправки отзыва
  await page.click('[data-testid="nav-submit"]');
  await expect(page.locator("h1")).toContainText("Leave a Review");

  // Заполняем форму
  await page.fill('[data-testid="submit-name"]', "Alex Tester");
  await page.fill(
    '[data-testid="submit-message"]',
    "This is a great platform, very useful for collecting feedback!",
  );

  // Ставим оценку 5 звёзд
  await page.click('[data-testid="star-5"]');

  // Отправляем форму
  await page.click('[data-testid="submit-button"]');

  // Экран успешной отправки появляется (форма показывает success через 700мс)
  await expect(page.locator('[data-testid="submit-success"]')).toBeVisible({
    timeout: 3000,
  });
});

// ─── Тест 7: Ошибка отправки формы (валидация) ────────────────────────────────

test("Ошибка отправки формы — пустые обязательные поля", async ({ page }) => {
  await setFakeSession(page);
  await setupBaseMocks(page);

  await page.goto("/");
  await waitForApp(page);

  // Переходим на страницу отправки отзыва
  await page.click('[data-testid="nav-submit"]');
  await expect(page.locator("h1")).toContainText("Leave a Review");

  // Нажимаем Submit без заполнения полей
  await page.click('[data-testid="submit-button"]');

  // Ошибки валидации видны
  await expect(
    page.locator('[data-testid="submit-name-error"]'),
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="submit-message-error"]'),
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="submit-rating-error"]'),
  ).toBeVisible();

  // Форма всё ещё отображается (success-экран не показан)
  await expect(page.locator('[data-testid="submit-success"]')).not.toBeVisible();
});
