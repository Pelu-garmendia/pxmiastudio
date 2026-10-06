# PXM Studio Landing Page Test Plan

## Application Overview

PXM Studio is a dark-themed marketing landing page (Spanish) for a software
and marketing agency. The header shows only the logo (no nav). It has a hero
section, a services list, a process section, a quote-request form that opens
WhatsApp with a prefilled message, and a contact section with WhatsApp and
Instagram CTAs. A footer repeats anchor links to each section.

## Test Scenarios

### 1. Hero

**Seed:** `tests/seed.spec.ts`

#### 1.1. should-render-hero-content

**File:** `tests/hero/should-render-hero-content.spec.ts`

**Steps:**
  1. Load the homepage
    - expect: the main heading "Construimos el motor digital que hace crecer tu negocio." is visible
    - expect: the "Hablemos" primary CTA link is visible
    - expect: the "Ver servicios" secondary CTA link is visible

#### 1.2. should-link-to-diagnostico

**File:** `tests/hero/should-link-to-diagnostico.spec.ts`

**Steps:**
  1. Click "Hacé tu chequeo gratis"
    - expect: the URL becomes `/diagnostico/` and the quiz intro heading is visible
  2. Click "Pedí tu cotización" in the hero
    - expect: the quote panel opens ("Cotizá tu servicio.")

### 2. Navigation

**Seed:** `tests/seed.spec.ts`

#### 2.1. should-scroll-to-services-section-via-footer

**File:** `tests/navigation/should-scroll-to-services-section-via-footer.spec.ts`

**Steps:**
  1. Click the "Servicios" footer link
    - expect: URL hash becomes "#servicios"
    - expect: the "Todo lo que tu negocio necesita para crecer online." heading is visible

#### 2.2. should-scroll-to-contact-section-via-footer

**File:** `tests/navigation/should-scroll-to-contact-section-via-footer.spec.ts`

**Steps:**
  1. Click the "Contacto" footer link
    - expect: URL hash becomes "#contacto"
    - expect: the "¿Listo para hacer crecer tu negocio?" heading is visible

#### 2.3. should-open-diagnostico-from-header-nav

**File:** `tests/navigation/should-open-diagnostico-from-header-nav.spec.ts`

**Steps:**
  1. Click the "Chequeo" nav link
    - expect: the URL becomes `/diagnostico/` and the quiz intro heading is visible
  2. Resize to 320, 390, 480, 560 and 700px wide
    - expect: the nav never overflows the screen

### 3. Quote form

**Seed:** `tests/seed.spec.ts`

#### 3.1. should-open-whatsapp-with-quote-message

**File:** `tests/quote/should-open-whatsapp-with-quote-message.spec.ts`

**Steps:**
  1. Navigate to the quote section via the footer
  2. Select "Marketing" as the service type
  3. Fill in the project detail
  4. Submit the form
    - expect: a new tab opens to a `https://wa.me/5491135943909` URL
    - expect: the URL's prefilled text contains the selected type and the detail

#### 3.1b. should-fall-back-when-new-tab-is-blocked

**File:** `tests/quote/should-fall-back-when-new-tab-is-blocked.spec.ts`

**Steps:**
  1. Make `window.open` return null (popup blocked, as in in-app browsers)
  2. Fill and submit the quote form
    - expect: the same tab navigates to `https://wa.me/5491135943909` with the type and detail in the text

#### 3.2. should-show-error-when-detail-empty

**File:** `tests/quote/should-show-error-when-detail-empty.spec.ts`

**Steps:**
  1. Navigate to the quote section via the footer
  2. Submit without filling the project detail
    - expect: an inline error "Contanos un poco tu proyecto antes de enviar." is visible

### 4. Contact

**Seed:** `tests/seed.spec.ts`

#### 4.1. should-show-whatsapp-and-instagram-links

**File:** `tests/contact/should-show-whatsapp-and-instagram-links.spec.ts`

**Steps:**
  1. Navigate to the contact section via the footer
    - expect: a link "Escribinos por WhatsApp" is visible with href "https://wa.me/5491135943909"
    - expect: a link "@pxmiastudio" is visible with href "https://instagram.com/pxmiastudio"

### 4b. Casos

**Seed:** `tests/seed.spec.ts`

#### 4b.1. should-show-the-farmacia-case

**File:** `tests/cases/should-show-the-farmacia-case.spec.ts`

**Steps:**
  1. Click the "Casos" nav link
    - expect: URL hash becomes "#casos"
    - expect: the "Cómo digitalizamos una farmacia de barrio." heading and the 5 deliverables are visible
    - expect: each of the 5 deliverables shows its illustration and every image loads
    - expect: "Ver la web de la farmacia" links to https://farmagarmendia.netlify.app/
  2. Click "Quiero lo mismo para mi negocio"
    - expect: the quote panel opens and the Casos panel closes

#### 4b.2. should-show-the-keuken-case

**File:** `tests/cases/should-show-the-keuken-case.spec.ts`

**Steps:**
  1. Open Casos and select the "Keuken · Centro cultural" tab
    - expect: the tab is selected and the farmacia panel is hidden
    - expect: the "Le hicimos el sistema de caja…" heading, the Keuken logo and 5 illustrated items are visible; every image loads
  2. Click "Quiero lo mismo para mi negocio"
    - expect: the quote panel opens
  3. With a tab focused, press ArrowRight
    - expect: focus and selection move to the next case, wrapping around

### 5. Chequeo Digital (`/diagnostico/`, alias `/chequeo/`)

**Helpers:** `tests/diagnostico/helpers.ts` (the page is standalone, so these
tests navigate to `/diagnostico/` instead of using the homepage seed)

- **should-show-only-the-intro-screen** — on load only the intro is visible;
  the data, question and result screens stay hidden.
- **should-require-a-rubro** — "Siguiente" without a rubro shows
  "Elegí tu rubro para seguir. Si no está, elegí Otro." and focuses the select;
  "Volver" returns to the intro.
- **should-ask-questions-for-each-rubro** — each rubro family gets its own
  questions plus the 5 common ones (11 for comercios, 10 for mayorista,
  gastronomía and turnos, 9 for gimnasio, proyectos and "Otro").
- **should-score-a-fully-digital-business** — all best answers → 10/10,
  "Negocio digital", one "next step" recommendation, WhatsApp text with the
  business name and rubro.
- **should-score-an-offline-business** — all worst answers → 0/10,
  "Negocio offline", top 3 recommendations listed in the WhatsApp text;
  decimal scores use a comma (9,5) and all middle answers give 5/10.
- **should-skip-not-applicable-answers** — "No tengo clases con cupo" is left
  out of the score and the per-area bars.
- **should-navigate-between-questions** — going back keeps the answer,
  changing the rubro resets the answers, and a quick double tap does not skip
  a question.
- **should-share-and-restart** — "Copiar resultado" copies the score and the
  page link; "Hacer el test de nuevo" returns to the intro.
- **should-fit-a-phone-screen** — no horizontal scroll at 360px wide.
