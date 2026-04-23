import { test, expect } from "@playwright/test";
import { setupBaseMocks, setFakeSession, waitForApp, FAKE_USER } from "./helpers.js";

// ─── Вспомогательные функции навигации ───────────────────────────────────────

async function goToLoginPage(page) {
  await page.click('[data-testid="nav-sign-in"]');
  await expect(page.locator("h1")).toContainText("Sign In");
}

async function goToRegisterPage(page) {
  await goToLoginPage(page);
  await page.click('button:has-text("Sign up")');
  await expect(page.locator("h1")).toContainText("Sign Up");
}

// ─── Тест 1: Успешная регистрация ─────────────────────────────────────────────

test("Успешная регистрация", async ({ page }) => {
  await setupBaseMocks(page);

  // Мок API регистрации
  await page.route(/auth\/v1\/signup/, (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        user: FAKE_USER,
        session: null,
      }),
    });
  });

  await page.goto("/");
  await waitForApp(page);
  await goToRegisterPage(page);

  await page.fill('[data-testid="register-email"]', "newuser@example.com");
  await page.fill('[data-testid="register-password"]', "SecurePass@123");
  await page.click('[data-testid="register-submit"]');

  // После успешной регистрации — редирект на страницу Sign In
  await expect(page.locator("h1")).toContainText("Sign In", { timeout: 5000 });
});

// ─── Тест 2: Ошибка регистрации ───────────────────────────────────────────────

test("Ошибка регистрации — пустые и некорректные данные", async ({ page }) => {
  await setupBaseMocks(page);
  await page.goto("/");
  await waitForApp(page);
  await goToRegisterPage(page);

  // Отправка с пустыми полями
  await page.click('[data-testid="register-submit"]');
  await expect(
    page.locator('[data-testid="register-email-error"]'),
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="register-password-error"]'),
  ).toBeVisible();

  // Невалидный email
  await page.fill('[data-testid="register-email"]', "notanemail");
  await page.fill('[data-testid="register-password"]', "123"); // слишком короткий
  await page.click('[data-testid="register-submit"]');
  await expect(
    page.locator('[data-testid="register-email-error"]'),
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="register-password-error"]'),
  ).toBeVisible();

  // Форма всё ещё на странице регистрации
  await expect(page.locator("h1")).toContainText("Sign Up");
});

// ─── Тест 3: Успешный вход ────────────────────────────────────────────────────

test("Успешный вход", async ({ page }) => {
  await setupBaseMocks(page);

  // Мок API логина
  await page.route(/auth\/v1\/token\?grant_type=password/, (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        access_token: "fake-access-token",
        token_type: "bearer",
        expires_in: 3600,
        expires_at: 9999999999,
        refresh_token: "fake-refresh-token",
        user: FAKE_USER,
      }),
    });
  });

  await page.goto("/");
  await waitForApp(page);
  await goToLoginPage(page);

  await page.fill('[data-testid="login-email"]', "test@example.com");
  await page.fill('[data-testid="login-password"]', "Password@123");
  await page.click('[data-testid="login-submit"]');

  // После успешного входа — WallPage
  await expect(page.locator('[data-testid="wall-page"]')).toBeVisible({
    timeout: 5000,
  });
});

// ─── Тест 4: Ошибка входа ─────────────────────────────────────────────────────

test("Ошибка входа — неверный пароль", async ({ page }) => {
  await setupBaseMocks(page);

  // Мок API логина — ошибка аутентификации
  await page.route(/auth\/v1\/token\?grant_type=password/, (route) => {
    route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({
        error: "invalid_grant",
        error_description: "Invalid login credentials",
      }),
    });
  });

  await page.goto("/");
  await waitForApp(page);
  await goToLoginPage(page);

  await page.fill('[data-testid="login-email"]', "test@example.com");
  await page.fill('[data-testid="login-password"]', "WrongPassword@1");
  await page.click('[data-testid="login-submit"]');

  // Сообщение об ошибке видно
  await expect(page.locator('[data-testid="login-auth-error"]')).toBeVisible({
    timeout: 5000,
  });
  // Остаёмся на странице Sign In
  await expect(page.locator("h1")).toContainText("Sign In");
});

// ─── Тест 5: Вход через Google (открытие OAuth) ───────────────────────────────

test("Вход через Google (открытие OAuth)", async ({ page }) => {
  await setupBaseMocks(page);
  await page.goto("/");
  await waitForApp(page);
  await goToLoginPage(page);

  let capturedOAuthUrl = "";

  // Перехватываем навигацию на Supabase OAuth endpoint
  await page.route(/auth\/v1\/authorize/, (route) => {
    capturedOAuthUrl = route.request().url();
    // Прерываем навигацию — остаёмся на странице
    route.abort();
  });

  // Игнорируем возможную ошибку навигации после abort()
  await page
    .click('[data-testid="login-google"]')
    .catch(() => {});

  // Ждём, пока перехватчик сработает
  await page.waitForTimeout(1000);

  // URL содержит provider=google
  expect(capturedOAuthUrl).toMatch(/provider=google/i);
});
