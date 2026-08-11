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
