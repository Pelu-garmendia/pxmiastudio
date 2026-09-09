import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initBackground } from "./background.js";

gsap.registerPlugin(ScrollTrigger);

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

initBackground(document.getElementById("bg-canvas"), { reduceMotion });

if (reduceMotion) {
  // Skip animated entrances entirely; content is shown in its final state.
  gsap.set(
    ".reveal, .reveal-up, .hero-title, .hero-title .reveal-line span, .contact-actions .btn",
    { opacity: 1, x: 0, y: 0, yPercent: 0 }
  );
  gsap.set(".service-line", { scaleX: 1 });
} else {
  // Hero entrance
  const heroTl = gsap.timeline({ defaults: { ease: EASE } });
  heroTl
    .to(".hero .eyebrow", { opacity: 1, x: 0, duration: 0.28 }, 0.1)
    .fromTo(
      ".hero-title .reveal-line span",
      { yPercent: 110 },
      { yPercent: 0, duration: 0.6, stagger: 0.1 },
      0.2
    )
    .to(".hero-title", { opacity: 1, duration: 0.01 }, 0.2)
    .to(".hero-sub", { opacity: 1, x: 0, duration: 0.45 }, 0.5)
    .to(".hero-actions", { opacity: 1, x: 0, duration: 0.45 }, 0.6);

  gsap.set(".hero-title", { opacity: 0 });
  gsap.set(".hero .eyebrow, .hero-sub, .hero-actions", { x: -24 });

  // Generic scroll-reveal — lateral slide + opacity, not a vertical fade-up
  document.querySelectorAll(".section .reveal").forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, x: -24 },
      {
        opacity: 1,
        x: 0,
        duration: 0.45,
        ease: EASE,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
      }
    );
  });

  // Cards / rows that slide into view, staggered within their group
  const groups = [".service-list", ".process-grid"];
  groups.forEach((selector) => {
    const container = document.querySelector(selector);
    if (!container) return;
    const items = container.querySelectorAll(".reveal-up");
    gsap.fromTo(
      items,
      { opacity: 0, x: -32 },
      {
        opacity: 1,
        x: 0,
        duration: 0.45,
        ease: EASE,
        stagger: 0.1,
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
        },
      }
    );
  });

  // Service rows draw their underline in, staggered after the row itself slides in
  const serviceLines = document.querySelectorAll(".service-line");
  if (serviceLines.length) {
    gsap.fromTo(
      serviceLines,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.45,
        ease: EASE,
        stagger: 0.1,
        delay: 0.2,
        scrollTrigger: {
          trigger: ".service-list",
          start: "top 80%",
        },
      }
    );
  }

  // Contact CTAs, staggered
  gsap.fromTo(
    ".contact-actions .btn",
    { opacity: 0, x: -24 },
    {
      opacity: 1,
      x: 0,
      duration: 0.45,
      ease: EASE,
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".contact",
        start: "top 75%",
      },
    }
  );
}

// Subtle header background intensifies on scroll (uses ScrollTrigger, not a scroll listener)
const header = document.querySelector(".site-header");
ScrollTrigger.create({
  start: 40,
  end: 99999,
  onUpdate: (self) => {
    header.style.boxShadow = self.progress > 0
      ? "0 1px 0 rgba(255,255,255,0.06)"
      : "none";
  },
});
