# PXM Studio Landing Page Test Plan

## Application Overview

PXM Studio is a dark-themed marketing landing page (Spanish) for a software
and marketing agency. The header shows only the logo (no nav). It has a hero
section, a services list, a process section, and a contact section with
WhatsApp and Instagram CTAs. A footer repeats anchor links to each section.
The page has no forms or backend; every scenario is read-only navigation and
content verification.

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

### 3. Contact

**Seed:** `tests/seed.spec.ts`

#### 3.1. should-show-whatsapp-and-instagram-links

**File:** `tests/contact/should-show-whatsapp-and-instagram-links.spec.ts`

**Steps:**
  1. Navigate to the contact section via the footer
    - expect: a link "Escribinos por WhatsApp" is visible with href "https://wa.me/5491135943909"
    - expect: a link "@pxmiastudio" is visible with href "https://instagram.com/pxmiastudio"
