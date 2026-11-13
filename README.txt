WishPort dropdown reliability repair

Upload BOTH index.html and app.js to the MAIN repository folder. Commit both.
This repair embeds all 5 option lists in the HTML and stops app.js clearing them when metadata options are unavailable. It also updates the JavaScript cache version.

The ZIP contains no replacements for catalog-data.js, catalog-expansion.js, CSS, collection presets, or image files.

To verify: on GitHub open index.html and search for <option value="Artwork">. Then on WishPort confirm Category/Theme/Series/Interaction/Colour all have options and that items still display.

If lists stay empty AFTER both files are visibly updated in GitHub, check the catalog-load indicator and JavaScript errors rather than replacing more unrelated files.
