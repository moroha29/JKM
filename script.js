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
  const cards = [...workRail.children];
  const count = document.querySelector('[data-work-count]');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let hovered = false;
  let cycleWidth = 0;
  let position = 0;
  let lastTime = 0;
  let frame = 0;

  // A second copy makes the join visually identical to the start.
  cards.forEach((card) => {
    const copy = card.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.dataset.loopCopy = '';
    copy.querySelectorAll('a').forEach((link) => { link.tabIndex = -1; });
    workRail.append(copy);
  });
  count.textContent = `${cards.length} projects · Swipe to explore`;
  function measure() {
    cycleWidth = workRail.children[cards.length].offsetLeft - cards[0].offsetLeft;
    position = workRail.scrollLeft;
  }
  function tick(time) {
    frame = 0;
    const elapsed = lastTime ? Math.min(time - lastTime, 50) : 0;
    lastTime = time;
    if (!hovered && cycleWidth > 0) {
      position = (position + elapsed * .032) % cycleWidth;
      workRail.scrollLeft = position;
    } else {
      position = workRail.scrollLeft;
    }
    frame = requestAnimationFrame(tick);
  }
  function syncPlayback() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    if (!document.hidden && !motionPreference.matches) frame = requestAnimationFrame(tick);
  }
  workRail.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') hovered = true;
  });
  workRail.addEventListener('pointerleave', () => {
    hovered = false;
    position = workRail.scrollLeft;
  });
  workRail.addEventListener('scroll', () => {
    // Accept manual swipes without treating ordinary page scrolling as a pause.
    if (hovered || Math.abs(workRail.scrollLeft - position) > 2) position = workRail.scrollLeft;
  }, { passive: true });
  workRail.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    workRail.scrollLeft += (event.key === 'ArrowRight' ? 1 : -1) * cards[0].getBoundingClientRect().width;
    position = workRail.scrollLeft;
  });
  new ResizeObserver(measure).observe(workRail);
  document.addEventListener('visibilitychange', syncPlayback);
  motionPreference.addEventListener('change', syncPlayback);
  measure();
  syncPlayback();
}
