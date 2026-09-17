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
  if (event.key === 'Escape' && navigation?.classList.contains('is-open')) {
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

  // Identical copies on both sides let the rail wrap in either direction without a visible jump.
  const makeCopy = (card) => {
    const copy = card.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.dataset.loopCopy = '';
    copy.querySelectorAll('a').forEach((link) => { link.tabIndex = -1; });
    return copy;
  };
  workRail.prepend(...cards.map(makeCopy));
  workRail.append(...cards.map(makeCopy));
  workRail.style.scrollBehavior = 'auto';
  if (count) count.textContent = `${cards.length} projects · Swipe to explore`;

  // Keep the scroll position inside the middle band, shifting by exactly one set when it drifts out.
  function wrap(value) {
    if (cycleWidth <= 0) return value;
    if (value < cycleWidth * 0.5) return value + cycleWidth;
    if (value >= cycleWidth * 1.5) return value - cycleWidth;
    return value;
  }
  function jumpTo(value) {
    position = wrap(value);
    workRail.scrollLeft = position;
  }
  function measure() {
    const previous = cycleWidth;
    const offset = previous > 0 ? (position - previous) / previous : 0;
    cycleWidth = cards[0].offsetLeft - workRail.children[0].offsetLeft;
    jumpTo(cycleWidth + offset * cycleWidth);
  }
  function tick(time) {
    frame = 0;
    const elapsed = lastTime ? Math.min(time - lastTime, 50) : 0;
    lastTime = time;
    if (!hovered && cycleWidth > 0) jumpTo(position + elapsed * .032);
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
    // Follow manual swipes and wheel scrolling, and wrap them too so the rail never runs out.
    const current = workRail.scrollLeft;
    if (hovered || Math.abs(current - position) > 2) position = current;
    const wrapped = wrap(position);
    if (wrapped !== position) jumpTo(wrapped);
  }, { passive: true });
  workRail.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    jumpTo(workRail.scrollLeft + (event.key === 'ArrowRight' ? 1 : -1) * cards[0].getBoundingClientRect().width);
  });
  new ResizeObserver(measure).observe(workRail);
  document.addEventListener('visibilitychange', syncPlayback);
  motionPreference.addEventListener('change', syncPlayback);
  measure();
  syncPlayback();
}

// Smoothly expand and collapse the "What we do" services, keeping one open at a time.
const serviceItems = [...document.querySelectorAll('.service')];
if (serviceItems.length) {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const timing = { duration: 460, easing: 'cubic-bezier(.2,.7,.2,1)' };
  const running = new Map();
  // The script manages exclusivity itself so closing items can animate too.
  serviceItems.forEach((item) => item.removeAttribute('name'));

  function settle(item) {
    running.get(item)?.forEach((animation) => animation.cancel());
    running.delete(item);
    item.classList.remove('is-animating', 'is-closing', 'is-opening');
  }

  function setService(item, opening) {
    const body = item.querySelector('.service__body');
    const project = item.querySelector('.service__project');
    const description = item.querySelector('.service__description');
    settle(item);
    if (motion.matches || !body) {
      item.open = opening;
      return;
    }
    item.classList.add('is-animating');
    // Keep the short description visible while it animates, so the row height never jumps.
    item.classList.add(opening ? 'is-opening' : 'is-closing');
    if (opening) item.open = true;

    const style = getComputedStyle(body);
    const expanded = { height: `${body.offsetHeight}px`, minHeight: '0px', paddingTop: style.paddingTop, paddingBottom: style.paddingBottom, opacity: 1 };
    const collapsed = { height: '0px', minHeight: '0px', paddingTop: '0px', paddingBottom: '0px', opacity: 0 };
    const order = (from, to) => (opening ? [from, to] : [to, from]);
    const animations = [body.animate(order(collapsed, expanded), timing)];
    if (project) {
      animations.push(project.animate(order({ opacity: 0, transform: 'translateY(.75rem)' }, { opacity: 1, transform: 'none' }), timing));
    }
    if (description) {
      const shown = { height: `${description.offsetHeight}px`, opacity: 1 };
      animations.push(description.animate(order(shown, { height: '0px', opacity: 0 }), timing));
    }
    running.set(item, animations);
    animations[0].finished.then(() => {
      if (!opening) item.open = false;
      settle(item);
    }).catch(() => {});
  }

  serviceItems.forEach((item) => {
    item.querySelector('summary')?.addEventListener('click', (event) => {
      event.preventDefault();
      const opening = !item.open || item.classList.contains('is-closing');
      if (opening) {
        serviceItems.forEach((other) => {
          if (other !== item && other.open && !other.classList.contains('is-closing')) setService(other, false);
        });
      }
      setService(item, opening);
    });
  });
}

// Project pages on phones: a compact switcher opens the list of projects.
const projectNav = document.querySelector('.project-nav');
const projectSwitch = projectNav?.querySelector('.project-switch');
if (projectNav && projectSwitch) {
  const setMenu = (open) => {
    projectNav.classList.toggle('is-open', open);
    projectSwitch.setAttribute('aria-expanded', String(open));
  };
  projectSwitch.addEventListener('click', () => setMenu(!projectNav.classList.contains('is-open')));
  document.addEventListener('click', (event) => {
    if (!projectNav.contains(event.target)) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && projectNav.classList.contains('is-open')) {
      setMenu(false);
      projectSwitch.focus();
    }
  });
  projectNav.querySelectorAll('.project-nav__tabs a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  window.matchMedia('(min-width: 681px)').addEventListener('change', () => setMenu(false));
}
