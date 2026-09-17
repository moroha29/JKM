const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  navigation?.classList.toggle("is-open", open);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  });
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll("[data-reveal]");

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -5%" });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const progress = document.querySelector(".scroll-progress span");
const pointerLight = document.querySelector(".pointer-light");

function updateScrollProgress() {
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = distance > 0 ? window.scrollY / distance : 0;
  if (progress) progress.style.width = `${Math.min(1, Math.max(0, ratio)) * 100}%`;
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

if (!reducedMotion && pointerLight) {
  window.addEventListener("pointermove", (event) => {
    pointerLight.style.left = `${event.clientX}px`;
    pointerLight.style.top = `${event.clientY}px`;
  }, { passive: true });

  document.querySelectorAll("[data-tilt]").forEach((surface) => {
    surface.addEventListener("pointermove", (event) => {
      if (window.innerWidth < 900) return;
      const rect = surface.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      surface.style.transform = `perspective(1400px) rotateX(${y * -1.2}deg) rotateY(${x * 1.2}deg)`;
    });
    surface.addEventListener("pointerleave", () => { surface.style.transform = ""; });
  });
}

function updateSingaporeTime() {
  const target = document.querySelector("[data-singapore-time]");
  if (!target) return;
  target.textContent = new Intl.DateTimeFormat("en-SG", {
    timeZone: "Asia/Singapore",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

updateSingaporeTime();
setInterval(updateSingaporeTime, 30_000);
document.querySelectorAll("[data-year]").forEach((item) => { item.textContent = String(new Date().getFullYear()); });

// Highlight the current homepage section as visitors scroll.
const jumpLinks = document.querySelectorAll('.floating-nav a, .site-nav a');
const sections = ['top', 'work', 'studio', 'people', 'contact']
  .map((id) => document.getElementById(id)).filter(Boolean);
function updateActiveSection() {
  if (document.body.classList.contains('project-page')) return;
  let active = sections[0]?.id;
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= 180) active = section.id;
  }
  jumpLinks.forEach((link) => {
    if (link.hash === `#${active}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
window.addEventListener('scroll', updateActiveSection, { passive: true });
window.addEventListener('resize', updateActiveSection);
updateActiveSection();
if (document.body.classList.contains('project-page')) {
  document.querySelector('.site-nav a[href$="#work"]')?.setAttribute('aria-current', 'page');
}
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    navigation.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.focus();
  }
});
// Preserve keyboard focus when jumping within a page, including the skip link.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
});

const workRail = document.querySelector('#work-carousel');
if (workRail) {
  const playback = document.querySelector('[data-work-playback]');
  const count = document.querySelector('[data-work-count]');
  const region = document.querySelector('.work-overview');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let playing = !motionPreference.matches;
  let hovered = false;
  let touching = false;
  let visible = false;
  let timer;

  function updateWorkRail() {
    const cards = [...workRail.children];
    const railBounds = workRail.getBoundingClientRect();
    const shown = cards.map((card, index) => ({ index, bounds: card.getBoundingClientRect() }))
      .filter(({ bounds }) => bounds.left < railBounds.right - 30 && bounds.right > railBounds.left + 30);
    if (shown.length) {
      const first = shown[0].index + 1;
      const last = shown[shown.length - 1].index + 1;
      count.textContent = `${first === last ? first : `${first}–${last}`} of ${cards.length} projects · Swipe to explore`;
    }
  }
  function moveWorkRail(direction = 1) {
    const card = workRail.firstElementChild;
    if (!card) return;
    const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(workRail).columnGap);
    const end = workRail.scrollWidth - workRail.clientWidth;
    let target = workRail.scrollLeft + direction * step;
    if (direction > 0 && workRail.scrollLeft >= end - 2) target = 0;
    if (direction < 0 && workRail.scrollLeft <= 2) target = end;
    workRail.scrollTo({ left: target, behavior: motionPreference.matches ? 'instant' : 'smooth' });
  }
  function schedule() {
    clearTimeout(timer);
    if (!playing || !visible || hovered || touching || document.hidden || workRail.contains(document.activeElement)) return;
    timer = setTimeout(() => { moveWorkRail(); schedule(); }, 4500);
  }
  function updatePlayback() {
    playback.textContent = playing ? 'Pause rotation' : 'Play rotation';
    playback.setAttribute('aria-label', playing ? 'Pause automatic project rotation' : 'Start automatic project rotation');
    schedule();
  }
  playback.addEventListener('click', () => { playing = !playing; updatePlayback(); });
  region.addEventListener('pointerenter', (event) => { if (event.pointerType === 'mouse') { hovered = true; schedule(); } });
  region.addEventListener('pointerleave', () => { hovered = false; schedule(); });
  workRail.addEventListener('pointerdown', () => { touching = true; schedule(); });
  window.addEventListener('pointerup', () => { touching = false; schedule(); });
  window.addEventListener('pointercancel', () => { touching = false; schedule(); });
  workRail.addEventListener('focusin', schedule);
  workRail.addEventListener('focusout', () => setTimeout(schedule, 0));
  workRail.addEventListener('wheel', schedule, { passive: true });
  workRail.addEventListener('scroll', updateWorkRail, { passive: true });
  workRail.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      moveWorkRail(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  document.addEventListener('visibilitychange', schedule);
  motionPreference.addEventListener('change', () => { playing = !motionPreference.matches; updatePlayback(); });
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }, { threshold: .25 }).observe(workRail);
  new ResizeObserver(updateWorkRail).observe(workRail);
  updateWorkRail();
  updatePlayback();
}
