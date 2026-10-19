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

document.querySelectorAll('[data-slideshow]').forEach((slideshow) => {
  const slides = Array.from(slideshow.querySelectorAll('.slideshow-slide'));
  const status = slideshow.querySelector('.slideshow-status');
  const previousButton = slideshow.querySelector('.slideshow-previous');
  const nextButton = slideshow.querySelector('.slideshow-next');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
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
    if (reducedMotion.matches || timer || slideshow.matches(':hover')
      || slideshow.contains(document.activeElement) || document.hidden) {
      return;
    }
    timer = window.setInterval(() => showSlide(activeSlide + 1), 5000);
  }

  previousButton.addEventListener('click', () => showSlide(activeSlide - 1));
  nextButton.addEventListener('click', () => showSlide(activeSlide + 1));
  slideshow.addEventListener('mouseenter', stopSlideshow);
  slideshow.addEventListener('mouseleave', startSlideshow);
  slideshow.addEventListener('focusin', stopSlideshow);
  slideshow.addEventListener('focusout', (event) => {
    if (!slideshow.contains(event.relatedTarget)) startSlideshow();
  });
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
