WISHPORT — DUPLICATE QUANTITY POLISH

Your existing cart already groups exact matching items by item name, category, variation, pattern, and item code. This update retains that proven per-slot representation and + / − controls.

NEW:
- When a member adds another copy of an item already selected, a short purple notice confirms the quantity increased.
- Cart counter explicitly says Pocket slots X/40 so combined lines do not imply fewer occupied slots.

UNCHANGED:
- 40-slot maximum, per-slot storage, order command generation, exact color codes and variations, DIY stacks, existing saved orders, collections, villager ordering, catalog, filters and design.
- Existing cart shows one line for identical items, with × quantity and + / −. Different variations stay separate.

INSTALL: Back up existing app.js first; replace ONLY app.js at the GitHub repository root. Do not upload README. This was based on locally available WishPort_Final_Reliability_Audit/app.js; if GitHub has newer changes, they need to be merged before replacing it.

CHECK: Add one pink variant, then add it again. The cart shows quantity 2 but 2/40 pocket slots. Add a different color and it stays separate. Test adding the 40th and blocking the 41st item.
