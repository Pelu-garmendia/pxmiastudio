// Switches between the cases inside the Casos panel (WAI-ARIA tabs pattern).
export function initCaseTabs() {
  const tabs = [...document.querySelectorAll('.case-tabs [role="tab"]')];
  if (!tabs.length) return;

  const select = (tab, focus = false) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
    const panel = tab.closest("dialog");
    if (panel) panel.scrollTop = 0;
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (e) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (step) {
        e.preventDefault();
        select(tabs[(i + step + tabs.length) % tabs.length], true);
      } else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        select(tabs[e.key === "Home" ? 0 : tabs.length - 1], true);
      }
    });
  });
}
