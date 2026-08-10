import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Admin@123';

async function loginAsAdmin(page: any) {
  await page.goto(`${BASE_URL}/admin/login`);
  await page.locator('#admin-username').fill(ADMIN_USERNAME);
  await page.locator('#admin-password').fill(ADMIN_PASSWORD);
  await page.locator('#login-submit-btn').click();
  // Use glob pattern and a generous timeout for slower browsers (WebKit)
  await page.waitForURL('**/admin/dashboard', { timeout: 20_000 });
}

// Helper: selects the visible error alert div, excluding Next.js route announcer
const errorAlert = (page: any) =>
  page.locator('[role="alert"]:not([id="__next-route-announcer__"])');

// ─── Login Page ─────────────────────────────────────────────────────────────
test.describe('Admin Login Page', () => {
  test('displays the login form correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);

    // Brand visible
    await expect(page.getByText('Bhagyashree')).toBeVisible();

    // Form elements exist
    await expect(page.locator('#admin-username')).toBeVisible();
    await expect(page.locator('#admin-password')).toBeVisible();
    await expect(page.locator('#login-submit-btn')).toBeVisible();
  });

  test('shows error on empty form submission', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.locator('#login-submit-btn').click();
    await expect(errorAlert(page)).toContainText(/please enter both/i);
  });

  test('shows error on wrong credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.locator('#admin-username').fill('wronguser');
    await page.locator('#admin-password').fill('wrongpass');
    await page.locator('#login-submit-btn').click();
    await expect(errorAlert(page)).toBeVisible();
  });

  test('admin can log in with valid credentials', async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page).toHaveURL(/dashboard/);
  });

  test('password show/hide toggle works', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    const passwordInput = page.locator('#admin-password');

    // default type should be password
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle to reveal
    await page.getByRole('button', { name: /show password/i }).click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click toggle to hide again
    await page.getByRole('button', { name: /hide password/i }).click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});

// ─── Admin Dashboard ─────────────────────────────────────────────────────────
test.describe('Admin Dashboard', () => {
  test('redirects unauthenticated user to login', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/dashboard`);
    await expect(page).toHaveURL(/login/);
  });

  test('authenticated admin can access dashboard', async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page).toHaveURL(`${BASE_URL}/admin/dashboard`);
    // Sidebar should be visible
    await expect(page.getByText('Dashboard')).toBeVisible();
  });
});

// ─── Admin Sidebar Navigation ─────────────────────────────────────────────────
test.describe('Admin Sidebar Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('navigates to Projects section', async ({ page }) => {
    await page.getByRole('link', { name: /^projects$/i }).click();
    await expect(page).toHaveURL(/admin\/projects/);
  });

  test('navigates to Blogs section', async ({ page }) => {
    await page.getByRole('link', { name: /^blogs$/i }).click();
    await expect(page).toHaveURL(/admin\/blogs/);
  });

  test('navigates to Gallery section', async ({ page }) => {
    await page.getByRole('link', { name: /^gallery$/i }).click();
    await expect(page).toHaveURL(/admin\/gallery/);
  });

  test('navigates to Team Management section', async ({ page }) => {
    await page.getByRole('link', { name: /team management/i }).click();
    await expect(page).toHaveURL(/admin\/team/);
  });
});
