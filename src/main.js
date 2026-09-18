import gsap from "gsap";
import { initBackground } from "./background.js";
import { initQuoteForm } from "./quote-form.js";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

initBackground(document.getElementById("bg-canvas"), { reduceMotion });
initQuoteForm();

if (reduceMotion) {
  gsap.set(".hero .reveal, .hero-title, .hero-title .reveal-line span", {
    opacity: 1,
    x: 0,
    yPercent: 0,
  });
} else {
  const heroTl = gsap.timeline({ defaults: { ease: EASE } });
  heroTl
    .fromTo(
      ".hero-title .reveal-line span",
      { yPercent: 110 },
      { yPercent: 0, duration: 0.6, stagger: 0.1 },
      0.1
    )
    .to(".hero-title", { opacity: 1, duration: 0.01 }, 0.1)
    .to(".hero-sub", { opacity: 1, x: 0, duration: 0.45 }, 0.45);

  gsap.set(".hero-title", { opacity: 0 });
  gsap.set(".hero-sub", { x: -24 });
}

const panels = [...document.querySelectorAll("dialog.panel")];

function animatePanel(panel) {
  const items = panel.querySelectorAll(".reveal, .reveal-up, .contact-actions .btn");
  if (reduceMotion) {
    gsap.set(items, { opacity: 1, x: 0 });
    return;
  }
  gsap.fromTo(
    items,
    { opacity: 0, x: -24 },
    { opacity: 1, x: 0, duration: 0.4, ease: EASE, stagger: 0.07 }
  );
}

function openPanel(id) {
  const panel = panels.find((p) => p.id === id);
  if (!panel) return false;
  panels.forEach((p) => p !== panel && p.open && p.close());
  if (!panel.open) panel.showModal();
  if (location.hash !== `#${id}`) history.pushState(null, "", `#${id}`);
  animatePanel(panel);
  return true;
}

function closeAll() {
  panels.forEach((p) => p.open && p.close());
}

document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute("href").slice(1);
  if (!id) {
    e.preventDefault();
    closeAll();
    return;
  }
  if (openPanel(id)) e.preventDefault();
});

panels.forEach((panel) => {
  panel.querySelector(".panel-close").addEventListener("click", () => panel.close());
  panel.addEventListener("click", (e) => {
    if (e.target === panel) panel.close();
  });
  panel.addEventListener("close", () => {
    if (location.hash === `#${panel.id}`) {
      history.replaceState(null, "", location.pathname + location.search);
    }
  });
});

window.addEventListener("popstate", () => {
  const id = location.hash.slice(1);
  if (!openPanel(id)) closeAll();
});

if (location.hash) openPanel(location.hash.slice(1));
