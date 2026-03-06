# Dahiya Family Restaurant Website

## Files
- `index.html` - complete structure of the website.
- `style.css` - full styling, responsive layout, colors, cards, animation styles, dark mode theme variables.
- `script.js` - interactivity: loader, reveal animations, counters, lightbox, mobile menu, dark mode, add-to-cart, cart drawer, online ordering, contact form validation.

## How to run
1. Open `index.html` in any modern browser.
2. No build tools or dependencies are required.

## Feature mapping
- Sticky navbar with smooth scroll links.
- Hero with CTA buttons (`View Menu`, `Book Table`, `Order Online`).
- About section with icon cards and animated counters.
- Menu cards with category-based food lists, prices, and `Add to Cart` buttons.
- Cart drawer with item quantity controls and live total.
- Online order section with cart summary and WhatsApp order placement.
- Gallery with lightbox preview on image click.
- Customer review cards with animated star ratings.
- Location section with embedded map and business details.
- Contact form with client-side validation.
- WhatsApp and Call buttons.
- Loading animation on startup.
- Floating `Order Now` button.
- Dark mode toggle with saved preference using `localStorage`.
- Cart data stored in `localStorage` so items stay after refresh.

## Customize quickly
- Update phone number in `index.html` at WhatsApp and Call links.
- Update WhatsApp number in `script.js` (`wa.me/919876543210`) for online order routing.
- Replace Unsplash image URLs with your own photos for branding.
- Change color palette in `:root` variables inside `style.css`.
- For real form submission, connect the form to a backend API (currently frontend-only).
