import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initBackground } from "./background.js";

gsap.registerPlugin(ScrollTrigger);

initBackground(document.getElementById("bg-canvas"));

// Hero entrance
const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
heroTl
  .to(".hero .eyebrow", { opacity: 1, y: 0, duration: 0.7 }, 0.1)
  .fromTo(
    ".hero-title .reveal-line span",
    { yPercent: 110 },
    { yPercent: 0, duration: 0.9, stagger: 0.12 },
    0.2
  )
  .to(".hero-title", { opacity: 1, duration: 0.01 }, 0.2)
  .to(".hero-sub", { opacity: 1, y: 0, duration: 0.7 }, 0.55)
  .to(".hero-actions", { opacity: 1, y: 0, duration: 0.7 }, 0.68)
  .to(".scroll-cue", { opacity: 1, duration: 0.6 }, 0.9);

gsap.set(".hero-title", { opacity: 0 });
gsap.set(".hero .eyebrow, .hero-sub, .hero-actions, .scroll-cue", { y: 16 });

// Generic scroll-reveal for simple fade-ins
document.querySelectorAll(".section .reveal").forEach((el) => {
  gsap.fromTo(
    el,
    { opacity: 0, y: 16 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      },
    }
  );
});

// Cards / rows that rise into view, staggered within their group
const groups = [".case-grid", ".service-list", ".process-grid"];
groups.forEach((selector) => {
  const container = document.querySelector(selector);
  if (!container) return;
  const items = container.querySelectorAll(".reveal-up");
  gsap.fromTo(
    items,
    { opacity: 0, y: 32 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
      },
    }
  );
});

// Contact section CTA button
gsap.fromTo(
  ".contact .btn",
  { opacity: 0, y: 16 },
  {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".contact",
      start: "top 75%",
    },
  }
);

// Subtle header background intensifies on scroll
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
