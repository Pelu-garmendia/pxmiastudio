const WHATSAPP_NUMBER = "5491135943909";

export function initQuoteForm() {
  const form = document.getElementById("quote-form");
  if (!form) return;

  const detail = document.getElementById("quote-detail");
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
    window.open(url, "_blank", "noopener");
  });

  detail.addEventListener("input", () => {
    if (!error.hidden && detail.value.trim()) {
      error.hidden = true;
    }
  });
}
