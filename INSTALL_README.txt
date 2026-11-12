WISHPORT — EXACT SCREENSHOT FILTERS, CORRECTED INSTALL

This fixes the missing-filter-data problem. The complete five filter lists and their catalog mappings are EMBEDDED INSIDE app.js. No wishport-filter-data.js is required.

UPLOAD JUST THESE TWO FILES TO THE ROOT OF YOUR EXISTING REPOSITORY:
  1. index.html  (replace)
  2. app.js      (replace)

Do not upload the ZIP itself. Do not remove your catalog-data.js, catalog-expansion.js, collection-presets.js, villagers-data.js, style.css, order-layout.css, or existing picture folders.

After committing, check the GitHub Pages deployment, then reload the page in Safari. The filters are ordered Category / Theme / Series / Interaction / Colour and use the exact 38 / 47 / 56 / 13 / 14 values from the reference screenshots.

Both filter option values and mappings are local, but matching results depend on available metadata. Particularly newer 3.0-only items may not have complete associations. This does not alter safety checks or order codes.

You may leave an old wishport-filter-data.js in your repo if you uploaded one before; this version does not load it.
