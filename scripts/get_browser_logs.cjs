const { chromium } = require('playwright');

async function main() {
  try {
    // Connect to the existing browser instance on standard debug port 9222
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    const contexts = browser.contexts();
    if (contexts.length === 0) {
      console.log("No browser contexts found");
      return;
    }
    const pages = contexts[0].pages();
    console.log(`Found ${pages.length} pages:`);
    for (const page of pages) {
      console.log(`- Title: ${await page.title()}, URL: ${page.url()}`);
      if (page.url().includes('localhost:3000/borrow') || page.url().includes('vercel.app/borrow')) {
        console.log("Found active borrow page. Setting up console log listener...");
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
        
        // Retrieve current page console history
        const logs = await page.evaluate(() => {
          return window.__console_logs || [];
        });
        console.log("Stored Console logs:", logs);
        
        // Take a screenshot
        await page.screenshot({ path: 'c:/Users/Windows/credence-ai/artifacts/borrow_debug.png' });
        console.log("Screenshot saved to artifacts/borrow_debug.png");
      }
    }
  } catch (err) {
    console.error("Error connecting to browser:", err.message);
  }
}
main();
