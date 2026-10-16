# Eclipse Arena backend — Wispbyte

## Deploy on Wispbyte
1. Open your Wispbyte client panel and create/open a **Node.js** server.
2. Open **Files** and upload `server.js` and `package.json` from this repository. You can also use Wispbyte's GitHub integration if it is available for your server.
3. Open **Startup** and set the startup command to `npm start` (or `node server.js` if the panel does not install dependencies from package.json automatically).
4. Install the dependencies from `package.json`. Required packages: `express`, `cors`, `express-rate-limit`, `helmet`, and `socket.io`.
5. Make sure the app listens on the assigned port. The server reads `process.env.PORT` and falls back to `3000`.
6. Start the server and check Console/Logs for errors. Use the public HTTPS address provided/configured for your app, if Wispbyte exposes one. The API health check is `/health`.

## Connect the GitHub Pages website
Once the Wispbyte backend is running and you know its public HTTPS URL:
1. Open `config.js` in this repository.
2. Set `backendUrl` to that URL, with no trailing slash.
3. Commit the change. Players will not have a backend URL field to edit; the website loads this configuration automatically.

The backend URL itself is public configuration, not a password. Never put tokens or secrets in `config.js`. Only people with write access to this GitHub repository can change the website configuration, so review repository collaborators and enable two-factor authentication on your GitHub account.

## Security included
- CORS origin allowlist (`ALLOWED_ORIGINS`)
- Helmet security headers
- Request rate limiting and a 12 KB JSON body limit
- Input normalization/validation
- Server-issued bearer tokens and authenticated profile/friend actions

Set `ALLOWED_ORIGINS` in Wispbyte's environment/startup settings to the exact website origin, for example `https://hassanaliniazi110-cyber.github.io` (origin only, no path).

## Important limitations
This starter stores profiles and friends in memory, so data can be lost when the server restarts. It is not yet a persistent production database. A backend URL cannot be guessed automatically by a separate GitHub Pages site; it must be entered once in `config.js` after Wispbyte provides the actual public address.

## Security and player-data notes
- Player profiles and friend lists are stored in `eclipse-data.json` on the backend host. The file is created automatically; back it up privately and do not commit it to the public repository.
- Set `ECLIPSE_DATA_FILE` to a persistent writable path if the host provides one. If the host deletes local files on restart/redeploy, use a managed database instead.
- Tokens are sent to the browser once and stored there by the frontend; the backend stores only SHA-256 token hashes and rotates a token when a valid player reconnects through registration. Do not share browser tokens.
- YouTube Area access is checked by the backend at `/api/youtube/access`; it requires a valid player bearer token. Players without permission can submit a request, and the configured owner can accept or decline it in the website.
- In Wispbyte environment/startup settings, set `YOUTUBE_ADMIN_PLAYER_IDS` to the exact owner player ID(s), separated by commas. Find your player ID in the Eclipse Arena player/profile area after connecting to the backend. Restart the backend after changing this variable. Only these server-configured IDs can review or decide requests.
- Optional: `YOUTUBE_ALLOWED_PLAYER_IDS` can still grant access directly to additional IDs, separated by commas. Access approved through the request panel is saved in `eclipse-youtube-access.json` on the backend host. Make sure the host keeps this file between restarts; use `YOUTUBE_ACCESS_FILE` to set a persistent writable path if needed. Do not put owner IDs or access lists in frontend code.
- This controls access to the YouTube Area inside Eclipse Arena; it does not make public YouTube videos private or stop people opening YouTube directly.
- Profile lookup requires an authenticated token. Match-state score values from clients are not treated as verified scores or used for ranking.
- After updating `server.js`, upload/redeploy the backend on Wispbyte and restart it. GitHub Pages changes alone do not update the API.
