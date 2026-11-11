WishPort 3.0 image source update

Upload ONLY app.js and index.html to the ROOT of the WishPort GitHub repository. Do not move or replace collection-covers, catalog-data.js, collection-presets.js, villagers-data.js or catalog-expansion.js.

The patch prioritizes the catalogue mirror for 3.0 images and tries the legacy CDN if needed. Some 3.0 images are missing from both services and may still show Image unavailable. This patch does not verify every image and does not change any item codes or order safety checks.
