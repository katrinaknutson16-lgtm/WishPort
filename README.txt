WISHPORT — CLEAN EXPLORER LAYOUT (NOVEMBER 2026)

WHAT CHANGED
- Database and Collections remain at the top (alongside Categories and Villagers).
- Search and cart are directly underneath the main tabs.
- Removed the horizontal quick-filter chips for Materials, DIY, etc.
- All category choices, including Materials and DIY Recipes, are in the Category Selection dropdown.
- Filters follow: Category, Theme, Series, Interaction/Item Type, Colour.
- Pagination navigation is displayed above and below the item cards.
- Items per page and jump-to-page controls remain below the catalog.

WHAT DID NOT CHANGE
- Item database, item codes, image URLs, DIY candidate validation, Villager requests, and 40-slot cart logic.
- Existing order generator still requires testing with your bot, especially item variations and DIY metadata.

TO PUBLISH
Upload index.html, style.css, app.js, catalog-data.js and villagers-data.js to the root of your existing WishPort GitHub repository, replacing files with the same names. Keep Github Pages configured to main/(root).


COLLECTION COVER UPDATE
The Collections page now shows one large real ACNH item picture per collection.
Images are sourced from the uploaded item catalog (acnhcdn image URLs).
The image is a representative item from that collection, not a screenshot of
the entire 40-item arrangement. Missing images show an honest fallback.
Optional custom verified cover images can be added via `coverImage` in app.js.
All six website files are included for simple replacement on GitHub Pages.
