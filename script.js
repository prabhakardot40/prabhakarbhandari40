const menu = document.getElementById('menu');
const nav = document.getElementById('navlinks');
if (menu && nav) {
  menu.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(isOpen));
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    nav.querySelectorAll('.nav-dropdown').forEach((dropdown) => { dropdown.open = false; });
    menu.setAttribute('aria-expanded', 'false');
  }));
}
document.getElementById('year').textContent = new Date().getFullYear();

const proceedingsList = document.querySelector('#proceedings > .container > .entry-list');
const bookChapterList = document.getElementById('bookChapterList');
if (proceedingsList && bookChapterList) {
  Array.from(proceedingsList.querySelectorAll(':scope > .publication')).forEach((entry) => {
    if (/Lecture Notes in Mechanical Engineering|Sustainability in Smart Manufacturing Trends/i.test(entry.textContent)) {
      bookChapterList.append(entry);
    }
  });
}

const serialGroups = document.querySelectorAll('.entry-list, .membership-list, .timeline, .interest-grid');
serialGroups.forEach((group) => {
  let serialCount = 0;
  Array.from(group.children).forEach((entry) => {
    if (!entry.matches('.entry, .timeline-card, .interest')) return;
    serialCount += 1;
    const serialNumber = document.createElement('span');
    serialNumber.className = 'serial-number';
    serialNumber.textContent = String(serialCount).padStart(2, '0');
    serialNumber.setAttribute('aria-label', `Serial number ${serialCount}`);
    entry.prepend(serialNumber);
  });
});

document.querySelectorAll('table').forEach((table) => {
  const headerRow = table.querySelector('thead tr');
  if (headerRow) {
    const serialHeader = document.createElement('th');
    serialHeader.scope = 'col';
    serialHeader.textContent = 'S. No.';
    headerRow.prepend(serialHeader);
  }
  table.querySelectorAll('tbody tr').forEach((row, index) => {
    const serialCell = document.createElement('td');
    serialCell.className = 'serial-cell';
    serialCell.textContent = String(index + 1).padStart(2, '0');
    row.prepend(serialCell);
  });
});

document.querySelectorAll('main ul:not(.course-list)').forEach((list) => {
  list.querySelectorAll(':scope > li').forEach((item, index) => {
    const serialNumber = document.createElement('span');
    serialNumber.className = 'serial-number list-serial-number';
    serialNumber.textContent = `${String(index + 1).padStart(2, '0')}.`;
    item.prepend(serialNumber);
  });
});

const filter = document.getElementById('pubFilter');
const impactFilter = document.getElementById('impactFilter');
const citeScoreFilter = document.getElementById('citeScoreFilter');
const entries = Array.from(document.querySelectorAll('#journalList .publication'));
const count = document.getElementById('pubCount');
function filterPublications() {
  const selectedYear = filter ? filter.value : 'all';
  const minimumImpactFactor = impactFilter.value === '' ? null : Number(impactFilter.value);
  const minimumCiteScore = citeScoreFilter.value === '' ? null : Number(citeScoreFilter.value);
  let visible = 0;
  entries.forEach((entry) => {
    const impactFactor = entry.dataset.impactFactor === '' ? Number.NaN : Number(entry.dataset.impactFactor);
    const citeScore = entry.dataset.citeScore === '' ? Number.NaN : Number(entry.dataset.citeScore);
    const yearMatches = selectedYear === 'all' || entry.dataset.year === selectedYear;
    const impactMatches = minimumImpactFactor === null
      || (Number.isFinite(impactFactor) && impactFactor >= minimumImpactFactor);
    const citeScoreMatches = minimumCiteScore === null
      || (Number.isFinite(citeScore) && citeScore >= minimumCiteScore);
    const show = yearMatches && impactMatches && citeScoreMatches;
    entry.hidden = !show;
    if (show) visible += 1;
  });
  if (count) count.textContent = `${visible} of ${entries.length} records`;
}
if (filter) filter.addEventListener('change', filterPublications);
if (impactFilter) impactFilter.addEventListener('input', filterPublications);
if (citeScoreFilter) citeScoreFilter.addEventListener('input', filterPublications);
filterPublications();

document.querySelectorAll('[data-slideshow]').forEach((slideshow) => {
  const slides = Array.from(slideshow.querySelectorAll('.slideshow-slide'));
  const status = slideshow.querySelector('.slideshow-status');
  const previousButton = slideshow.querySelector('.slideshow-previous');
  const nextButton = slideshow.querySelector('.slideshow-next');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const continuousAutoplay = slideshow.hasAttribute('data-autoplay-continuous');
  let activeSlide = 0;
  let timer;

  function showSlide(index) {
    slides[activeSlide].hidden = true;
    activeSlide = (index + slides.length) % slides.length;
    slides[activeSlide].hidden = false;
    status.textContent = `Photo ${activeSlide + 1} of ${slides.length}`;
  }

  function stopSlideshow() {
    window.clearInterval(timer);
    timer = undefined;
  }

  function startSlideshow() {
    if (reducedMotion.matches || timer || document.hidden
      || (!continuousAutoplay && (slideshow.matches(':hover') || slideshow.contains(document.activeElement)))) {
      return;
    }
    timer = window.setInterval(() => showSlide(activeSlide + 1), 5000);
  }

  previousButton.addEventListener('click', () => showSlide(activeSlide - 1));
  nextButton.addEventListener('click', () => showSlide(activeSlide + 1));
  if (!continuousAutoplay) {
    slideshow.addEventListener('mouseenter', stopSlideshow);
    slideshow.addEventListener('mouseleave', startSlideshow);
    slideshow.addEventListener('focusin', stopSlideshow);
    slideshow.addEventListener('focusout', (event) => {
      if (!slideshow.contains(event.relatedTarget)) startSlideshow();
    });
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopSlideshow();
    else startSlideshow();
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) stopSlideshow();
    else startSlideshow();
  });
  startSlideshow();
});
