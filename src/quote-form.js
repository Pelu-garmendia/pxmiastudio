const WHATSAPP_NUMBER = "5491135943909";

export function initQuoteForm() {
  const form = document.getElementById("quote-form");
  if (!form) return;

  const detail = document.getElementById("quote-detail");

  const groups = document.querySelectorAll(".price-ref [data-for]");
  const showPrices = () => {
    const tipo = new FormData(form).get("tipo");
    groups.forEach((g) => {
      g.hidden = g.dataset.for !== tipo;
    });
  };
  form.addEventListener("change", showPrices);
  showPrices();
  const error = document.getElementById("quote-error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const detailValue = detail.value.trim();
    if (!detailValue) {
      error.hidden = false;
      detail.focus();
      return;
    }
    error.hidden = true;

    const tipo = new FormData(form).get("tipo") || "un proyecto";
    const message =
      `Hola! Quiero cotizar *${tipo}*.\n\n` +
      `Detalle: ${detailValue}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    // Some browsers (Instagram's in-app browser, several mobile ones) block
    // the new tab; fall back to opening WhatsApp from this same tab.
    const win = window.open(url, "_blank");
    if (win) {
      win.opener = null;
    } else {
      window.location.href = url;
    }
  });

  detail.addEventListener("input", () => {
    if (!error.hidden && detail.value.trim()) {
      error.hidden = true;
    }
  });
}
