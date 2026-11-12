WISHPORT — RELIABILITY AUDIT AND FIX (NOVEMBER 12, 2026)

INSTALL: Upload ONLY app.js to the ROOT of your WishPort GitHub repository.
Do not delete or replace catalog-data.js, catalog-expansion.js, collection-presets.js,
index.html, CSS, image folders, or villagers-data.js.

ACTUAL CODE CHANGES
- Saved order restoration now rejects blocked, malformed and unverified item codes
  instead of silently restoring them as if they were safe.
- Saved-order restoration gives a clear slot count when older entries cannot load.
- Item-code resolution will not silently fall back to a default color code when a
  saved variation's exact code is missing.
- The quick-add helper now also validates the item code before adding.

AUDIT RESULTS (using locally available snapshot of catalog and original presets)
- Expanded catalog: 26,177 visual listings including variants.
- Original 12 room collection codes: 11 collections with 40 codes each and
  Colorful Clubhouse with 38. No collection contents or codes were changed.
- Five filter option lists: 38 categories, 47 themes, 56 series, 13
  interactions, 14 colours. The five apparent missing base-category tags
  (Bugs, Fishing, Interior Structures, Plants, Sea Creatures) are actually
  handled by categoryFor category-to-label mapping.
- All 47 themes, 56 series, 13 interactions and 14 colours have at least
  one matching locally tagged expanded catalog item; this does NOT prove
  every item is classified correctly.
- 7,499 expanded variations are flagged preview-only/unverified by the
  original expansion logic, and WishPort must not invent valid bot codes.

REMAINING REAL-WORLD TESTS — CANNOT VERIFY FROM STATIC CODE
- A real Discord bot accepting the generated $order and filling the
  expected inventory slots, including full stacks and DIY recipes.
- Whether the current LIVE GitHub app.js is byte-for-byte identical to
  the attached snapshot used as the starting point.
- Every pictured pattern/color mapping; many two-axis variants lack
  verified order metadata in the original dataset.
- Correct in-game villager awake/asleep states and adoption workflow.

BEFORE DEPLOYING: Keep a backup of your current app.js and compare any
new changes you have made after the prior filter-audit update.
After deploying: hard-refresh browser, test Zen Modern, named order restore,
collection preview/cart, a valid 40-slot order and blocked item handling.
