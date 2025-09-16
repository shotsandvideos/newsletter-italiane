import { chromium } from 'playwright';

async function testAuth() {
  console.log('🚀 Starting authentication test...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    if (msg.type() === 'log') {
      console.log('Browser console:', msg.text());
    }
  });
  
  try {
    // Test 1: Check current session
    console.log('📍 Test 1: Checking for existing session...');
    await page.goto('http://localhost:3000/test-simple-login');
    await page.waitForLoadState('networkidle');
    
    // Check initial status
    const initialStatus = await page.textContent('span.text-yellow-400');
    console.log(`Initial status: ${initialStatus}\n`);
    
    // Click Check Session
    await page.click('button:has-text("Check Session")');
    await page.waitForTimeout(1000);
    
    const sessionStatus = await page.textContent('span.text-yellow-400');
    console.log(`Session check result: ${sessionStatus}\n`);
    
    // Test 2: Try to create user
    console.log('📍 Test 2: Creating test user...');
    await page.goto('http://localhost:3000/create-test-user');
    await page.waitForLoadState('networkidle');
    
    // Check if user already exists
    await page.click('button:has-text("Try Login Only")');
    await page.waitForTimeout(2000);
    
    // Check status after login attempt
    const loginStatus = await page.locator('.text-green-400, .text-red-400, .text-yellow-400').first().textContent().catch(() => null);
    console.log(`Login attempt result: ${loginStatus}\n`);
    
    if (!loginStatus || loginStatus.includes('failed') || loginStatus.includes('error')) {
      console.log('User does not exist, creating...');
      await page.click('button:has-text("Create Test User & Auto Login")');
      await page.waitForTimeout(5000);
      
      const createStatus = await page.locator('.text-green-400, .text-red-400').first().textContent().catch(() => null);
      console.log(`Create user result: ${createStatus}\n`);
    }
    
    // Test 3: Check if redirected to dashboard
    console.log('📍 Test 3: Checking if redirected to dashboard...');
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('/dashboard')) {
      console.log('✅ Successfully redirected to dashboard!\n');
      
      // Check dashboard content
      const dashboardText = await page.textContent('body');
      if (dashboardText.includes('No user found')) {
        console.log('❌ Dashboard shows "No user found"\n');
      } else if (dashboardText.includes('Ciao')) {
        console.log('✅ Dashboard loaded with user!\n');
      }
    } else if (currentUrl.includes('/auth/sign-in')) {
      console.log('❌ Redirected to sign-in page\n');
    }
    
    // Test 4: Go back and check session persistence
    console.log('📍 Test 4: Checking session persistence...');
    await page.goto('http://localhost:3000/test-simple-login');
    await page.waitForLoadState('networkidle');
    
    await page.click('button:has-text("Check Session")');
    await page.waitForTimeout(1000);
    
    const finalSessionStatus = await page.textContent('span.text-yellow-400');
    console.log(`Final session status: ${finalSessionStatus}\n`);
    
    // Test 5: Check debug page
    console.log('📍 Test 5: Checking debug page...');
    await page.goto('http://localhost:3000/debug-auth');
    await page.waitForLoadState('networkidle');
    
    await page.click('button:has-text("Refresh Status")');
    await page.waitForTimeout(2000);
    
    // Get all status values
    const statusRows = await page.$$('.border-b.border-slate-700');
    console.log('Debug page status:');
    for (const row of statusRows) {
      const key = await row.$eval('.text-gray-400', el => el.textContent).catch(() => null);
      const value = await row.$eval('span:last-child', el => el.textContent).catch(() => null);
      if (key && value) {
        console.log(`  ${key} ${value}`);
      }
    }
    
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    console.log('\n🏁 Test completed. Keeping browser open for manual inspection...');
    console.log('Press Ctrl+C to close.');
    
    // Keep browser open
    await new Promise(() => {});
  }
}

// Run the test
testAuth().catch(console.error);