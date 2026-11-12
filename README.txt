WishPort Nook Miles Ticket displayed label correction.

The current public app.js already generates 16DB as the NMT filler ID. However index.html still displays "Uses item code 0EF8". This package changes ONLY that displayed label to 16DB and updates the app.js cache-busting version query so Safari fetches the current app.js.

Upload ONLY index.html to the ROOT of your WishPort GitHub repository, replacing the existing one. Do not overwrite app.js. Your collections and other files remain untouched.

Testing: Static HTML validated: exactly one NMT label, 16DB; crowns=14BB; bells=08A4. Live bot delivery and full ticket stack quantity are not verified.
