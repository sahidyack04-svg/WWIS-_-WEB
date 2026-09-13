# WWIS Landing Page — Design Spec

**Date:** 2026-09-13
**Status:** Approved for implementation planning

## Purpose

Build a new landing (home) page for WWIS Trichy (Wisdom Wealth International School), using the visual structure and layout patterns of the [Kidtime kindergarten template](https://weblium.com/templates/demo/kindergarten-website-design-280) as a design reference, populated with real WWIS content and restyled with WWIS brand colors.

This is the first page of what may become a multi-page site later; scope here is limited to the single landing page.

## Reference Template Analysis

Live reference: https://kindergarten.weblium.site/ (Kidtime template)

Structure observed: sticky header/nav, hero with organic blob background + photo cutout + floating icon badges, "Our Core Values" (3 photo cards), 4-icon feature row, Programs (photo + accordion split layout), video/story section, stats bar, teachers grid, events card grid, blog article cards, contact form + footer.

Visual language: bold color-blocked sections, rounded cards with soft shadows, scalloped/wave section dividers, circular icon badges connected by dashed lines, playful rounded typography.

**Fonts (confirmed via computed styles on the live template):**
- Headings: **Nunito**, weight 800
- Body/nav text: **Roboto**, weight 500

Both loaded from Google Fonts.

## Tech Stack

Plain static HTML/CSS/JS. No build step, no framework/dependencies — matches the existing `index.html`-based reference site and deploys directly to Vercel.

### File structure

```
E:\wwis\
  index.html
  css/
    style.css
  js/
    main.js          (nav toggle, smooth scroll, accordion behavior)
  assets/
    Logo/            (existing: Logo.png, wwis-logo.svg)
    images/          (hero photo, gallery photos — placeholders until real photos supplied)
```

## Content Scope

Sections from the Kidtime template that WWIS currently has real content for are included; sections requiring data not yet available (Stats/numbers, Teacher profiles, Events, Blog articles) are **excluded** from this first landing page.

### Sections (in order)

1. **Header / Nav**
   - White background (sticky), navy text/logo, maroon CTA button — stays white on scroll, distinct from the navy hero below it
   - WWIS logo (from `assets/Logo/`)
   - Links: Home, About, Programs, Gallery, Contact (in-page anchors)
   - "Reach Out to Us" CTA button

2. **Hero**
   - Organic blob background shape
   - Headline: "Dream school for your child."
   - Subcopy: "We discover your child's strength and build an individual learning plan."
   - Buttons: "Reach Out to Us", "Our Programs"
   - Student photo (placeholder) with floating icon badges (e.g. "24 Skills", "3 Languages")

3. **Welcome / Philosophy**
   - Quote: *"Schools focus on Class but We focus on Individual Child."*
   - ILP (Individual Learning Plan) explanation spanning iPlay → iDiscover → iLead
   - "More About WWIS" link

4. **Programs**
   - Split layout: photo + accordion
   - Three items:
     - **iPlay** (Pre-KG–Grade 2) — brain development · 24 Skills · 3 Languages
     - **iDiscover** (Grade 3–7) — discovering passion · 24 Projects · 8 Professional Skills
     - **iLead** (Grade 8–12) — launch your career · 3 Career Programs · 5 Internships

5. **Gallery**
   - Card grid, 9 categories: iPlay/Play-Based Learning, Science Lab, Hands-on Learning, iDiscover Studio, iLead/IGCSE Projects, Sport & Fitness, Programming, Makerspace, Imaginative Play
   - Placeholder color-blocked cards until real photos are supplied

6. **Contact + Footer**
   - Phone: +91 81246 48888
   - Address: 11th Sector, 18th Cross, Morais City, Near Airport, Trichy – 620 007
   - Hours: Mon–Sat, 9 AM–5:30 PM
   - "Call Us" and "Visit Contact Page" buttons (Contact Page is a placeholder link — not built yet)
   - Footer: logo, quick links (matching nav), social icons

## Visual System

### Colors (derived from the WWIS logo; approved via mockup comparison — navy-dominant hero selected)

| Role | Color | Hex (approx) |
|---|---|---|
| Primary (hero background, section dividers) | Navy | `#0A3D62` |
| Accent / CTA | Maroon / Crimson | `#C41E52` |
| Secondary accent (icon badges, underlines) | Orange | `#F2A93B` |
| Neutral backgrounds | White / soft gray | `#FFFFFF` / `#F5F6FA` |
| Body text | Dark navy | `#1B2A38` (approx) |

Hero uses navy as the dominant background color, with a maroon organic blob shape behind the photo and orange accent badges — validated via a side-by-side mockup comparison (Option A: navy-dominant vs Option B: maroon-dominant); user selected Option A.

Sections after the hero alternate white and soft-gray backgrounds with navy body text; only the hero and section dividers carry the bold brand color.

### Typography

- Headings: Nunito, 700–800 weight
- Body: Roboto, 400–500 weight
- Both loaded via Google Fonts `<link>` tags

### Shapes / Motifs (carried over from Kidtime)

- Organic blob shapes behind hero content
- Scalloped/wave dividers between sections
- Circular icon badges with dashed connector lines
- Rounded cards with soft drop shadows

### Imagery

Real WWIS photos are not yet available for this build. Gallery and hero image slots use styled, labeled placeholder blocks (color-blocked, not gray boxes) sized and positioned correctly so real photos can be dropped in later without layout changes.

## Interactions & Responsiveness

- Sticky header; nav collapses to a hamburger menu under ~768px viewport width
- Smooth-scroll behavior for in-page anchor links (Programs, Gallery, Contact)
- Programs section uses accordion expand/collapse per stage (iPlay/iDiscover/iLead)
- Gallery cards have a hover lift/scale effect
- Contact section phone number is a `tel:` link
- Fully responsive: single-column stacking on mobile; hero photo moves below text content

## Testing

No automated test suite for a static HTML/CSS/JS page. Verification is manual:

- Render check across desktop, tablet, and mobile viewport widths
- Confirm nav hamburger toggle and Programs accordion function correctly
- Confirm smooth-scroll anchors land on the correct sections
- Check color contrast (navy/maroon/orange against white and against each other) for basic accessibility
- Visual review against the approved hero mockup and section list above

## Out of Scope (this spec)

- Stats bar, Teacher profiles, Events, Blog sections (no real content yet)
- Additional pages (About, full Programs detail, Blog, Team, Events, Career, Find Us) — future work, not part of this landing page
- Real photography — placeholders only until supplied
- CMS/backend integration, contact form submission handling
