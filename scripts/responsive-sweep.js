// Responsive sweep: paste into the browser console on any page of the running site.
// Loads each page in hidden iframes at every test width (UI_UX_RULES.md 2.6) and reports
// page-level horizontal overflow, the elements causing it, and text smaller than 14px.
// Test harness only: the pixel widths here are viewport sizes, not styles.
(async () => {
  const PAGES = ['/', '/jadwal', '/faq', '/kontak', '/syarat-ketentuan', '/offline', '/halaman-tidak-ada'];
  const WIDTHS = [280, 320, 360, 390, 430, 600, 768, 1024, 1280, 1440, 1920, 2560, 3840];
  const MIN_TEXT_PX = 14;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const clips = el => {
    for (let a = el.parentElement; a && a.tagName !== 'BODY'; a = a.parentElement) {
      const o = getComputedStyle(a).overflowX;
      if (o !== 'visible') return true;
    }
    return false;
  };
  const report = [];
  for (const path of PAGES) {
    for (const w of WIDTHS) {
      const f = document.createElement('iframe');
      f.style.cssText = `position:fixed;left:-99999px;top:0;width:${w}px;height:800px;border:0`;
      f.src = path;
      document.body.appendChild(f);
      await new Promise(r => (f.onload = r));
      await wait(1500);
      const win = f.contentWindow, doc = f.contentDocument;
      for (let y = 0; y < doc.body.scrollHeight; y += 600) { win.scrollTo(0, y); await wait(60); }
      await wait(800);
      const pageWidth = Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth);
      const culprits = [...doc.body.querySelectorAll('*')]
        .filter(el => { const r = el.getBoundingClientRect(); return r.width && (r.right > w + 1 || r.left < -1) && !clips(el) && win.getComputedStyle(el).position !== 'fixed'; })
        .slice(0, 4).map(el => el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0].slice(0, 40));
      let small = new Set();
      const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const t = walker.currentNode, el = t.parentElement;
        if (!t.textContent.trim() || !el || !el.getClientRects().length) continue;
        const cs = win.getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none' || el.closest('[aria-hidden="true"]')) continue;
        if (parseFloat(cs.fontSize) < MIN_TEXT_PX) small.add(`${parseFloat(cs.fontSize)}px "${t.textContent.trim().slice(0, 20)}"`);
      }
      report.push({ path, w, overflow: pageWidth > w + 1 ? pageWidth - w : 0, culprits: culprits.join(' '), smallText: small.size, smallSample: [...small].slice(0, 3).join(' | ') });
      f.remove();
    }
  }
  window.__sweep = report;
  return report;
})();
