WISHPORT CATALOG LOADING REPAIR — 13 NOV 2026

Root cause found in the current uploaded WishPort-main 3.zip:
A JavaScript line comment swallowed the declaration of the app's primary state:
    // Original image styling ... let page=0,filtered=[],chosen=null,pocket=[],fav=new Set();let fillMode=...
Because the declaration never ran, app initialization crashed. A JavaScript syntax check alone cannot detect this.

This update restores the declaration by placing it on its own line.

UPLOAD ONLY app.js to the repository root, replacing the existing app.js.
Keep index.html, catalog-data.js, catalog-expansion.js, collection-presets.js, villagers-data.js, stylesheets and image folders unchanged.

This app.js was taken from the current WishPort-main 3.zip you provided, not an old earlier package. It retains the Plants, Sea Creatures, Picked Flowers, Veggies and Seeds and Starts mappings, drinks cleanup, non-orderable Construction hiding, NMT code 16DB, image styling, and pagination updates.

Checks: node --check passes; source diff confirms the single swallowed declaration was restored. Live Safari verification is still required.

After deployment, open a fresh Safari tab, confirm the catalog loads and check the five dropdowns. If the site still says Loading catalog, check Safari's cached site data and the GitHub Pages deployment status rather than blindly replacing more files.
