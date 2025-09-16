import { chromium } from 'playwright';

async function testNewsletterFlow() {
  console.log('🚀 Testing Newsletter Flow...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    if (msg.type() === 'log' || msg.type() === 'error') {
      console.log(`[Browser ${msg.type()}]:`, msg.text());
    }
  });

  page.on('response', response => {
    if (response.url().includes('/api/')) {
      console.log(`[API Response] ${response.url()} - Status: ${response.status()}`);
    }
  });
  
  try {
    // Step 1: Login as user
    console.log('📍 Step 1: Logging in as user...');
    await page.goto('http://localhost:3000/auth/sign-in');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[type="email"]', 'demo@frames.it');
    await page.fill('input[type="password"]', 'Demo123456!');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    console.log('✅ Logged in and redirected to dashboard\n');
    
    // Step 2: Check if test newsletter exists
    console.log('📍 Step 2: Checking for existing newsletters...');
    await page.goto('http://localhost:3000/dashboard/newsletters');
    await page.waitForLoadState('networkidle');
    
    const newsletterCards = await page.$$('.rounded-lg.border');
    console.log(`Found ${newsletterCards.length} newsletters\n`);
    
    // Get newsletter details if any exist
    for (const card of newsletterCards) {
      const title = await card.$eval('h3', el => el.textContent).catch(() => 'N/A');
      const status = await card.$eval('span', el => el.textContent).catch(() => 'N/A');
      console.log(`  - ${title}: ${status}`);
    }
    
    // Step 3: Create a new test newsletter
    console.log('\n📍 Step 3: Creating test newsletter...');
    await page.goto('http://localhost:3000/dashboard/newsletters/new');
    await page.waitForLoadState('networkidle');
    
    // Fill form
    const testData = {
      name: `Test Newsletter ${Date.now()}`,
      description: 'This is a test newsletter created by Playwright',
      category: 'Technology',
      website: 'https://test.example.com',
      frequency: 'Weekly',
      subscribers: '1000',
      email: 'test@example.com'
    };
    
    console.log('Filling form with:', testData);
    
    await page.fill('input[name="name"]', testData.name);
    await page.fill('textarea[name="description"]', testData.description);
    await page.fill('input[name="category"]', testData.category);
    await page.fill('input[name="website"]', testData.website);
    await page.fill('input[name="frequency"]', testData.frequency);
    await page.fill('input[name="subscribers"]', testData.subscribers);
    await page.fill('input[name="email_contatto"]', testData.email);
    
    // Submit form
    await page.click('button[type="submit"]');
    console.log('Form submitted, waiting for response...\n');
    
    // Wait for redirect or success message
    await page.waitForTimeout(3000);
    
    // Step 4: Verify newsletter was created
    console.log('📍 Step 4: Verifying newsletter creation...');
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('success=newsletter-created')) {
      console.log('✅ Newsletter created successfully!\n');
    }
    
    // Go back to newsletters list
    await page.goto('http://localhost:3000/dashboard/newsletters');
    await page.waitForLoadState('networkidle');
    
    const newNewsletterCards = await page.$$('.rounded-lg.border');
    console.log(`Now have ${newNewsletterCards.length} newsletters\n`);
    
    // Step 5: Check Admin Dashboard
    console.log('📍 Step 5: Checking Admin Dashboard...');
    await page.goto('http://localhost:3000/admin');
    await page.waitForLoadState('networkidle');
    
    // Check if we're redirected to login
    const adminUrl = page.url();
    if (adminUrl.includes('/admin/login')) {
      console.log('Need to login as admin...');
      
      // Try admin login
      await page.fill('input[type="email"]', 'admin@frames.it');
      await page.fill('input[type="password"]', 'Admin123456!');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
    }
    
    // Check admin dashboard content
    const adminContent = await page.textContent('body');
    if (adminContent.includes('In Review') || adminContent.includes('In Revisione')) {
      console.log('✅ Found "In Review" section\n');
      
      // Look for newsletters in review
      const reviewSection = await page.$$('[data-testid="review-section"], .bg-white.rounded-lg');
      console.log(`Found ${reviewSection.length} review sections`);
      
      // Get all newsletter items in admin
      const adminNewsletters = await page.$$eval('h3, .font-semibold', 
        elements => elements.map(el => el.textContent)
      );
      
      console.log('Newsletters in admin dashboard:');
      adminNewsletters.forEach(n => console.log(`  - ${n}`));
    } else {
      console.log('❌ No "In Review" section found in admin dashboard\n');
    }
    
    // Step 6: Direct database check
    console.log('\n📍 Step 6: Checking database directly...');
    await page.goto('http://localhost:3000/setup-database');
    await page.click('button:has-text("Check & Setup Database")');
    await page.waitForTimeout(3000);
    
    const dbStatus = await page.textContent('.font-mono');
    console.log('Database status:', dbStatus.includes('✅ Newsletters table exists') ? 'Table exists' : 'Table missing');
    
    // Step 7: Check API endpoint directly
    console.log('\n📍 Step 7: Checking API endpoints...');
    const apiResponse = await page.evaluate(async () => {
      const response = await fetch('/api/newsletters');
      const data = await response.json();
      return data;
    });
    
    console.log('API /api/newsletters response:', apiResponse);
    
    if (apiResponse.data && Array.isArray(apiResponse.data)) {
      console.log(`Found ${apiResponse.data.length} newsletters via API`);
      apiResponse.data.forEach((n: any) => {
        console.log(`  - ${n.name}: ${n.status}`);
      });
    }
    
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    console.log('\n🏁 Test completed. Keeping browser open...');
    console.log('Press Ctrl+C to close.');
    
    // Keep browser open
    await new Promise(() => {});
  }
}

// Run the test
testNewsletterFlow().catch(console.error);