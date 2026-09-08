import fs from 'fs';
import path from 'path';

describe('static Coming Soon campaign page', () => {
  const page = fs.readFileSync(path.join(process.cwd(), 'public/coming-soon/index.html'), 'utf8');
  const apiPage = fs.readFileSync(path.join(process.cwd(), 'api/coming-soon.js'), 'utf8');
  const vercelConfig = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'vercel.json'), 'utf8'),
  ) as { routes: { src?: string; dest?: string; handle?: string }[] };

  it('ends on the launch status without duplicate footer branding', () => {
    expect(page).toContain('BUILT FOR BUILDERS.');
    expect(page).not.toContain('COMING SOON');
    expect(page).not.toContain('<footer>');
    expect(page).not.toContain('THE CAR CULTURE PLATFORM</p>');
    expect(page).not.toContain('The OS for Automotive Builders.</p>');
    expect(page).not.toContain('Built for the culture, not the algorithms.</p>');
  });

  it('keeps the Vercel route response free of duplicate footer branding', () => {
    expect(apiPage).toContain('BUILT FOR BUILDERS.');
    expect(apiPage).not.toContain('COMING SOON');
    expect(apiPage).not.toContain('<footer>');
    expect(apiPage).not.toContain('THE CAR CULTURE PLATFORM</p>');
    expect(apiPage).not.toContain('The OS for Automotive Builders.</p>');
    expect(apiPage).not.toContain('Built for the culture, not the algorithms.</p>');
  });

  it('loads the same managed Kit launch-list form in both public implementations', () => {
    const embed = '<script async data-uid="9cf45d2196" src="https://wrnc.kit.com/9cf45d2196/index.js"></script>';

    expect(page).toContain(embed);
    expect(apiPage).toContain(embed);
    expect(page.match(/9cf45d2196\/index\.js/g)).toHaveLength(1);
    expect(apiPage.match(/9cf45d2196\/index\.js/g)).toHaveLength(1);
  });

  it('puts signup before the closing brand signature', () => {
    expect(page.indexOf('class="launch-list"')).toBeLessThan(page.indexOf('class="status"'));
    expect(apiPage.indexOf('class="launch-list"')).toBeLessThan(apiPage.indexOf('class="status"'));
  });

  it('optimizes the injected email field and preserves large controls', () => {
    for (const implementation of [page, apiPage]) {
      expect(implementation).toMatch(/input\.setAttribute\('type',\s*'email'\)/);
      expect(implementation).toMatch(/input\.setAttribute\('autocomplete',\s*'email'\)/);
      expect(implementation).toMatch(/min-height:\s*52px\s*!important/);
      expect(implementation).toMatch(/outline:\s*3px solid rgba\(255,\s*100,\s*0/);
    }
  });

  it('identifies the root URL as the canonical public landing page', () => {
    expect(page).toContain('<link rel="canonical" href="https://wrnc.app/" />');
    expect(apiPage).toContain('<link rel="canonical" href="https://wrnc.app/" />');
  });

  it('uses a logo path that works in both direct file previews and hosted delivery', () => {
    expect(page).toContain('src="../wrnc-logo.png"');
    expect(page).not.toContain('src="/wrnc-logo.png"');
  });

  it('serves the landing page at the root without intercepting other application routes', () => {
    expect(vercelConfig.routes.slice(0, 2)).toEqual([
      { src: '/', dest: '/api/coming-soon' },
      { src: '/coming-soon', dest: '/api/coming-soon' },
    ]);
    expect(vercelConfig.routes).toContainEqual({ handle: 'filesystem' });
    expect(vercelConfig.routes).toContainEqual({ src: '/(.*)', dest: '/index.html' });
  });
});
