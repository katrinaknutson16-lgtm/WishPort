WISHPORT IMAGE AUDIT — PRELIMINARY STRUCTURAL CHECK
Base catalog items: 6,829
Distinct image links: 26,166
Missing/irregular image link metadata: 0
External image files live-tested: NO (external image hosts inaccessible from this environment).
IMPORTANT: A valid-looking URL does not establish that its image loads or matches an item.

Files to upload to root of your WishPort GitHub repository:
- app.js (updated fallback for all catalog images including cart and collection detail)
- index.html (forces refreshed app script)
- image-audit.html (run this in Safari to find URLs which fail on both CDNs)

Keep existing catalog-data.js, catalog-expansion.js, villagers-data.js, style.css,
collection-presets.js, and collection-covers/ unchanged.

Run: https://katrinaknutson16-lgtm.github.io/WishPort/image-audit.html
Use Start audit. The 26K-file scan can take considerable time/data.
Download the CSV and supply it for targeted source corrections.
