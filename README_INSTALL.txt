WISHPORT: verified catalog startup + iPhone cache-refresh repair

UPLOAD BOTH files in the MAIN folder of the existing GitHub repository:
1. app.js
2. index.html

These are from the current repository, with only the catalog startup variable repair in app.js and a NEW SCRIPT VERSION in index.html so Safari fetches the repaired app.js rather than an old cached copy.

Keep catalog-data.js, catalog-expansion.js, collection-presets.js, all pictures, CSS and villagers-data.js unchanged.

After committing, wait until GitHub Pages finishes deploying, then open the site in a NEW Safari tab.

Check that the catalog shows 26,177 variation listings and that category dropdowns work.

Local headless Chromium inline-script test passed: 26,177 results, 50 item cards, no JS runtime errors. This does not establish successful live GitHub Pages loading or iPhone Safari behavior.
