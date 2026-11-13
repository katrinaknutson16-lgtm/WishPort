WISHPORT: REMOVE NON-ORDERABLE CONSTRUCTION REFERENCES

Upload only app.js to the ROOT of the WishPort GitHub repository, replacing the existing app.js.
Back up your currently working app.js first.

What changed:
- Hides Construction entries that have no hex/orderHex item code from the browse/search catalog.
- In the audited base catalog, 353 Construction entries meet that condition (e.g. bridges, doors).
- Does not delete catalog-data.js, change item codes, modify saved orders or collections,
  change cart/order generation, or affect the visual design.
- Existing preview-only item variations and blocked DIY entries remain visible with their
  existing protections; they are NOT silently made orderable. (We have not removed those.)

Checks:
- node --check passed.
- Audited base catalog: 7,802 entries -> 7,449 visible after filtering 353 construction references.
- Expected expanded listing count may differ because catalog-expansion.js multiplies item variations.

IMPORTANT: Based on the latest locally saved category-cleanup app.js. If you've updated
app.js on GitHub afterward, merge this small change into the current file rather than
replacing newer work.
