const SUPABASE_PROJECT_REF = "placeholder";

export const FAKE_USER = {
  id: "test-user-id-12345",
  aud: "authenticated",
  role: "authenticated",
  email: "testuser@example.com",
  email_confirmed_at: "2024-01-01T00:00:00.000Z",
  app_metadata: { provider: "email", providers: ["email"] },
  user_metadata: {},
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
};

export const FAKE_SESSION = {
  access_token: "fake-access-token-for-testing",
  refresh_token: "fake-refresh-token",
  expires_at: 9999999999,
  expires_in: 9999999999,
  token_type: "bearer",
  user: FAKE_USER,
};

// Mock all Supabase REST and Auth endpoints needed for a basic page load.
export async function setupBaseMocks(page) {
  // Approved feedback list (GET with count)
  await page.route(/rest\/v1\/feedback/, (route) => {
    if (route.request().method() === "GET") {
      route.fulfill({
        status: 200,
        headers: { "content-range": "0-0/0" },
        contentType: "application/json",
        body: "[]",
      });
    } else if (route.request().method() === "POST") {
      route.fulfill({
        status: 201,
        contentType: "application/json",
        body: "[]",
      });
    } else {
      route.continue();
    }
  });

  // Categories
  await page.route(/rest\/v1\/categories/, (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ id: 1, name: "General" }]),
    });
  });

  // Profiles
  await page.route(/rest\/v1\/profiles/, (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: "[]",
    });
  });

  // Auth user endpoint (token validation)
  await page.route(/auth\/v1\/user/, (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(FAKE_USER),
    });
  });

  // Welcome email edge function
  await page.route(/functions\/v1\/send-welcome-email/, (route) => {
    route.fulfill({ status: 200, body: "{}" });
  });
}

// Wait for React to mount before interacting with the page.
export async function waitForApp(page) {
  await page.waitForSelector("#root > *");
}

// Inject a fake Supabase session into localStorage before the page loads.
export async function setFakeSession(page) {
  await page.addInitScript(
    ({ session, key }) => {
      window.localStorage.setItem(key, JSON.stringify(session));
    },
    {
      session: FAKE_SESSION,
      key: `sb-${SUPABASE_PROJECT_REF}-auth-token`,
    },
  );
}
