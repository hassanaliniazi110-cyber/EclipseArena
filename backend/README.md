# Eclipse Arena backend

## Deploy
1. In Render, select **New → Blueprint** and choose this GitHub repository.
2. Render reads `render.yaml` and creates the Node web service and persistent disk.
3. After deployment, check `https://YOUR-SERVICE.onrender.com/health` for `{"ok":true}`.
4. In Eclipse Arena, open Friends & Progress, paste that HTTPS URL, and press CONNECT.

The GitHub Pages game cannot host a Node server itself; this service is a separate deployment. Profiles and friend lists persist on the attached disk. Device tokens are bearer credentials: keep them private. Use display names only; do not enter private information.

**Prototype limitation:** the server handles IDs, profiles, friend relationships, presence, invitations and relayed room-state events. The current browser football simulation is not yet a fully server-authoritative synchronized match, so this is not finished competitive multiplayer. A public launch should add rate limiting, moderation, stronger account recovery, database backups and authoritative match rules.
