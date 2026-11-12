# Eclipse Arena backend — Wispbyte

## Deploy on Wispbyte
1. Open your Wispbyte client panel and create/open a **Node.js 26** server (recommended). Node.js 22 or newer is required; do not use Node.js 19 or older.
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

## Automated checks

- Run `npm test` to syntax-check the backend and browser JavaScript files.
- GitHub Actions runs syntax checks and a production dependency audit on pushes, pull requests, and weekly.
- Dependabot checks npm packages and GitHub Actions weekly.

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


## Apex Strikers owner security update

### Owner two-factor authentication (2FA)

Owner-only actions, including viewing pending YouTube access requests and accepting or declining them, require a current six-digit authenticator code (TOTP). The server reads the private secret from the backend environment variable `APEX_ADMIN_2FA_SECRET`. This implementation uses a Base32 secret, not a hexadecimal key.

1. On a trusted computer, generate a fresh secret with Node.js:
   ```sh
   node -e "const b=require('crypto').randomBytes(20),a='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';let bits=[...b].map(x=>x.toString(2).padStart(8,'0')).join(''),s='';for(let i=0;i<bits.length;i+=5)s+=a[parseInt(bits.slice(i,i+5).padEnd(5,'0'),2)];console.log(s)"
   ```
2. In Wispbyte, open the backend server's **Environment Variables** (or Startup environment) settings. Add `APEX_ADMIN_2FA_SECRET` and paste the generated Base32 value as its value. Do not add quotes or spaces.
3. In the same settings, set `YOUTUBE_ADMIN_PLAYER_IDS` to the owner player ID, for example `EA-4CD88B-8126BD`. Use commas to separate multiple owner IDs.
4. Open an authenticator app, choose **Add account** / **Enter setup key**, name it **Apex Strikers Owner**, paste the same Base32 secret, and select **Time-based** (TOTP).
5. Save the environment variables and restart the Wispbyte backend.
6. Reconnect to Apex Strikers using the configured owner player ID. When the owner request queue or an owner action is opened, enter the current six-digit code shown by the authenticator app.

Codes normally change every 30 seconds. Keep the authenticator device's date and time set automatically. Never put the secret in `config.js`, frontend code, a public repository, a screenshot, or a chat message. Do not share the six-digit codes.

**Important:** a hexadecimal value generated with `crypto.randomBytes(32).toString('hex')` is not the right format for this implementation. Use the Base32 generator above and the exact variable name `APEX_ADMIN_2FA_SECRET`. There is no in-game secret-enrollment button in this version. Normal players can still submit a YouTube access request without entering the owner's code.

This protects owner moderation/admin actions. It does not add email-and-password sign-in or require 2FA for every regular player account. Keep two-factor authentication enabled on the GitHub account that can edit this repository as well.

### Other security and gameplay protections

- The app applies a global API rate limit, registration/invite/profile limits, strict CORS, Helmet, small JSON request limits, audit logging, and limits on concurrent Socket.IO connections and state packets. These are application-level protections, not OS-level Fail2ban. Installing Fail2ban itself requires supported Linux host access and administrator privileges.
- Gem packs use guaranteed, non-random player unlocks; duplicates increase card upgrade levels. Gems are earned through completed game sessions and have a daily cap. Packs do not accept real-money payments.
- Featured event entry sends the selected event ID to the server. Event bonuses are only issued for the matching selected event, not simply for playing the same mode elsewhere.
- Player portraits are real photos from Wikimedia Commons. Their photographer and licence credits are shown in the Apex Market. Each image remains subject to its individual licence and attribution terms.
- Match rewards have server-side session timing, cooldowns, and daily caps, but this is not full anti-cheat: authoritative gameplay validation still requires server-simulated match actions.

After updating `server.js`, `script.js`, `index.html`, or `style.css`, redeploy the frontend and restart/redeploy the Wispbyte backend. GitHub commits do not automatically deploy the Wispbyte API.



## Apex Draft Room

- The player market now sells **Apex Draft Vouchers** for 150 gems each.
- One voucher opens a three-player shortlist. The player chooses one card to sign.
- The server stores voucher balances and active drafts, checks that the selected card was actually offered, and upgrades duplicate picks.
- An active draft expires after five minutes. If a player leaves and returns before expiry, the same draft remains available.
- Voucher purchases and draft picks are logged in the server audit trail.
- Owner two-step verification uses the Base32 secret configured in the Wispbyte environment variable `APEX_ADMIN_2FA_SECRET`. Enter that same key manually into a TOTP authenticator app; Apex Strikers prompts for the current six-digit code during owner-only actions.
- The opening cinematic now uses staggered letter fades and runs for about 8.35 seconds before fading away.
