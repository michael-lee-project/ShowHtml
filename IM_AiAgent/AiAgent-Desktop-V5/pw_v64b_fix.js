// v64b fix: verify modals are inside .window
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/Users/michael/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:8323/messages.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  // Get .window box
  const win = await page.evaluate(() => {
    const w = document.querySelector('.window');
    const r = w.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  console.log('.window box:', win);

  // Click the products tab first
  const productsTab = await page.locator('[data-tab="products"]').first();
  if (await productsTab.count() > 0) {
    await productsTab.click();
    await page.waitForTimeout(300);
  }

  // Get .product-card to click
  const productCard = await page.locator('.product-card').first();
  await productCard.waitFor({ state: 'visible', timeout: 5000 });
  await productCard.click();
  await page.waitForTimeout(500);

  // Get productModal box (overlay + dialog)
  const productModalInfo = await page.evaluate(() => {
    const m = document.getElementById('productModal');
    const d = m.querySelector('.sales-modal__dialog');
    const o = m.querySelector('.sales-modal__overlay');
    const r1 = m.getBoundingClientRect();
    const r2 = d.getBoundingClientRect();
    const r3 = o.getBoundingClientRect();
    return {
      modal: { x: r1.x, y: r1.y, w: r1.width, h: r1.height },
      dialog: { x: r2.x, y: r2.y, w: r2.width, h: r2.height },
      overlay: { x: r3.x, y: r3.y, w: r3.width, h: r3.height },
      // Check parent chain
      parentClass: m.parentElement.className,
      parentTag: m.parentElement.tagName
    };
  });
  console.log('productModal:', JSON.stringify(productModalInfo, null, 2));

  // Verify: dialog should be inside .window box
  const dlg = productModalInfo.dialog;
  const insideX = dlg.x >= win.x && (dlg.x + dlg.w) <= (win.x + win.w);
  const insideY = dlg.y >= win.y && (dlg.y + dlg.h) <= (win.y + win.h);
  console.log('Dialog inside .window X:', insideX, 'Y:', insideY);

  // Verify: overlay should also be inside .window (or at least same as window)
  const ovl = productModalInfo.overlay;
  const ovlInsideX = ovl.x >= win.x - 1 && (ovl.x + ovl.w) <= (win.x + win.w) + 1;
  const ovlInsideY = ovl.y >= win.y - 1 && (ovl.y + ovl.h) <= (win.y + win.h) + 1;
  console.log('Overlay inside .window X:', ovlInsideX, 'Y:', ovlInsideY);

  // Screenshot
  await page.screenshot({ path: '/Users/michael/.mavis/tmp/mcp-images/mcp-image-8323-v64b-1-product.png' });
  console.log('Screenshot saved');

  // PASS criteria
  const pass = insideX && insideY && ovlInsideX && ovlInsideY && productModalInfo.parentClass === 'window';
  console.log('\n' + (pass ? '✓ PASS' : '✗ FAIL'));

  await browser.close();
  process.exit(pass ? 0 : 1);
})();
