import { test } from '@playwright/test';

test('analyze arvio website animations', async ({ page }) => {
  // Navigate to the website
  await page.goto('https://arvio.framer.website/');
  await page.waitForLoadState('networkidle');

  // Take initial screenshot
  await page.screenshot({ path: 'test-results/arvio-initial.png', fullPage: true });

  console.log('=== ANALYZING ARVIO WEBSITE ANIMATIONS ===');

  // 1. Check for loading animations
  console.log('\n1. PAGE LOAD ANIMATIONS:');
  
  // Wait for any initial animations to complete
  await page.waitForTimeout(2000);
  
  // Check for animated elements on load
  const animatedElements = await page.locator('[style*="transform"], [style*="opacity"], [class*="animate"], [class*="fade"], [class*="slide"]').count();
  console.log(`- Found ${animatedElements} potentially animated elements`);

  // 2. Analyze scroll animations
  console.log('\n2. SCROLL ANIMATIONS:');
  
  // Get page height for scrolling
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log(`- Page height: ${pageHeight}px`);
  
  // Scroll through the page and observe changes
  const sections = await page.locator('section, .section, div[class*="section"]').count();
  console.log(`- Found ${sections} sections`);
  
  // Scroll to different positions and take screenshots
  for (let i = 0; i <= 3; i++) {
    const scrollPosition = (pageHeight / 3) * i;
    await page.evaluate((pos) => window.scrollTo(0, pos), scrollPosition);
    await page.waitForTimeout(1000); // Wait for scroll animations
    
    console.log(`- Scrolled to position: ${scrollPosition}px`);
    
    // Check for elements that might be animating in
    const visibleElements = await page.locator('[style*="transform: translate"], [style*="opacity"]').count();
    console.log(`  - Elements with transform/opacity: ${visibleElements}`);
  }

  // 3. Check hover animations
  console.log('\n3. HOVER ANIMATIONS:');
  
  // Find interactive elements
  const buttons = await page.locator('button, a, [class*="button"], [role="button"]').all();
  console.log(`- Found ${buttons.length} interactive elements`);
  
  for (let i = 0; i < Math.min(buttons.length, 5); i++) {
    const button = buttons[i];
    const buttonText = await button.textContent() || `Button ${i}`;
    
    try {
      // Get initial styles
      const initialStyles = await button.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          transform: styles.transform,
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          boxShadow: styles.boxShadow,
          scale: styles.scale
        };
      });
      
      // Hover over the element
      await button.hover();
      await page.waitForTimeout(300);
      
      // Get styles after hover
      const hoverStyles = await button.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          transform: styles.transform,
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          boxShadow: styles.boxShadow,
          scale: styles.scale
        };
      });
      
      // Compare styles
      const hasHoverEffect = JSON.stringify(initialStyles) !== JSON.stringify(hoverStyles);
      console.log(`  - "${buttonText.slice(0, 30)}": ${hasHoverEffect ? 'HAS HOVER EFFECT' : 'no hover effect'}`);
      
      if (hasHoverEffect) {
        console.log(`    Initial: ${JSON.stringify(initialStyles, null, 2)}`);
        console.log(`    Hover: ${JSON.stringify(hoverStyles, null, 2)}`);
      }
      
    } catch {
      console.log(`  - "${buttonText}": Could not analyze hover effect`);
    }
  }

  // 4. Check for text animations
  console.log('\n4. TEXT ANIMATIONS:');
  
  // Look for text elements that might be animated
  const textElements = await page.locator('h1, h2, h3, p, span').all();
  let animatedTextCount = 0;
  
  for (const element of textElements.slice(0, 10)) {
    const hasAnimation = await element.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.animation !== 'none' || styles.transition !== 'none';
    });
    
    if (hasAnimation) animatedTextCount++;
  }
  
  console.log(`- Found ${animatedTextCount} text elements with animations/transitions`);

  // 5. Check for CSS animations and transitions
  console.log('\n5. CSS ANIMATIONS & TRANSITIONS:');
  
  const animationInfo = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    let animatedCount = 0;
    let transitionCount = 0;
    const animations = [];
    
    elements.forEach((el) => {
      const styles = window.getComputedStyle(el);
      
      if (styles.animation && styles.animation !== 'none') {
        animatedCount++;
        animations.push({
          element: el.tagName,
          animation: styles.animation,
          className: el.className
        });
      }
      
      if (styles.transition && styles.transition !== 'none' && styles.transition !== 'all 0s ease 0s') {
        transitionCount++;
      }
    });
    
    return { animatedCount, transitionCount, animations: animations.slice(0, 5) };
  });
  
  console.log(`- Elements with CSS animations: ${animationInfo.animatedCount}`);
  console.log(`- Elements with CSS transitions: ${animationInfo.transitionCount}`);
  console.log('- Sample animations found:');
  animationInfo.animations.forEach((anim, index) => {
    console.log(`  ${index + 1}. ${anim.element} (${anim.className}): ${anim.animation}`);
  });

  // 6. Check for Framer Motion or other animation libraries
  console.log('\n6. ANIMATION LIBRARIES:');
  
  const libraries = await page.evaluate(() => {
    const found = [];
    
    // Check for Framer Motion
    if (window.FramerMotion || document.querySelector('[data-framer-component]')) {
      found.push('Framer Motion');
    }
    
    // Check for GSAP
    if (window.gsap || window.TweenMax) {
      found.push('GSAP');
    }
    
    // Check for Lottie
    if (window.lottie || document.querySelector('[data-animation-path]')) {
      found.push('Lottie');
    }
    
    // Check for AOS (Animate On Scroll)
    if (window.AOS || document.querySelector('[data-aos]')) {
      found.push('AOS');
    }
    
    return found;
  });
  
  console.log(`- Animation libraries detected: ${libraries.length > 0 ? libraries.join(', ') : 'None detected'}`);

  // Take final screenshot
  await page.screenshot({ path: 'test-results/arvio-final.png', fullPage: true });
  
  console.log('\n=== ANALYSIS COMPLETE ===');
  console.log('Screenshots saved in test-results/ folder');
});
