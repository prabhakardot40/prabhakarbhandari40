const menu = document.getElementById('menu');
const nav = document.getElementById('navlinks');
if (menu && nav) {
  menu.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(isOpen));
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  }));
}
document.getElementById('year').textContent = new Date().getFullYear();

const filter = document.getElementById('pubFilter');
const entries = Array.from(document.querySelectorAll('#journalList .publication'));
const count = document.getElementById('pubCount');
function filterPublications() {
  const selectedYear = filter ? filter.value : 'all';
  let visible = 0;
  entries.forEach((entry) => {
    const show = selectedYear === 'all' || entry.dataset.year === selectedYear;
    entry.hidden = !show;
    if (show) visible += 1;
  });
  if (count) count.textContent = `${visible} record${visible === 1 ? '' : 's'}`;
}
if (filter) filter.addEventListener('change', filterPublications);
filterPublications();
