WISHPORT STABLE RECOVERY — FROM YOUR NOVEMBER 12 BACKUP

This package restores the November 12 backup's matching index.html and application script, but uses a NEW, unique JavaScript filename to avoid Safari's cached app.js.

FILES TO UPLOAD TO YOUR MAIN WISHPORT GITHUB FOLDER:
1. index.html  — replace existing index.html
2. app-recovery-20261113.js  — upload as a NEW file

DO NOT delete current app.js, catalog-data.js, catalog-expansion.js, collection-presets.js, villagers-data.js, photos or styles.

Important: this recovery temporarily reverts category/picture/scrolling changes made AFTER the November 12 backup. Keep your existing veggie-images folder; you may merge later after basic loading works.
The known Nook Miles Ticket filler code is corrected to 16DB in the backup code and label.

When GitHub Pages has published, open your website with a unique URL:
https://katrinaknutson16-lgtm.github.io/WishPort/?recovery=20261113

The only files you replace are index.html plus a new named script. Your 12 collections, data, photos and other assets are still present.

VALIDATION: JavaScript parses with node --check; the required seven external website dependencies are byte-for-byte identical in the backup and current ZIP, but full live iPhone testing remains necessary.
