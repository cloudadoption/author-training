import { getMetadata } from './aem.js';

function normalizePath(path) {
  return path.replace(/\/index(?:\.html)?$/, '/').replace(/\.html$/, '').replace(/\/$/, '') || '/';
}

export function customizeWorkspaceLinks(container) {
  const value = new URLSearchParams(window.location.search).get('workspace');
  let workspace;
  try {
    workspace = new URL(/^[a-z0-9-]+\/[a-z0-9-]+$/i.test(value)
      ? `https://da.live/#/${value}` : value);
  } catch {
    return;
  }
  if (workspace.protocol !== 'https:' || workspace.username || workspace.password) return;

  container.querySelectorAll('a[href]').forEach((link) => {
    if (link.href === workspace.href) return;
    if (link.href === 'https://da.live/#/cloudadoption/author-training') {
      link.href = workspace.href;
    } else if (link.origin === window.location.origin && !link.getAttribute('href').startsWith('#')) {
      const path = normalizePath(link.pathname);
      if (path !== '/' && !/^\/docs\/(?:enablement|administering)(?:\/|$)/.test(path)) return;
      const url = new URL(link.href);
      url.searchParams.set('workspace', value);
      link.href = `${url.pathname}${url.search}${url.hash}`;
    }
  });
}

function createLink(href, text) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  return link;
}

function addContents(main, shell) {
  const headings = [...main.querySelectorAll('h2')];
  if (!headings.length || main.querySelector('.guide-topics')) return;
  const contents = document.createElement('nav');
  contents.className = 'guide-contents';
  contents.setAttribute('aria-label', 'On this page');
  const disclosure = document.createElement('details');
  const label = document.createElement('summary');
  label.textContent = 'On this page';
  const list = document.createElement('ul');
  headings.forEach((heading, index) => {
    if (!heading.id) heading.id = `guide-section-${index + 1}`;
    const item = document.createElement('li');
    item.append(createLink(`#${heading.id}`, heading.textContent));
    list.append(item);
  });
  disclosure.append(label, list);
  contents.append(disclosure);
  const desktop = window.matchMedia('(min-width: 1200px)');
  const placeContents = () => {
    disclosure.open = desktop.matches;
    if (desktop.matches) shell.append(contents);
    else headings[0].before(contents);
  };
  placeContents();
  desktop.addEventListener('change', placeContents);
  shell.classList.add('has-contents');
}

function addLessonNavigation(main, links, currentIndex) {
  if (currentIndex <= 0) return;
  const pager = document.createElement('nav');
  pager.className = 'guide-pager';
  pager.setAttribute('aria-label', 'Lessons');
  [currentIndex - 1, currentIndex + 1].forEach((index) => {
    const source = links[index];
    if (!source) return;
    const link = createLink(source.href, '');
    const label = document.createElement('span');
    label.textContent = index < currentIndex ? 'Previous' : 'Next';
    const title = document.createElement('strong');
    title.textContent = source.textContent;
    link.append(label, title);
    pager.append(link);
  });
  main.append(pager);
}

/**
 * Adds the reading shell only to pages with Template: guide.
 * The authored navigation document remains the source of lesson order.
 */
export default async function decorateGuide(main) {
  const guideHome = getMetadata('guide-home') || '/';
  const guideTitle = getMetadata('guide-title') || 'Author guide';
  const guideNav = getMetadata('guide-nav') || '/docs/guide-nav';
  main.id = 'main-content';
  main.tabIndex = -1;
  const skip = createLink('#main-content', 'Skip to content');
  skip.className = 'guide-skip';
  document.body.prepend(skip);

  const shell = document.createElement('div');
  shell.className = 'guide-shell';
  main.before(shell);
  shell.append(main);

  const sidebar = document.createElement('aside');
  sidebar.className = 'guide-sidebar';
  const disclosure = document.createElement('details');
  const desktop = window.matchMedia('(min-width: 900px)');
  disclosure.open = desktop.matches;
  desktop.addEventListener('change', () => { disclosure.open = desktop.matches; });
  const summary = document.createElement('summary');
  summary.textContent = 'Explore the guide';
  const navigation = document.createElement('nav');
  navigation.setAttribute('aria-label', guideTitle);
  disclosure.append(summary, navigation);
  sidebar.append(disclosure);
  shell.prepend(sidebar);
  addContents(main, shell);

  const currentPath = normalizePath(window.location.pathname);
  if (currentPath !== normalizePath(guideHome)) {
    const breadcrumb = document.createElement('nav');
    breadcrumb.className = 'guide-breadcrumb';
    breadcrumb.setAttribute('aria-label', 'Breadcrumb');
    breadcrumb.append(createLink(guideHome, guideTitle));
    const current = document.createElement('span');
    current.textContent = main.querySelector('h1')?.textContent || 'Lesson';
    breadcrumb.append(current);
    main.prepend(breadcrumb);
  }

  try {
    const response = await fetch(`${guideNav}.plain.html`, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) throw new Error('Guide navigation is unavailable');
    const source = new DOMParser().parseFromString(await response.text(), 'text/html');
    source.querySelectorAll('h2, h3, ul').forEach((element) => navigation.append(element));
    const links = [...navigation.querySelectorAll('a[href]')];
    const currentIndex = links.findIndex((link) => (
      normalizePath(new URL(link.href, window.location).pathname) === currentPath
    ));
    if (currentIndex >= 0) links[currentIndex].setAttribute('aria-current', 'page');
    addLessonNavigation(main, links, currentIndex);
  } catch {
    navigation.append(createLink(guideHome, `Back to ${guideTitle}`));
    const message = document.createElement('p');
    message.textContent = 'Topic navigation could not load. You can still read this page.';
    navigation.append(message);
  }
  customizeWorkspaceLinks(document);
}
