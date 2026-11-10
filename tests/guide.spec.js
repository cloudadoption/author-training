/* eslint-env node */
const { test, expect } = require('@playwright/test');
const { readdir, readFile } = require('node:fs/promises');
const path = require('node:path');

async function openGuide(page, url = '/') {
  await page.goto(url);
  await expect(page.locator('body')).toHaveClass(/appear/);
  await expect(page.locator('.header')).toHaveAttribute('data-block-status', 'loaded');
  await expect(page.locator('.footer')).toHaveAttribute('data-block-status', 'loaded');
}

test('topics filter across titles, descriptions and categories, with recovery', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await openGuide(page);
  const search = page.getByRole('searchbox', { name: 'Search topics' });
  const topics = page.locator('.guide-topics-group li:visible');
  await expect(topics).toHaveCount(12);
  await search.fill('  GETTING   first  ');
  await expect(topics).toHaveCount(1);
  await expect(topics).toContainText('Create your first page');
  await expect(page.getByRole('status')).toHaveText('1 topic found');
  await search.fill('<img src=x onerror=alert(1)>');
  await expect(topics).toHaveCount(0);
  await expect(page.getByText('No matching topics.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(search).toBeFocused();
  await expect(topics).toHaveCount(12);
  await search.fill('   ');
  await expect(topics).toHaveCount(12);
  await expect(page.locator('a.button.primary', { hasText: 'Create your first page' })).toBeVisible();
  await expect(page).toHaveTitle('Experience Workspace author guide');
  expect(errors).toEqual([]);
});

test('workspace override reaches both buttons and survives guide navigation', async ({ page }) => {
  const workspace = 'https://da.live/?view=recent&sort=name#/example/training';
  const query = new URLSearchParams({ workspace }).toString();
  await openGuide(page, `/?${query}`);
  const headerWorkspace = page.getByRole('link', { name: 'Open workspace', exact: true });
  await expect(headerWorkspace).toHaveAttribute('href', workspace);
  await expect(page.getByRole('link', { name: 'Open your workspace', exact: true }))
    .toHaveAttribute('href', workspace);
  await expect(page.getByRole('link', { name: 'Platform docs', exact: true }))
    .toHaveAttribute('href', 'https://www.aem.live/docs/ew/authoring');
  await Promise.all([
    '.guide-sidebar a[href*="/docs/enablement/assistant"]',
    'header a[href*="/docs/enablement/block-library"]',
    'footer a[href*="/docs/enablement/maintaining"]',
  ].map((selector) => expect(page.locator(selector)).toHaveAttribute('href', /workspace=/)));
  await page.locator('a.button.primary', { hasText: 'Create your first page' }).click();
  await expect(page).toHaveURL(new URL(`/docs/enablement/first-page?${query}`, page.url()).href);
  await expect(headerWorkspace).toHaveAttribute('href', workspace);
  await page.getByRole('navigation', { name: 'Lessons', exact: true })
    .getByRole('link', { name: /Next/ }).click();
  await expect(page).toHaveURL(/\/formatting\?workspace=/);
  expect(new URL(page.url()).searchParams.get('workspace')).toBe(workspace);
  await page.setViewportSize({ width: 1440, height: 1000 });
  const contents = page.getByRole('navigation', { name: 'On this page', exact: true });
  const headingLink = contents.getByRole('link', { name: 'Turn a standalone link into a button' });
  await expect(headingLink).toHaveAttribute('href', /^#/);
  await headingLink.click();
  expect(new URL(page.url()).searchParams.get('workspace')).toBe(workspace);
  await page.getByRole('navigation', { name: 'Breadcrumb', exact: true })
    .getByRole('link', { name: 'Author guide', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Open your workspace', exact: true }))
    .toHaveAttribute('href', workspace);
  await openGuide(page);
  await expect(headerWorkspace).toHaveAttribute('href', 'https://da.live/#/cloudadoption/author-training');
  await expect(page.getByRole('link', { name: 'Open your workspace', exact: true }))
    .toHaveAttribute('href', 'https://da.live/#/cloudadoption/author-training');
});

test('workspace shorthand expands CTA targets and stays short across both guides', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const workspace = 'volvogroup/www-partsasist-com';
  const destination = `https://da.live/#/${workspace}`;
  await openGuide(page, `/?workspace=${workspace}`);
  await expect(page.getByRole('link', { name: 'Open workspace', exact: true }))
    .toHaveAttribute('href', destination);
  await expect(page.getByRole('link', { name: 'Open your workspace', exact: true }))
    .toHaveAttribute('href', destination);
  await page.locator('a.button.primary', { hasText: 'Create your first page' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Create your first page');
  expect(new URL(page.url()).searchParams.get('workspace')).toBe(workspace);
  await page.getByRole('navigation', { name: 'Lessons', exact: true })
    .getByRole('link', { name: /Next/ }).click();
  await expect(page).toHaveURL(/\/formatting\?workspace=/);
  expect(new URL(page.url()).searchParams.get('workspace')).toBe(workspace);
  await page.locator('header').getByRole('link', { name: 'Administering', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Administer Experience Workspace');
  await page.getByRole('navigation', { name: 'Administering', exact: true })
    .getByRole('link', { name: 'Permissions and access', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Manage permissions and access');
  expect(new URL(page.url()).searchParams.get('workspace')).toBe(workspace);
  await expect(page.getByRole('link', { name: 'Open workspace', exact: true }))
    .toHaveAttribute('href', destination);
  await page.screenshot({ path: testInfo.outputPath('workspace-shorthand.png'), fullPage: true });
  expect(errors).toEqual([]);
});

test('workspace header override does not wait for a slow footer', async ({ page }) => {
  const workspace = 'https://da.live/#/example/training';
  let releaseFooter;
  const footerReady = new Promise((resolve) => { releaseFooter = resolve; });
  await page.route('**/docs/footer.plain.html', async (route) => {
    await footerReady;
    await route.continue();
  });
  try {
    await page.goto(`/?${new URLSearchParams({ workspace })}`);
    await expect(page.getByRole('link', { name: 'Open workspace', exact: true }))
      .toHaveAttribute('href', workspace);
  } finally {
    releaseFooter();
    await page.unrouteAll({ behavior: 'wait' });
  }
});

[
  '', 'not-a-url', '/another-workspace', '//da.live/#/example/site',
  'example/../site', 'example/site/extra', 'example/',
  'http://da.live/#/example/site',
  // eslint-disable-next-line no-script-url
  'javascript:alert(1)',
  'data:text/html,test', 'https://author@example.com/',
].forEach((workspace) => {
  test(`invalid workspace override "${workspace}" retains authored links`, async ({ page }) => {
    await openGuide(page, `/?${new URLSearchParams({ workspace })}`);
    await expect(page.getByRole('link', { name: 'Open workspace', exact: true }))
      .toHaveAttribute('href', 'https://da.live/#/cloudadoption/author-training');
    await expect(page.getByRole('link', { name: 'Open your workspace', exact: true }))
      .toHaveAttribute('href', 'https://da.live/#/cloudadoption/author-training');
    await expect(page.locator('.guide-sidebar a').first()).toHaveAttribute('href', '/');
  });
});

test('administration has independent search, breadcrumbs and lesson order', async ({ page }) => {
  const workspace = 'https://da.live/#/example/admin-training';
  const query = new URLSearchParams({ workspace }).toString();
  await openGuide(page, `/docs/administering?${query}`);
  const navigation = page.getByRole('navigation', { name: 'Administering', exact: true });
  await expect(navigation.locator('[aria-current="page"]')).toHaveText('Overview');
  await expect(page.getByRole('navigation', { name: 'Breadcrumb', exact: true })).toHaveCount(0);
  const search = page.getByRole('searchbox', { name: 'Search topics' });
  await expect(page.locator('.guide-topics-group li:visible')).toHaveCount(9);
  await search.fill('permissions');
  await page.locator('.guide-topics-group').getByRole('link', { name: 'Manage permissions and access' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Manage permissions and access');
  await expect(navigation.locator('[aria-current="page"]')).toHaveText('Permissions and access');
  await expect(page.getByRole('link', { name: 'Open workspace', exact: true }))
    .toHaveAttribute('href', workspace);
  const lessons = page.getByRole('navigation', { name: 'Lessons', exact: true });
  await expect(lessons.getByRole('link', { name: /Previous/ })).toHaveAttribute('href', /\/administering\/configs\?workspace=/);
  await lessons.getByRole('link', { name: /Next/ }).click();
  await expect(page).toHaveURL(/\/administering\/library\?workspace=/);
  await page.getByRole('navigation', { name: 'Breadcrumb', exact: true })
    .getByRole('link', { name: 'Administering', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Administer Experience Workspace');
  expect(new URL(page.url()).searchParams.get('workspace')).toBe(workspace);
});

test('lesson wayfinding follows authored order and heading anchors', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openGuide(page, '/docs/enablement/first-page.html');
  const navigation = page.getByRole('navigation', { name: 'Author guide', exact: true });
  await expect(navigation.locator('[aria-current="page"]')).toHaveText('Create your first page');
  const lessons = page.getByRole('navigation', { name: 'Lessons', exact: true });
  await expect(lessons.getByRole('link', { name: /Previous/ })).toHaveAttribute('href', /access$/);
  await lessons.getByRole('link', { name: /Next/ }).click();
  await expect(page).toHaveURL(/\/formatting$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Format text and links');
  const contents = page.getByRole('navigation', { name: 'On this page', exact: true });
  await contents.getByRole('link', { name: 'Turn a standalone link into a button' }).click();
  await expect(page).toHaveURL(/#guide-section-3$/);
  await expect(page.locator('a.button.primary', { hasText: 'Learn about blocks' })).toBeVisible();
});

test('mobile topic disclosure, header menu and keyboard skip link work', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await openGuide(page);
  const sidebar = page.locator('.guide-sidebar details');
  await expect(sidebar).not.toHaveAttribute('open');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.getByText('Explore the guide', { exact: true }).click();
  await expect(sidebar).toHaveAttribute('open');
  await expect(page.locator('.guide-sidebar [aria-current="page"]')).toBeVisible();
  await page.getByText('Explore the guide', { exact: true }).click();
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Close navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open navigation', exact: true })).toBeVisible();
  await openGuide(page, '/docs/enablement/publishing');
  const contents = page.getByRole('navigation', { name: 'On this page', exact: true });
  await expect(contents.locator('details')).not.toHaveAttribute('open');
  await contents.getByText('On this page', { exact: true }).click();
  await contents.getByRole('link', { name: 'Publish after approval' }).click();
  await expect(page).toHaveURL(/#guide-section-4$/);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator('.guide-sidebar details')).toHaveAttribute('open');
  await expect(contents.locator('details')).toHaveAttribute('open');
});

test('missing guide navigation does not prevent reading a lesson', async ({ page }) => {
  await page.route('**/docs/guide-nav.plain.html', (route) => route.fulfill({ status: 404 }));
  await openGuide(page, '/docs/enablement/publishing');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Preview and publish safely');
  await expect(page.getByText('Topic navigation could not load.', { exact: false })).toBeVisible();
});

test('topic decoration preserves partial rows and extra authored cells', async ({ page }) => {
  await openGuide(page);
  await page.evaluate(async () => {
    const moduleURL = new URL('/blocks/guide-topics/guide-topics.js', window.location);
    const { default: decorate } = await import(moduleURL.href);
    const block = document.createElement('div');
    block.className = 'guide-topics';
    const rows = [
      ['', '<h3>Unlinked topic</h3><p>Still readable</p>', '<p>Extra detail</p>'],
      ['<h3><a href="/docs/enablement/access">One-cell topic</a></h3>'],
      [''],
    ];
    rows.forEach((cells) => {
      const row = document.createElement('div');
      cells.forEach((html) => {
        const cell = document.createElement('div');
        cell.innerHTML = html;
        row.append(cell);
      });
      block.append(row);
    });
    document.querySelector('.guide-topics').replaceWith(block);
    decorate(block);
  });
  await expect(page.locator('.guide-topics-group')).toHaveCount(1);
  await expect(page.locator('.guide-topics-group li')).toHaveCount(2);
  await expect(page.getByText('Extra detail', { exact: true })).toBeVisible();
  await expect(page.locator('.guide-topics-group a')).toHaveCount(1);
});

test('every supplied page and internal destination resolves with valid metadata', async ({ request }) => {
  async function filesIn(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const nested = await Promise.all(entries.map((entry) => (
      entry.isDirectory() ? filesIn(path.join(directory, entry.name))
        : [path.join(directory, entry.name)]
    )));
    return nested.flat();
  }
  const files = await filesIn(path.join(__dirname, '../content'));
  const urls = new Set(['/']);
  await Promise.all(files.map(async (file) => {
    const source = await readFile(file, 'utf8');
    [...source.matchAll(/href="(\/[^"]*)"/g)].forEach((match) => urls.add(match[1]));
    expect(source).not.toMatch(/<script|<style|style=|onclick=/i);
  }));
  await Promise.all([...urls].map(async (url) => {
    const response = await request.get(url);
    expect(response.ok(), url).toBeTruthy();
    const html = await response.text();
    expect(html, url).toContain('name="template" content="guide"');
    expect(html, url).not.toContain('class="metadata"');
  }));
});

test('guide template is opt-in and does not change ordinary pages', async ({ page, request }) => {
  const response = await request.get('/docs/enablement/first-page');
  const html = (await response.text()).replace('<meta name="template" content="guide">', '');
  await page.route('**/ordinary-page?*', (route) => route.fulfill({
    contentType: 'text/html',
    body: html,
  }));
  await openGuide(page, '/ordinary-page?workspace=https%3A%2F%2Fda.live%2F%23%2Fexample%2Fsite');
  await expect(page.locator('.guide-shell')).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveClass(/guide/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open workspace', exact: true }))
    .toHaveAttribute('href', 'https://da.live/#/cloudadoption/author-training');
});

const pages = [
  ['overview', '/'],
  ['lesson', '/docs/enablement/publishing'],
  ['reference', '/docs/enablement/block-library'],
  ['assistant', '/docs/enablement/assistant'],
  ['administration', '/docs/administering'],
  ['admin-lesson', '/docs/administering/permissions'],
];
[375, 768, 1440].forEach((width) => {
  pages.forEach(([name, url]) => {
    test(`${name} fits ${width}px without runtime errors`, async ({ page }, testInfo) => {
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.setViewportSize({ width, height: 1000 });
      await openGuide(page, url);
      expect(await page.evaluate(() => (
        document.documentElement.scrollWidth <= window.innerWidth
      )), `${url} at ${width}px`).toBeTruthy();
      await page.screenshot({ path: testInfo.outputPath('page.png'), fullPage: true });
      expect(errors).toEqual([]);
    });
  });
});

test('guide supports dark mode and reduced motion', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await openGuide(page);
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(17, 17, 17)');
  await expect(page.locator('.guide-sidebar a').first()).toHaveCSS('transition-duration', '0s');
});
