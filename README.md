# Eclipse Arena backend

## Deploy once
1. Create a new Web Service on Render and connect this repository.
2. Render should detect `render.yaml`; confirm the service settings.
3. Set `ALLOWED_ORIGINS` to the exact GitHub Pages origin(s) you use. Do not add URL paths.
4. Deploy and copy the service's HTTPS URL.
5. In `config.js`, set `backendUrl` to that HTTPS URL and commit the change. The website will load it automatically; visitors will not type it into the page.

## Security notes
- The browser no longer chooses the server URL; it is managed in `config.js` in the repository.
- Keep passwords, API keys, and other secrets out of `config.js`; use the host's environment settings.
- The API uses an origin allowlist, security headers, JSON size limits, rate limiting, input validation, and server-issued bearer tokens.
- Only people with write access to this GitHub repository can change the public website configuration. Enable GitHub two-factor authentication and review collaborators.
- This starter keeps profiles/friends in memory, so data is lost if the service restarts. It is a starter backend, not a production database.
