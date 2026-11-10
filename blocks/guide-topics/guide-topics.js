/**
 * Groups authored topic rows and filters their visible text without a remote index.
 */
export default function decorate(block) {
  const groups = new Map();
  const topics = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!row.textContent.trim()) return;
    const category = cells.length > 1 ? cells.shift().textContent.trim() || 'Topics' : 'Topics';
    if (!groups.has(category)) {
      const section = document.createElement('section');
      section.className = 'guide-topics-group';
      const heading = document.createElement('h3');
      heading.textContent = category;
      const list = document.createElement('ul');
      section.append(heading, list);
      groups.set(category, { section, list });
    }
    const item = document.createElement('li');
    cells.forEach((cell) => item.append(...cell.childNodes));
    item.querySelectorAll('h2, h3').forEach((heading) => {
      const title = document.createElement('h4');
      title.append(...heading.childNodes);
      heading.replaceWith(title);
    });
    groups.get(category).list.append(item);
    topics.push({ item, text: `${category} ${item.textContent}`.toLocaleLowerCase() });
  });

  const search = document.createElement('form');
  search.className = 'guide-topics-search';
  search.setAttribute('role', 'search');
  search.setAttribute('aria-label', 'Guide topics');
  const label = document.createElement('label');
  label.textContent = 'Search topics';
  const input = document.createElement('input');
  input.type = 'search';
  input.placeholder = 'Try "publish", "images", or "blocks"';
  label.append(input);
  const clear = document.createElement('button');
  clear.type = 'button';
  clear.textContent = 'Clear search';
  clear.hidden = true;
  search.append(label, clear);

  const status = document.createElement('p');
  status.className = 'guide-topics-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-atomic', 'true');
  const empty = document.createElement('p');
  empty.className = 'guide-topics-empty';
  empty.textContent = 'No matching topics. Try a broader term or clear your search to see all topics.';
  empty.hidden = true;

  const filter = () => {
    const words = input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    topics.forEach(({ item, text }) => {
      item.hidden = !words.every((word) => text.includes(word));
      if (!item.hidden) count += 1;
    });
    groups.forEach(({ section, list }) => {
      section.hidden = [...list.children].every((item) => item.hidden);
    });
    clear.hidden = !input.value;
    empty.hidden = count > 0;
    status.textContent = `${count} ${count === 1 ? 'topic' : 'topics'}${words.length ? ' found' : ' to explore'}`;
  };
  input.addEventListener('input', filter);
  clear.addEventListener('click', () => {
    input.value = '';
    filter();
    input.focus();
  });
  search.addEventListener('submit', (event) => event.preventDefault());
  const sections = [...groups.values()].map(({ section }) => section);
  block.replaceChildren(search, status, ...sections, empty);
  filter();
}
