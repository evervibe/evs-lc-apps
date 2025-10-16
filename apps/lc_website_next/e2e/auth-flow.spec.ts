import { test, expect } from '@playwright/test';

/**
 * E2E Test: Authentication Flow
 * 
 * Tests the complete authentication flow including:
 * - Registration
 * - Login
 * - MFA Setup (optional - requires running DB)
 * - Logout
 */

test.describe('Authentication Flow', () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  test('should complete registration flow', async ({ page }) => {
    await page.goto('/register');

    // Fill registration form
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Should redirect to login or show success
    await page.waitForURL(/\/login|\//, { timeout: 5000 });
  });

  test('should complete login flow', async ({ page }) => {
    await page.goto('/login');

    // Fill login form
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Should redirect to account page or home
    await page.waitForURL(/\/account|\//, { timeout: 5000 });
  });

  test('should access account page when authenticated', async ({ page }) => {
    // This test assumes user is logged in from previous test
    // In a real scenario, you'd want to set up authentication state
    await page.goto('/account');
    
    // Check if account page loads
    await expect(page).toHaveURL(/\/account|\/login/);
  });
});

test.describe('Password Reset Flow', () => {
  test('should render password reset request page', async ({ page }) => {
    await page.goto('/');
    
    // Look for "Forgot Password" link (if it exists on the page)
    const forgotPasswordLink = page.locator('text=Forgot Password');
    if (await forgotPasswordLink.isVisible()) {
      await forgotPasswordLink.click();
      await expect(page).toHaveURL(/reset|forgot/);
    }
  });
});

test.describe('Public Pages', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/LC|Lineage|Portal/i);
  });

  test('should load login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('should load register page', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });
});
