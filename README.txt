WISHPORT — ACCURATE ITEM IMAGE UPDATE

Images now derive from the actual IMAGE() formulas in the uploaded community ACNH spreadsheet.
Each image is associated with its exact source item row and variation, not a category emoji or generic sofa.
Critters use their Icon Image column, fixing missing abalone and fish images.

The website loads item thumbnails from https://acnhcdn.com/latest/ (ACNH CDN).
If that fails it tries the spreadsheet's nh-cdn.catalogue.ac host.
If both fail the item displays "Image unavailable" rather than an unrelated picture.
Internet access is needed to load external images. The image provider's live availability could not be verified automatically here.

Upload index.html, style.css, app.js, catalog-data.js and README.txt to the existing WishPort GitHub repository main branch root. Do not upload the ZIP itself.

NOTE: Selecting an exact color in the catalog does not guarantee that SysBot's simple $order name command transmits that color. Confirm the generated command against your bot before sharing widely.

Source/attribution: ACNH Community Spreadsheet https://nookipedia.com/wiki/Community:ACNH_Spreadsheet
Animal Crossing game assets belong to Nintendo.


VILLAGERS UPDATE
The Villagers tab includes 417 named villagers from the spreadsheet, with species, personality, birthday and portrait image references.
Selecting a villager appends villager:<internal_id> to the $order command; Raymond = cat23.
If no items are selected, $order nook miles ticket villager:<id> is used to make a valid item+villager command.
Users require an OPEN PLOT and WishPort requires AllowVillagerInjection=true. SysBot injects a villager into slot 0, overwriting whoever is there.
Images use the source spreadsheet CDN and may be unavailable if the third-party CDN is offline. They are NOT bundled into this ZIP.
