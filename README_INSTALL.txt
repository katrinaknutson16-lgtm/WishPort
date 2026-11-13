WishPort — Plants / Category Results Fix

Replace ONLY app.js in the ROOT of your GitHub WishPort repository.
Back up the current app.js first. Do not replace index.html or catalog-data.js.

What changed
- Selecting a Category now clears any previously selected quick filter, hidden
  game version, search query, theme, series, interaction and colour filters.
- Selecting a category from the category browsing tiles does the same.
- After selecting a category, other filters can be applied normally to narrow it.
- No changes to item IDs, collections, cart, saved orders, filler codes,
  quantity grouping, villager requests, or website appearance.

Why
- Previous quick-pill and game-version selections stayed active when switching
  Category. Plants primarily uses original-version items, so a lingering
  3.0-only filter could make Plants look empty.

Verification
- Verified 312 Plant base entries in the local catalog and metadata.
- JavaScript syntax passed node --check.
- Live Safari/browser behavior and bot fulfillment not tested.

Check after install
1. In Database choose Plants. You should see results, not 0.
2. Pick a Theme/Colour to confirm refining works after choosing Plants.
3. Your cart and order command should still be unchanged.
