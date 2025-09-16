import { chromium } from 'playwright';

async function testCompleteNewsletterFlow() {
  console.log('🚀 Testing Complete Newsletter Flow\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'log') {
      console.log('[Browser]:', text);
    } else if (type === 'error') {
      console.log('[Browser ERROR]:', text);
    }
  });

  page.on('response', response => {
    if (response.url().includes('/api/')) {
      response.text().then(body => {
        console.log(`[API ${response.status()}] ${response.url()}`);
        if (body && response.status() !== 204) {
          try {
            const json = JSON.parse(body);
            console.log('Response:', JSON.stringify(json, null, 2));
          } catch {
            console.log('Response (text):', body.substring(0, 200));
          }
        }
      }).catch(() => {});
    }
  });
  
  try {
    // STEP 1: Login as regular user
    console.log('📍 STEP 1: Login as regular user (demo@frames.it)\n');
    await page.goto('http://localhost:3000/auth/sign-in');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[type="email"]', 'demo@frames.it');
    await page.fill('input[type="password"]', 'Demo123456!');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    console.log('✅ Logged in as user\n');
    
    // STEP 2: Check existing newsletters
    console.log('📍 STEP 2: Checking existing newsletters\n');
    await page.goto('http://localhost:3000/dashboard/newsletters');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Count existing newsletters
    const newsletterCards = await page.$$('.bg-white.rounded-lg.shadow');
    console.log(`Found ${newsletterCards.length} existing newsletters\n`);
    
    // STEP 3: Create a new newsletter
    console.log('📍 STEP 3: Creating new newsletter\n');
    
    // Check if "Add Newsletter" button exists
    const addButton = await page.$('a[href="/dashboard/newsletters/new"], button:has-text("Aggiungi Newsletter")');
    if (!addButton) {
      console.log('❌ Add Newsletter button not found\n');
      
      // Try to navigate directly
      await page.goto('http://localhost:3000/dashboard/newsletters/new');
      await page.waitForLoadState('networkidle');
    } else {
      await addButton.click();
      await page.waitForLoadState('networkidle');
    }
    
    // Check if form exists
    const formExists = await page.$('form');
    if (!formExists) {
      console.log('❌ Newsletter form not found. Page content:');
      const pageText = await page.textContent('body');
      console.log(pageText?.substring(0, 500));
      
      // Try to create via API directly
      console.log('\n📍 Trying to create newsletter via API\n');
      
      const newsletterData = {
        nome_newsletter: `Test Newsletter ${Date.now()}`,
        descrizione: 'Test newsletter created by Playwright for testing the flow',
        categoria: 'Technology',
        url_archivio: 'https://test.example.com',
        frequenza_invio: 'Settimanale',
        numero_iscritti: 1000,
        email_contatto: 'test@example.com'
      };
      
      const apiResponse = await page.evaluate(async (data) => {
        const response = await fetch('/api/newsletters', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        return {
          status: response.status,
          data: await response.json()
        };
      }, newsletterData);
      
      console.log('API Response:', apiResponse);
      
      if (apiResponse.status === 200 || apiResponse.status === 201) {
        console.log('✅ Newsletter created via API\n');
      } else {
        console.log('❌ Failed to create newsletter via API\n');
      }
    } else {
      // Fill the form
      const timestamp = Date.now();
      console.log('Filling newsletter form...\n');
      
      // Try different possible field names
      const fillField = async (selectors: string[], value: string) => {
        for (const selector of selectors) {
          const field = await page.$(selector);
          if (field) {
            await field.fill(value);
            return true;
          }
        }
        return false;
      };
      
      await fillField(['input[name="nome_newsletter"]', 'input[name="name"]', '#nome_newsletter'], `Test Newsletter ${timestamp}`);
      await fillField(['textarea[name="descrizione"]', 'textarea[name="description"]', '#descrizione'], 'Test description for Playwright test');
      await fillField(['input[name="categoria"]', 'input[name="category"]', '#categoria'], 'Technology');
      await fillField(['input[name="url_archivio"]', 'input[name="website"]', '#url_archivio'], 'https://test.example.com');
      await fillField(['input[name="frequenza_invio"]', 'input[name="frequency"]', '#frequenza_invio'], 'Settimanale');
      await fillField(['input[name="numero_iscritti"]', 'input[name="subscribers"]', '#numero_iscritti'], '1000');
      await fillField(['input[name="email_contatto"]', 'input[name="email"]', '#email_contatto'], 'test@example.com');
      
      // Submit form
      const submitButton = await page.$('button[type="submit"]');
      if (submitButton) {
        await submitButton.click();
        console.log('Form submitted\n');
        await page.waitForTimeout(3000);
      }
    }
    
    // STEP 4: Verify newsletter was created
    console.log('📍 STEP 4: Verifying newsletter creation\n');
    await page.goto('http://localhost:3000/dashboard/newsletters');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const newNewsletterCards = await page.$$('.bg-white.rounded-lg.shadow');
    console.log(`Now have ${newNewsletterCards.length} newsletters\n`);
    
    // STEP 5: Logout
    console.log('📍 STEP 5: Logging out\n');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // STEP 6: Create/Login as Admin
    console.log('📍 STEP 6: Creating/Login as Admin\n');
    await page.goto('http://localhost:3000/create-admin-user');
    await page.waitForLoadState('networkidle');
    
    await page.click('button:has-text("Create Admin User")');
    await page.waitForTimeout(3000);
    
    // Check if redirected or need to login
    if (!page.url().includes('/admin/newsletters')) {
      console.log('Logging in as admin...\n');
      await page.goto('http://localhost:3000/auth/sign-in');
      await page.fill('input[type="email"]', 'admin@frames.it');
      await page.fill('input[type="password"]', 'Admin123456!');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
    }
    
    // STEP 7: Check Admin Panel
    console.log('📍 STEP 7: Checking Admin Panel\n');
    await page.goto('http://localhost:3000/admin/newsletters');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check page content
    const adminPageText = await page.textContent('body');
    console.log('Admin page title:', await page.title());
    
    if (adminPageText?.includes('Gestione Newsletter')) {
      console.log('✅ Admin newsletter page loaded\n');
      
      // Look for newsletters in review
      const pendingSection = await page.$$('.bg-white.rounded-lg.border');
      console.log(`Found ${pendingSection.length} sections\n`);
      
      // Check filter buttons
      const filters = await page.$$('button:has-text("In revisione"), button:has-text("In Revisione")');
      if (filters.length > 0) {
        console.log('Found "In revisione" filter, clicking it...\n');
        await filters[0].click();
        await page.waitForTimeout(2000);
      }
      
      // Check for any newsletter items
      const newsletterItems = await page.$$('[class*="hover:bg-slate-50"]');
      console.log(`Found ${newsletterItems.length} newsletter items\n`);
      
      if (newsletterItems.length > 0) {
        for (let i = 0; i < Math.min(3, newsletterItems.length); i++) {
          const itemText = await newsletterItems[i].textContent();
          console.log(`Newsletter ${i + 1}: ${itemText?.substring(0, 100)}...\n`);
        }
      }
      
      // Check console for API calls
      console.log('Checking console for errors...\n');
      
    } else {
      console.log('❌ Admin panel not showing newsletter management\n');
      console.log('Page content preview:', adminPageText?.substring(0, 500));
    }
    
    // STEP 8: Direct API Check
    console.log('📍 STEP 8: Direct API Check\n');
    
    // Check user newsletters API
    const userNewsletters = await page.evaluate(async () => {
      const response = await fetch('/api/newsletters');
      return {
        status: response.status,
        data: await response.json()
      };
    });
    console.log('User newsletters API:', userNewsletters);
    
    // Check admin newsletters API
    const adminNewsletters = await page.evaluate(async () => {
      const response = await fetch('/api/admin/newsletters?status=pending');
      return {
        status: response.status,
        data: await response.json()
      };
    });
    console.log('\nAdmin newsletters API (pending):', adminNewsletters);
    
    // Check all newsletters
    const allNewsletters = await page.evaluate(async () => {
      const response = await fetch('/api/admin/newsletters?status=all');
      return {
        status: response.status,
        data: await response.json()
      };
    });
    console.log('\nAdmin newsletters API (all):', allNewsletters);
    
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    console.log('\n🏁 Test completed. Browser remains open for inspection.');
    console.log('Press Ctrl+C to close.\n');
    
    // Summary
    console.log('=== SUMMARY ===');
    console.log('1. Check if newsletters table exists in Supabase');
    console.log('2. Check if user can create newsletters');
    console.log('3. Check if admin can see pending newsletters');
    console.log('4. Check API responses above for errors\n');
    
    // Keep browser open
    await new Promise(() => {});
  }
}

// Run the test
testCompleteNewsletterFlow().catch(console.error);