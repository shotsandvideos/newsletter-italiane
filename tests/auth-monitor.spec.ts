import { test, expect } from '@playwright/test'

test.describe('Authentication Flow Monitoring', () => {
  test('Admin login should redirect to /admin', async ({ page }) => {
    // Go to login page
    await page.goto('http://localhost:3000/auth/sign-in')
    
    // Fill in admin credentials (update with actual admin email)
    await page.fill('input[type="email"]', 'shotsandvideos@gmail.com')
    await page.fill('input[type="password"]', 'your_admin_password') // Update with actual password
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Wait for redirect - should go to /admin
    await page.waitForURL('**/admin', { timeout: 10000 })
    
    console.log('✅ Admin redirected to:', page.url())
    expect(page.url()).toContain('/admin')
  })

  test('Creator login should redirect to /dashboard', async ({ page }) => {
    // Go to login page
    await page.goto('http://localhost:3000/auth/sign-in')
    
    // Fill in creator credentials (update with actual creator email)
    await page.fill('input[type="email"]', 'creator@example.com')
    await page.fill('input[type="password"]', 'creator_password') // Update with actual password
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Wait for redirect - should go to /dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 })
    
    console.log('✅ Creator redirected to:', page.url())
    expect(page.url()).toContain('/dashboard')
  })

  test('Invalid credentials should stay on login page with error', async ({ page }) => {
    // Go to login page
    await page.goto('http://localhost:3000/auth/sign-in')
    
    // Fill in invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Wait for error message
    await page.waitForSelector('[role="alert"]', { timeout: 5000 })
    
    // Should still be on login page
    expect(page.url()).toContain('/auth/sign-in')
    
    // Error message should be visible
    const errorMessage = page.locator('[role="alert"]')
    await expect(errorMessage).toBeVisible()
    
    console.log('✅ Invalid credentials handled correctly - stayed on login page with error')
  })
})