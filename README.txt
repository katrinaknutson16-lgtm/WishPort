WishPort — Keep Scroll Position When Changing Catalog Pages

This update makes the page buttons behave like Pange:
- When you tap Next/Previous/First/Last from the bottom, you stay at the bottom page controls.
- When you tap those controls from the top, you stay by the top page controls.
- Jump to page also preserves your bottom position.

Install: Extract this ZIP and replace ONLY the app.js file in the root of your WishPort GitHub repository. Commit and refresh the website.

This app.js is based on the most recent White Image Background Fix, so your latest category and picture corrections are included. No other files need to change for this pagination update.

Verify: From page 1, scroll to bottom and tap Next; the page should change without jumping to Search. Repeat using the top pagination controls.
