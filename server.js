"use strict";

// Load .env values when present, without overriding environment variables set by the host.
// Wispbyte's dashboard environment variables take priority over values in a local .env file.
const fs = require("fs");
const path = require("path");
function loadDotEnv(filePath = path.join(__dirname, ".env")) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const separator = line.indexOf("=");
      if (separator <= 0) continue;
      const key = line.slice(0, separator).trim();
      let value = line.slice(separator + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(key) && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    if (error.code !== "ENOENT") console.error("Could not read .env:", error.message);
  }
}
loadDotEnv();
const express = require("express");
const http = require("http");
const crypto = require("crypto");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT) || 11914;
const defaultOrigins = [
  "https://hassanaliniazi110-cyber.github.io",
  "https://eclipsearena.apexstrikers.workers.dev"
];
const configuredOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",").map(v => v.trim()).filter(Boolean);
const allowedOrigins = [...new Set([...defaultOrigins, ...configuredOrigins])];
const players = new Map();
const tokenToPlayer = new Map();
const DATA_FILE = process.env.ECLIPSE_DATA_FILE || path.join(__dirname, "eclipse-data.json");
function hashToken(token) { return crypto.createHash("sha256").update(String(token)).digest("hex"); }
function saveData() {
  const data = [...players.values()].map(p => ({ id: p.id, tokenHash: p.tokenHash, profile: p.profile, friends: [...p.friends], gems: p.gems, ownedCards: p.ownedCards, cardLevels: p.cardLevels, draftVouchers: p.draftVouchers, activeDraft: p.activeDraft, rewardDay: p.rewardDay, rewardGemsToday: p.rewardGemsToday, lastGameClaimAt: p.lastGameClaimAt, eventClaims: p.eventClaims }));
  const temp = DATA_FILE + ".tmp";
  fs.writeFileSync(temp, JSON.stringify({ version: 1, players: data }), { mode: 0o600 });
  fs.renameSync(temp, DATA_FILE);
}
function loadData() {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    if (data.version !== 1 || !Array.isArray(data.players)) return;
    for (const p of data.players.slice(0, MAX_PLAYERS)) {
      if (!validPlayerId(p.id) || !/^[a-f0-9]{64}$/i.test(p.tokenHash || "")) continue;
      const player = { id: p.id, tokenHash: p.tokenHash, profile: normalizeProfile(p.profile), friends: new Set(Array.isArray(p.friends) ? p.friends.filter(validPlayerId).slice(0, 100) : []), gems: p.gems === undefined ? 250 : Math.max(0, Math.floor(Number(p.gems) || 0)), ownedCards: Array.isArray(p.ownedCards) ? [...new Set(p.ownedCards.filter(x => typeof x === 'string').slice(0, 100))] : ['arham'], cardLevels: p.cardLevels && typeof p.cardLevels === 'object' ? p.cardLevels : {}, draftVouchers: Math.max(0,Math.min(99,Number(p.draftVouchers)||0)), activeDraft: p.activeDraft && typeof p.activeDraft==="object" ? p.activeDraft : null, rewardDay: String(p.rewardDay || ''), rewardGemsToday: Math.max(0, Number(p.rewardGemsToday) || 0), lastGameClaimAt: Math.max(0, Number(p.lastGameClaimAt) || 0), eventClaims: p.eventClaims && typeof p.eventClaims === "object" ? p.eventClaims : {}, gameSession: null };
      players.set(player.id, player); tokenToPlayer.set(player.tokenHash, player.id);
    }
  } catch (e) { if (e.code !== "ENOENT") console.error("Could not load player data:", e.message); }
}
const invites = new Map();
const socketsByPlayer = new Map();
const activeMatches = new Map();
const MAX_PLAYERS = Math.max(100, Math.min(50000, Number(process.env.MAX_PLAYERS) || 5000));
// Access is granted only to server-listed player IDs. Never put this list in frontend code.
const youtubeAllowedPlayers = new Set((process.env.YOUTUBE_ALLOWED_PLAYER_IDS || "")
  .split(",").map(value => value.trim().toUpperCase())
  .filter(value => /^EA-[A-Z0-9]{3,8}-[A-Z0-9]{3,8}$/.test(value)));
// Accept one or several owner IDs. Commas, semicolons, and newlines are supported
// so Wispbyte environment-variable formatting cannot silently break the owner list.
const youtubeAdminPlayerIdConfig =
  process.env.YOUTUBE_ADMIN_PLAYER_IDS || process.env.YOUTUBE_ADMIN_PLAYER_ID || "EA-4CD88B-8126BD";
const youtubeAdminPlayers = new Set(youtubeAdminPlayerIdConfig
  .split(/[,;\n\r]+/).map(value => value.trim().toUpperCase())
  .filter(value => /^EA-[A-Z0-9]{3,8}-[A-Z0-9]{3,8}$/.test(value)));
const YOUTUBE_ACCESS_FILE = process.env.YOUTUBE_ACCESS_FILE || path.join(__dirname, "eclipse-youtube-access.json");
const AUDIT_FILE = process.env.APEX_AUDIT_FILE || path.join(__dirname, "apex-security-audit.jsonl");
function requireOwner(req, res, next) {
  if (!youtubeAdminPlayers.has(req.player.id)) return res.status(403).json({ error: "Owner access required." });
  next();
}

function auditEvent(actorId, action, targetId = "") {
  const entry = { at: new Date().toISOString(), actorId: cleanText(actorId, 24), action: cleanText(action, 64), targetId: cleanText(targetId, 64) };
  try { fs.appendFileSync(AUDIT_FILE, JSON.stringify(entry) + "\n", { mode: 0o600 }); }
  catch (error) { console.error("[security audit] Could not write audit event:", error.message); }
}
let youtubeAccessData = { requests: [], approved: [] };
function loadYoutubeAccess() {
  try {
    const saved = JSON.parse(fs.readFileSync(YOUTUBE_ACCESS_FILE, "utf8"));
    if (saved && Array.isArray(saved.requests) && Array.isArray(saved.approved)) {
      youtubeAccessData = { requests: saved.requests.filter(r => r && validPlayerId(r.playerId) && typeof r.status === "string").slice(-1000), approved: saved.approved.filter(validPlayerId) };
    }
  } catch (e) { if (e.code !== "ENOENT") console.error("Could not load YouTube access data:", e.message); }
}
function saveYoutubeAccess() {
  const temp = YOUTUBE_ACCESS_FILE + ".tmp";
  fs.writeFileSync(temp, JSON.stringify(youtubeAccessData), { mode: 0o600 });
  fs.renameSync(temp, YOUTUBE_ACCESS_FILE);
}
function youtubeIsApproved(id) { return youtubeAccessData.approved.includes(id); }
const MAX_PENDING_INVITES = 10000;

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-7", legacyHeaders: false,
  message: { error: "Too many registration attempts. Try again later." }
});
const inviteLimiter = rateLimit({
  windowMs: 60 * 1000, limit: 10, standardHeaders: "draft-7", legacyHeaders: false,
  message: { error: "Too many invite attempts. Please wait a moment." }
});
const gameLimiter = rateLimit({
  windowMs: 60 * 1000, limit: 30, standardHeaders: "draft-7", legacyHeaders: false,
  message: { error: "Too many game actions. Please wait a few seconds before trying again." }
});
const storeLimiter = rateLimit({
  windowMs: 60 * 1000, limit: 15, standardHeaders: "draft-7", legacyHeaders: false,
  message: { error: "Too many store actions. Please wait a moment." }
});
const youtubeRequestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, limit: 6, standardHeaders: "draft-7", legacyHeaders: false,
  message: { error: "Too many YouTube access requests. Please wait before trying again." }
});
const profileLimiter = rateLimit({
  windowMs: 60 * 1000, limit: 30, standardHeaders: "draft-7", legacyHeaders: false,
  message: { error: "Too many profile updates. Please wait a moment." }
});
function pruneExpiredInvites() {
  const cutoff = Date.now() - 5 * 60 * 1000;
  for (const [id, invite] of invites) if (invite.createdAt < cutoff) invites.delete(id);
}


app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Admin-2FA"]
}));
app.use(express.json({ limit: "12kb", strict: true }));
app.use(rateLimit({ windowMs: 60 * 1000, limit: 90, standardHeaders: "draft-7", legacyHeaders: false }));
app.get("/health", (_req, res) => res.json({ ok: true, service: "Eclipse Arena API" }));
// Public, read-only comments endpoint. Keep YOUTUBE_API_KEY on the server, never in frontend files.
app.get("/api/youtube/comments", async (req, res) => {
  const videoId = String(req.query.videoId || "");
  const pageToken = String(req.query.pageToken || "");
  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
    return res.status(400).json({ error: "A valid single YouTube video ID is required." });
  }
  if (pageToken && !/^[A-Za-z0-9_-]{1,500}$/.test(pageToken)) {
    return res.status(400).json({ error: "Invalid comments page token." });
  }
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "YouTube comments are not configured yet. The owner must add YOUTUBE_API_KEY to the backend environment." });
  try {
    const params = new URLSearchParams({
      part: "snippet",
      videoId,
      maxResults: "20",
      order: "relevance",
      textFormat: "plainText",
      key: apiKey
    });
    if (pageToken) params.set("pageToken", pageToken);
    const upstream = await fetch("https://www.googleapis.com/youtube/v3/commentThreads?" + params.toString(), {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(10000)
    });
    const payload = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const reason = payload?.error?.errors?.[0]?.reason || "";
      if (reason === "commentsDisabled" || reason === "disabledComments") {
        return res.json({ comments: [], nextPageToken: "", message: "Comments are disabled for this video." });
      }
      console.error("[YouTube comments API]", upstream.status, reason || "request failed");
      return res.status(upstream.status === 404 ? 404 : 502).json({
        error: reason === "commentsDisabled" || reason === "disabledComments"
          ? "Comments are disabled for this video."
          : "YouTube could not return comments. Check the API key, quota, and video comment settings."
      });
    }
    const comments = (Array.isArray(payload.items) ? payload.items : []).map(item => {
      const snippet = item?.snippet?.topLevelComment?.snippet || {};
      return {
        author: String(snippet.authorDisplayName || "YouTube user").slice(0, 100),
        text: String(snippet.textDisplay || "").slice(0, 5000),
        likeCount: Math.max(0, Number(snippet.likeCount) || 0),
        publishedAt: String(snippet.publishedAt || "")
      };
    });
    return res.json({ comments, nextPageToken: payload.nextPageToken || "" });
  } catch (error) {
    console.error("[YouTube comments request]", error.name || "Error");
    return res.status(504).json({ error: "YouTube comments request timed out. Please try again." });
  }
});

app.get("/api/youtube/access", auth, (req, res) => {
  const playerId = req.player.id;
  const latest = [...youtubeAccessData.requests].reverse().find(r => r.playerId === playerId);
  const isAdmin = youtubeAdminPlayers.has(playerId);
  // Temporary troubleshooting log: reports only the current player ID, admin count, and match result.
  console.log("[YouTube admin check]", {
    currentPlayerId: playerId,
    configuredAdminCount: youtubeAdminPlayers.size,
    isAdmin
  });
  // Owners always have access; other players need a one-entry owner approval.
  const allowed = isAdmin || youtubeIsApproved(playerId);
  // Consume one-entry approvals only for non-owner players.
  if (!isAdmin && allowed && youtubeAccessData.approved.includes(playerId)) {
    youtubeAccessData.approved = youtubeAccessData.approved.filter(id => id !== playerId);
    saveYoutubeAccess();
  }
  return res.json({
    allowed,
    isAdmin,
    requestStatus: latest?.status || "none",
    diagnostics: {
      currentPlayerId: playerId,
      adminIdConfigured: youtubeAdminPlayers.size > 0,
      configuredAdminCount: youtubeAdminPlayers.size,
      currentPlayerIsAdmin: isAdmin
    }
  });
});
app.post("/api/youtube/leave", auth, (req, res) => {
  const playerId = req.player.id;
  const wasApproved = youtubeAccessData.approved.includes(playerId);
  youtubeAccessData.approved = youtubeAccessData.approved.filter(id => id !== playerId);
  if (wasApproved) saveYoutubeAccess();
  res.json({ ok: true, permissionRevoked: wasApproved });
});

app.post("/api/youtube/requests", auth, youtubeRequestLimiter, (req, res) => {
  const playerId = req.player.id;
  if (youtubeIsApproved(playerId)) return res.json({ status: "approved", message: "You already have access." });
  const message = cleanText(req.body?.message || "Please approve my access to the YouTube Area.", 240);
  const existing = [...youtubeAccessData.requests].reverse().find(r => r.playerId === playerId && r.status === "pending");
  if (existing) return res.json({ status: "pending", message: "Your request is already waiting for the owner." });
  youtubeAccessData.requests.push({ id: crypto.randomBytes(8).toString("hex"), playerId, name: req.player.profile.name, message, status: "pending", createdAt: new Date().toISOString() });
  youtubeAccessData.requests = youtubeAccessData.requests.slice(-1000);
  saveYoutubeAccess();
  res.status(201).json({ status: "pending", message: "Your request was sent to the owner." });
});
app.get("/api/admin/audit", auth, requireOwner, (req, res) => {
  try {
    const lines = fs.readFileSync(AUDIT_FILE, "utf8").trim().split(/\r?\n/).filter(Boolean).slice(-100);
    res.json({ events: lines.map(line => { try { return JSON.parse(line); } catch (_) { return null; } }).filter(Boolean) });
  } catch (error) {
    if (error.code === "ENOENT") return res.json({ events: [] });
    return res.status(500).json({ error: "Audit log is temporarily unavailable." });
  }
});
app.get("/api/youtube/requests", auth, requireOwner, (req, res) => {
  res.json({ requests: youtubeAccessData.requests.filter(r => r.status === "pending") });
});
app.post("/api/youtube/requests/:requestId/decision", auth, requireOwner, (req, res) => {
  const request = youtubeAccessData.requests.find(r => r.id === req.params.requestId && r.status === "pending");
  if (!request) return res.status(404).json({ error: "Request not found or already handled." });
  const decision = req.body?.decision;
  if (decision !== "accept" && decision !== "decline") return res.status(400).json({ error: "Decision must be accept or decline." });
  request.status = decision === "accept" ? "approved" : "declined";
  if (decision === "accept" && !youtubeAccessData.approved.includes(request.playerId)) youtubeAccessData.approved.push(request.playerId);
  if (decision === "decline") youtubeAccessData.approved = youtubeAccessData.approved.filter(id => id !== request.playerId);
  saveYoutubeAccess();
  auditEvent(req.player.id, "youtube_access_" + request.status, request.playerId);
  res.json({ ok: true, status: request.status, playerId: request.playerId });
});

function cleanText(value, max = 24) {
  return String(value ?? "").replace(/[<>\u0000-\u001f]/g, "").trim().slice(0, max);
}
function validPlayerId(id) { return /^EA-[A-Z0-9]{3,8}-[A-Z0-9]{3,8}$/.test(String(id || "")); }
function publicProfile(p) {
  return { id: p.id, name: p.profile.name, gems: p.gems || 0, ownedCards: p.ownedCards || [], cardLevels: p.cardLevels || {}, xp: p.profile.xp, goals: p.profile.goals, saves: p.profile.saves,
    wins: p.profile.wins, best: p.profile.best, player: p.profile.player, goalkeeper: p.profile.goalkeeper,
    ovr: p.profile.ovr, online: Boolean(socketsByPlayer.get(p.id)?.size) };
}
function auth(req, res, next) {
  const match = /^Bearer\s+([a-f0-9]{64})$/i.exec(req.get("authorization") || "");
  const id = match && tokenToPlayer.get(hashToken(match[1]));
  if (!id || !players.has(id)) return res.status(401).json({ error: "Authentication required. Reconnect to the server." });
  req.player = players.get(id);
  next();
}
function normalizeProfile(input = {}) {
  const n = v => Number.isFinite(Number(v)) ? Math.max(0, Math.min(10000000, Math.floor(Number(v))) ) : 0;
  return {
    name: cleanText(input.name || "Eclipse Player", 24) || "Eclipse Player",
    xp: n(input.xp), goals: n(input.goals), saves: n(input.saves), wins: n(input.wins), best: n(input.best),
    player: cleanText(input.player, 40), goalkeeper: cleanText(input.goalkeeper, 40),
    ovr: Math.max(0, Math.min(999, n(input.ovr)))
  };
}
app.post("/api/register", registerLimiter, (req, res) => {
  const profile = normalizeProfile(req.body?.profile);
  const bearer = /^Bearer\s+([a-f0-9]{64})$/i.exec(req.get("authorization") || "");
  const existingId = bearer && tokenToPlayer.get(hashToken(bearer[1]));
  if (existingId && players.has(existingId)) {
    const existing = players.get(existingId);
    existing.profile = { ...existing.profile, name: profile.name, player: profile.player, goalkeeper: profile.goalkeeper, ovr: profile.ovr };
    tokenToPlayer.delete(existing.tokenHash);
    const rotatedToken = crypto.randomBytes(32).toString("hex");
    existing.tokenHash = hashToken(rotatedToken);
    tokenToPlayer.set(existing.tokenHash, existing.id);
    saveData();
    return res.json({ playerId: existing.id, token: rotatedToken });
  }
  if (players.size >= MAX_PLAYERS) return res.status(503).json({ error: "The server is full. Please try again later." });
  let id;
  do { id = "EA-" + crypto.randomBytes(3).toString("hex").toUpperCase() + "-" + crypto.randomBytes(3).toString("hex").toUpperCase(); } while (players.has(id));
  const token = crypto.randomBytes(32).toString("hex");
  const safeNewProfile = normalizeProfile({ name: profile.name, player: profile.player, goalkeeper: profile.goalkeeper, ovr: profile.ovr });
  const player = { id, tokenHash: hashToken(token), profile: safeNewProfile, friends: new Set(), gems: 250, draftVouchers: 0, activeDraft: null, ownedCards: ['arham'], cardLevels: { arham: 0 }, rewardDay: '', rewardGemsToday: 0, lastGameClaimAt: 0, eventClaims: {}, gameSession: null };
  players.set(id, player);
  tokenToPlayer.set(player.tokenHash, id);
  saveData();
  res.status(201).json({ playerId: id, token });
});
app.put("/api/profile", auth, profileLimiter, (req, res) => {
  const incoming = normalizeProfile(req.body?.profile);
  req.player.profile = { ...req.player.profile, name: incoming.name, player: incoming.player, goalkeeper: incoming.goalkeeper, ovr: incoming.ovr };
  saveData();
  res.json({ profile: publicProfile(req.player) });
});
app.get("/api/friends", auth, (req, res) => {
  const friends = [...req.player.friends].map(id => players.get(id)).filter(Boolean).map(publicProfile);
  res.json({ friends });
});
app.get("/api/players/search", auth, (req, res) => {
  const query = cleanText(req.query?.q || "", 24).toLocaleLowerCase();
  if (query.length < 2) return res.status(400).json({ error: "Enter at least 2 letters to search." });
  const matches = [...players.values()]
    .filter(p => p.id !== req.player.id && p.profile.name.toLocaleLowerCase().includes(query))
    .sort((a, b) => Number(b.profile.name.toLocaleLowerCase() === query) - Number(a.profile.name.toLocaleLowerCase() === query) || a.profile.name.localeCompare(b.profile.name))
    .slice(0, 10)
    .map(publicProfile);
  res.json({ players: matches });
});
app.post("/api/friends", auth, (req, res) => {
  const requestedId = cleanText(req.body?.friendId, 24).toUpperCase();
  const requestedName = cleanText(req.body?.friendName, 24).toLocaleLowerCase();
  let friend = requestedId ? players.get(requestedId) : null;
  if (!friend && requestedName) {
    const matches = [...players.values()].filter(p => p.id !== req.player.id && p.profile.name.toLocaleLowerCase() === requestedName);
    if (matches.length > 1) return res.status(409).json({ error: "More than one player has that name. Search and choose their player ID.", matches: matches.slice(0, 10).map(publicProfile) });
    friend = matches[0] || null;
  }
  if (!friend) return res.status(requestedId || requestedName ? 404 : 400).json({ error: "Player not found. Check the ID or exact display name." });
  if (friend.id === req.player.id) return res.status(400).json({ error: "You cannot add yourself." });
  if (req.player.friends.has(friend.id)) return res.status(409).json({ error: "That player is already your friend." });
  if (req.player.friends.size >= 100) return res.status(429).json({ error: "Friend limit reached." });
  req.player.friends.add(friend.id);
  friend.friends.add(req.player.id);
  saveData();
  res.status(201).json({ friend: publicProfile(friend) });
});
app.post("/api/friends/remove", auth, (req, res) => {
  const id = cleanText(req.body?.friendId, 24).toUpperCase();
  req.player.friends.delete(id);
  players.get(id)?.friends.delete(req.player.id);
  saveData();
  res.json({ ok: true });
});
// Admin can inspect public player profiles only. Authentication tokens and private account secrets are never returned.
app.get("/api/admin/players", auth, (req, res) => {
  if (!youtubeAdminPlayers.has(req.player.id)) {
    return res.status(403).json({ error: "Admin access required." });
  }
  const all = [...players.values()].map(publicProfile)
    .sort((a, b) => Number(b.online) - Number(a.online) || b.xp - a.xp || a.name.localeCompare(b.name));
  res.json({ players: all, total: all.length, online: all.filter(p => p.online).length });
});
const STORE_CARDS = [
  {id:"arham",name:"Muhammad Arham",ovr:122,position:"ST",country:"SAUDI ARABIA",flag:"SA",rarity:"ELITE",image:""},
  {id:"messi",name:"Lionel Messi",ovr:123,position:"RW",country:"ARGENTINA",flag:"AR",rarity:"ICON",image:"https://geofootballguessr.com/footballers/messi.webp"},
  {id:"ronaldo",name:"Cristiano Ronaldo",ovr:124,position:"ST",country:"PORTUGAL",flag:"PT",rarity:"ICON",image:"https://geofootballguessr.com/footballers/ronaldo.webp"},
  {id:"mbappe",name:"Kylian Mbappé",ovr:122,position:"ST",country:"FRANCE",flag:"FR",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/mbappe.webp"},
  {id:"yamal",name:"Lamine Yamal",ovr:121,position:"RW",country:"SPAIN",flag:"ES",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/lamine-yamal.webp"},
  {id:"haaland",name:"Erling Haaland",ovr:121,position:"ST",country:"NORWAY",flag:"NO",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/haaland.webp"},
  {id:"bellingham",name:"Jude Bellingham",ovr:120,position:"CM",country:"ENGLAND",flag:"EN",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/bellingham.webp"},
  {id:"salah",name:"Mohamed Salah",ovr:120,position:"RW",country:"EGYPT",flag:"EG",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/salah.webp"},
  {id:"debruyne",name:"Kevin De Bruyne",ovr:121,position:"CAM",country:"BELGIUM",flag:"BE",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/de-bruyne.webp"},
  {id:"figo",name:"Luis Figo",ovr:119,position:"RW",country:"PORTUGAL",flag:"PT",rarity:"ICON",image:"https://geofootballguessr.com/footballers/luis-figo.webp"},
  {id:"neymar",name:"Neymar Jr.",ovr:122,position:"LW",country:"BRAZIL",flag:"BR",rarity:"GAME CHANGERS",image:"https://geofootballguessr.com/footballers/neymar.webp"},
  {id:"vinicius",name:"Vinícius Júnior",ovr:123,position:"LW",country:"BRAZIL",flag:"BR",rarity:"GAME CHANGERS",image:"https://geofootballguessr.com/footballers/vinicius.webp"},
  {id:"modric",name:"Luka Modrić",ovr:120,position:"CM",country:"CROATIA",flag:"HR",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/modric.webp"},
  {id:"kane",name:"Harry Kane",ovr:122,position:"ST",country:"ENGLAND",flag:"EN",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/kane.webp"},
  {id:"son",name:"Son Heung-min",ovr:121,position:"LW",country:"SOUTH KOREA",flag:"KR",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/son.webp"},
  {id:"lewandowski",name:"Robert Lewandowski",ovr:122,position:"ST",country:"POLAND",flag:"PL",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/lewandowski.webp"},
  {id:"zidane",name:"Zinedine Zidane",ovr:126,position:"CAM",country:"FRANCE",flag:"FR",rarity:"ICON",image:"https://geofootballguessr.com/footballers/zidane.webp"},
  {id:"ronaldinho",name:"Ronaldinho",ovr:126,position:"LW",country:"BRAZIL",flag:"BR",rarity:"ICON",image:"https://geofootballguessr.com/footballers/ronaldinho.webp"},
  {id:"beckham",name:"David Beckham",ovr:124,position:"RM",country:"ENGLAND",flag:"EN",rarity:"ICON",image:"https://geofootballguessr.com/footballers/beckham.webp"},
  {id:"iniesta",name:"Andrés Iniesta",ovr:125,position:"CM",country:"SPAIN",flag:"ES",rarity:"ICON",image:"https://geofootballguessr.com/footballers/iniesta.webp"},
  {id:"xavi",name:"Xavi",ovr:124,position:"CM",country:"SPAIN",flag:"ES",rarity:"ICON",image:"https://geofootballguessr.com/footballers/xavi.webp"},
  {id:"ibrahimovic",name:"Zlatan Ibrahimović",ovr:125,position:"ST",country:"SWEDEN",flag:"SE",rarity:"ICON",image:"https://geofootballguessr.com/footballers/ibrahimovic.webp"},
  {id:"benzema",name:"Karim Benzema",ovr:122,position:"ST",country:"FRANCE",flag:"FR",rarity:"GAME CHANGERS",image:"https://geofootballguessr.com/footballers/benzema.webp"},
  {id:"suarez",name:"Luis Suárez",ovr:121,position:"ST",country:"URUGUAY",flag:"UY",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/suarez.webp"},
  {id:"griezmann",name:"Antoine Griezmann",ovr:121,position:"ST",country:"FRANCE",flag:"FR",rarity:"GAME CHANGERS",image:"https://geofootballguessr.com/footballers/antoine-griezmann.webp"},
  {id:"kaka",name:"Kaká",ovr:124,position:"CAM",country:"BRAZIL",flag:"BR",rarity:"ICON",image:"https://geofootballguessr.com/footballers/kaka.webp"},
  {id:"hazard",name:"Eden Hazard",ovr:121,position:"LW",country:"BELGIUM",flag:"BE",rarity:"GAME CHANGERS",image:"https://geofootballguessr.com/footballers/eden-hazard.webp"},
  {id:"bale",name:"Gareth Bale",ovr:123,position:"RW",country:"WALES",flag:"WA",rarity:"ICON",image:"https://geofootballguessr.com/footballers/bale.webp"},
  {id:"kroos",name:"Toni Kroos",ovr:124,position:"CM",country:"GERMANY",flag:"DE",rarity:"ICON",image:"https://geofootballguessr.com/footballers/toni-kroos.webp"},
  {id:"casemiro",name:"Casemiro",ovr:121,position:"CDM",country:"BRAZIL",flag:"BR",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/casemiro.webp"},
  {id:"pele",name:"Pelé",ovr:128,position:"ST",country:"BRAZIL",flag:"BR",rarity:"ICON",image:"https://geofootballguessr.com/footballers/pele.webp"},
  {id:"ronaldonazario",name:"Ronaldo Nazário",ovr:127,position:"ST",country:"BRAZIL",flag:"BR",rarity:"ICON",image:"https://geofootballguessr.com/footballers/ronaldo-nazario.webp"},
  {id:"henry",name:"Thierry Henry",ovr:126,position:"ST",country:"FRANCE",flag:"FR",rarity:"ICON",image:"https://geofootballguessr.com/footballers/thierry-henry.webp"},
  {id:"pirlo",name:"Andrea Pirlo",ovr:125,position:"CM",country:"ITALY",flag:"IT",rarity:"ICON",image:"https://geofootballguessr.com/footballers/andrea-pirlo.webp"},
  {id:"ramos",name:"Sergio Ramos",ovr:125,position:"CB",country:"SPAIN",flag:"ES",rarity:"ICON",image:"https://a.espncdn.com/i/headshots/soccer/players/full/41579.png"},
  {id:"vandijk",name:"Virgil van Dijk",ovr:126,position:"CB",country:"NETHERLANDS",flag:"NL",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/virgil-van-dijk.webp"},
  {id:"courtois",name:"Thibaut Courtois",ovr:125,position:"GK",country:"BELGIUM",flag:"BE",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/thibaut-courtois.webp"},
  {id:"neuer",name:"Manuel Neuer",ovr:125,position:"GK",country:"GERMANY",flag:"DE",rarity:"ICON",image:"https://geofootballguessr.com/footballers/manuel-neuer.webp"},
  {id:"alisson",name:"Alisson Becker",ovr:123,position:"GK",country:"BRAZIL",flag:"BR",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/alisson.webp"},
  {id:"donnarumma",name:"Gianluigi Donnarumma",ovr:124,position:"GK",country:"ITALY",flag:"IT",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/gianluigi-donnarumma.webp"},
  {id:"casillas",name:"Iker Casillas",ovr:125,position:"GK",country:"SPAIN",flag:"ES",rarity:"ICON",image:"https://geofootballguessr.com/footballers/iker-casillas.webp"},
  {id:"yashin",name:"Lev Yashin",ovr:126,position:"GK",country:"SOVIET UNION",flag:"SU",rarity:"ICON",image:"https://geofootballguessr.com/footballers/lev-yashin.webp"},
  {id:"maldini",name:"Paolo Maldini",ovr:128,position:"LB",country:"ITALY",flag:"IT",rarity:"ICON",image:"https://geofootballguessr.com/footballers/paolo-maldini.webp"},
  {id:"puyol",name:"Carles Puyol",ovr:125,position:"CB",country:"SPAIN",flag:"ES",rarity:"ICON",image:"https://geofootballguessr.com/footballers/carles-puyol.webp"},
  {id:"nesta",name:"Alessandro Nesta",ovr:125,position:"CB",country:"ITALY",flag:"IT",rarity:"ICON",image:"https://geofootballguessr.com/footballers/alessandro-nesta.webp"},
  {id:"cannavaro",name:"Fabio Cannavaro",ovr:125,position:"CB",country:"ITALY",flag:"IT",rarity:"ICON",image:"https://geofootballguessr.com/footballers/fabio-cannavaro.webp"},
  {id:"lahm",name:"Philipp Lahm",ovr:124,position:"RB",country:"GERMANY",flag:"DE",rarity:"ICON",image:"https://geofootballguessr.com/footballers/philipp-lahm.webp"},
  {id:"cafu",name:"Cafu",ovr:125,position:"RB",country:"BRAZIL",flag:"BR",rarity:"ICON",image:"https://geofootballguessr.com/footballers/cafu.webp"},
  {id:"robertocarlos",name:"Roberto Carlos",ovr:126,position:"LB",country:"BRAZIL",flag:"BR",rarity:"ICON",image:"https://geofootballguessr.com/footballers/roberto-carlos.webp"},
  {id:"gerrard",name:"Steven Gerrard",ovr:125,position:"CM",country:"ENGLAND",flag:"EN",rarity:"ICON",image:"https://geofootballguessr.com/footballers/steven-gerrard.webp"},
  {id:"lampard",name:"Frank Lampard",ovr:124,position:"CM",country:"ENGLAND",flag:"EN",rarity:"ICON",image:"https://geofootballguessr.com/footballers/frank-lampard.webp"},
  {id:"scholes",name:"Paul Scholes",ovr:124,position:"CM",country:"ENGLAND",flag:"EN",rarity:"ICON",image:"https://geofootballguessr.com/footballers/paul-scholes.webp"},
  {id:"busquets",name:"Sergio Busquets",ovr:122,position:"CDM",country:"SPAIN",flag:"ES",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/sergio-busquets.webp"},
  {id:"kante",name:"N'Golo Kanté",ovr:123,position:"CDM",country:"FRANCE",flag:"FR",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/ngolo-kante.webp"},
  {id:"vieira",name:"Patrick Vieira",ovr:125,position:"CDM",country:"FRANCE",flag:"FR",rarity:"ICON",image:"https://geofootballguessr.com/footballers/patrick-vieira.webp"},
  {id:"makelele",name:"Claude Makélélé",ovr:122,position:"CDM",country:"FRANCE",flag:"FR",rarity:"ICON",image:"https://geofootballguessr.com/footballers/claude-makelele.webp"},
  {id:"foden",name:"Phil Foden",ovr:122,position:"CAM",country:"ENGLAND",flag:"EN",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/phil-foden.webp"},
  {id:"saka",name:"Bukayo Saka",ovr:122,position:"RW",country:"ENGLAND",flag:"EN",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/bukayo-saka.webp"},
  {id:"palmer",name:"Cole Palmer",ovr:123,position:"CAM",country:"ENGLAND",flag:"EN",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/cole-palmer.webp"},
  {id:"musiala",name:"Jamal Musiala",ovr:123,position:"CAM",country:"GERMANY",flag:"DE",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/jamal-musiala.webp"},
  {id:"wirtz",name:"Florian Wirtz",ovr:123,position:"CAM",country:"GERMANY",flag:"DE",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/florian-wirtz.webp"},
  {id:"odegaard",name:"Martin Ødegaard",ovr:122,position:"CAM",country:"NORWAY",flag:"NO",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/martin-odegaard.webp"},
  {id:"grimaldo",name:"Alejandro Grimaldo",ovr:120,position:"LB",country:"SPAIN",flag:"ES",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/alejandro-grimaldo.webp"},
  {id:"hakimi",name:"Achraf Hakimi",ovr:123,position:"RB",country:"MOROCCO",flag:"MA",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/achraf-hakimi.webp"},
  {id:"trent",name:"Trent Alexander-Arnold",ovr:122,position:"RB",country:"ENGLAND",flag:"EN",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/trent-alexander-arnold.webp"},
  {id:"raphinha",name:"Raphinha",ovr:122,position:"RW",country:"BRAZIL",flag:"BR",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/raphinha.webp"},
  {id:"lautaro",name:"Lautaro Martínez",ovr:123,position:"ST",country:"ARGENTINA",flag:"AR",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/lautaro-martinez.webp"},
  {id:"osimhen",name:"Victor Osimhen",ovr:122,position:"ST",country:"NIGERIA",flag:"NG",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/victor-osimhen.webp"},
  {id:"dybala",name:"Paulo Dybala",ovr:122,position:"CAM",country:"ARGENTINA",flag:"AR",rarity:"ELITE",image:"https://geofootballguessr.com/footballers/paulo-dybala.webp"},
  {id:"sonprime",name:"Son Heung-min (Prime)",ovr:124,position:"LW",country:"SOUTH KOREA",flag:"KR",rarity:"ICON",image:"https://geofootballguessr.com/footballers/son-heung-min.webp"}
  ,
  {id:"eusebio",name:"Eusébio",ovr:126,position:"ST",country:"PORTUGAL",flag:"PT",rarity:"ICON",weight:5,image:""},
  {id:"georgebest",name:"George Best",ovr:125,position:"RW",country:"NORTHERN IRELAND",flag:"NI",rarity:"ICON",weight:6,image:""},
  {id:"cruyff",name:"Johan Cruyff",ovr:128,position:"CF",country:"NETHERLANDS",flag:"NL",rarity:"ICON",weight:3,image:""},
  {id:"beckenbauer",name:"Franz Beckenbauer",ovr:127,position:"CB",country:"GERMANY",flag:"DE",rarity:"ICON",weight:3,image:""},
  {id:"gerdmuller",name:"Gerd Müller",ovr:126,position:"ST",country:"GERMANY",flag:"DE",rarity:"ICON",weight:5,image:""},
  {id:"vanbasten",name:"Marco van Basten",ovr:126,position:"ST",country:"NETHERLANDS",flag:"NL",rarity:"ICON",weight:5,image:""},
  {id:"gullit",name:"Ruud Gullit",ovr:126,position:"CAM",country:"NETHERLANDS",flag:"NL",rarity:"ICON",weight:6,image:""},
  {id:"rijkaard",name:"Frank Rijkaard",ovr:124,position:"CDM",country:"NETHERLANDS",flag:"NL",rarity:"ICON",weight:8,image:""},
  {id:"bergkamp",name:"Dennis Bergkamp",ovr:125,position:"CAM",country:"NETHERLANDS",flag:"NL",rarity:"ICON",weight:7,image:""},
  {id:"seedorf",name:"Clarence Seedorf",ovr:124,position:"CM",country:"NETHERLANDS",flag:"NL",rarity:"ICON",weight:9,image:""},
  {id:"robben",name:"Arjen Robben",ovr:125,position:"RW",country:"NETHERLANDS",flag:"NL",rarity:"ICON",weight:8,image:""},
  {id:"vanpersie",name:"Robin van Persie",ovr:124,position:"ST",country:"NETHERLANDS",flag:"NL",rarity:"ICON",weight:10,image:""},
  {id:"sneijder",name:"Wesley Sneijder",ovr:124,position:"CAM",country:"NETHERLANDS",flag:"NL",rarity:"ICON",weight:10,image:""},
  {id:"vandernistelrooy",name:"Ruud van Nistelrooy",ovr:124,position:"ST",country:"NETHERLANDS",flag:"NL",rarity:"ICON",weight:9,image:""},
  {id:"drogba",name:"Didier Drogba",ovr:125,position:"ST",country:"IVORY COAST",flag:"CI",rarity:"ICON",weight:7,image:""},
  {id:"etoo",name:"Samuel Eto'o",ovr:126,position:"ST",country:"CAMEROON",flag:"CM",rarity:"ICON",weight:5,image:""},
  {id:"yayatoure",name:"Yaya Touré",ovr:125,position:"CM",country:"IVORY COAST",flag:"CI",rarity:"ICON",weight:8,image:""},
  {id:"essien",name:"Michael Essien",ovr:122,position:"CDM",country:"GHANA",flag:"GH",rarity:"ICON",weight:12,image:""},
  {id:"okocha",name:"Jay-Jay Okocha",ovr:124,position:"CAM",country:"NIGERIA",flag:"NG",rarity:"ICON",weight:9,image:""},
  {id:"weah",name:"George Weah",ovr:125,position:"ST",country:"LIBERIA",flag:"LR",rarity:"ICON",weight:8,image:""},
  {id:"mane",name:"Sadio Mané",ovr:123,position:"LW",country:"SENEGAL",flag:"SN",rarity:"ELITE",weight:45,image:""},
  {id:"mahrez",name:"Riyad Mahrez",ovr:123,position:"RW",country:"ALGERIA",flag:"DZ",rarity:"ELITE",weight:42,image:""},
  {id:"ziyech",name:"Hakim Ziyech",ovr:120,position:"CAM",country:"MOROCCO",flag:"MA",rarity:"ELITE",weight:30,image:""},
  {id:"bounou",name:"Yassine Bounou",ovr:121,position:"GK",country:"MOROCCO",flag:"MA",rarity:"ELITE",weight:32,image:""},
  {id:"nakata",name:"Hidetoshi Nakata",ovr:121,position:"CAM",country:"JAPAN",flag:"JP",rarity:"ICON",weight:15,image:""},
  {id:"parksung",name:"Park Ji-sung",ovr:121,position:"CM",country:"SOUTH KOREA",flag:"KR",rarity:"ICON",weight:15,image:""},
  {id:"chabumkun",name:"Cha Bum-kun",ovr:123,position:"ST",country:"SOUTH KOREA",flag:"KR",rarity:"ICON",weight:10,image:""},
  {id:"kagawa",name:"Shinji Kagawa",ovr:119,position:"CAM",country:"JAPAN",flag:"JP",rarity:"ELITE",weight:25,image:""},
  {id:"honda",name:"Keisuke Honda",ovr:120,position:"CAM",country:"JAPAN",flag:"JP",rarity:"ELITE",weight:22,image:""},
  {id:"socrates",name:"Sócrates",ovr:126,position:"CAM",country:"BRAZIL",flag:"BR",rarity:"ICON",weight:5,image:""},
  {id:"rivaldo",name:"Rivaldo",ovr:126,position:"LW",country:"BRAZIL",flag:"BR",rarity:"ICON",weight:5,image:""},
  {id:"romario",name:"Romário",ovr:127,position:"ST",country:"BRAZIL",flag:"BR",rarity:"ICON",weight:4,image:""},
  {id:"zico",name:"Zico",ovr:127,position:"CAM",country:"BRAZIL",flag:"BR",rarity:"ICON",weight:4,image:""},
  {id:"garrincha",name:"Garrincha",ovr:126,position:"RW",country:"BRAZIL",flag:"BR",rarity:"ICON",weight:4,image:""},
  {id:"jairzinho",name:"Jairzinho",ovr:125,position:"RW",country:"BRAZIL",flag:"BR",rarity:"ICON",weight:6,image:""},
  {id:"carlosalberto",name:"Carlos Alberto",ovr:125,position:"RB",country:"BRAZIL",flag:"BR",rarity:"ICON",weight:8,image:""},
  {id:"dunga",name:"Dunga",ovr:122,position:"CDM",country:"BRAZIL",flag:"BR",rarity:"ICON",weight:12,image:""},
  {id:"bebeto",name:"Bebeto",ovr:123,position:"ST",country:"BRAZIL",flag:"BR",rarity:"ICON",weight:10,image:""},
  {id:"adriano",name:"Adriano",ovr:125,position:"ST",country:"BRAZIL",flag:"BR",rarity:"ICON",weight:8,image:""},
  {id:"juninho",name:"Juninho Pernambucano",ovr:123,position:"CAM",country:"BRAZIL",flag:"BR",rarity:"ICON",weight:10,image:""},
  {id:"marcelo",name:"Marcelo",ovr:124,position:"LB",country:"BRAZIL",flag:"BR",rarity:"ICON",weight:12,image:""},
  {id:"danialves",name:"Dani Alves",ovr:124,position:"RB",country:"BRAZIL",flag:"BR",rarity:"ICON",weight:10,image:""},
  {id:"thiagosilva",name:"Thiago Silva",ovr:123,position:"CB",country:"BRAZIL",flag:"BR",rarity:"ELITE",weight:35,image:""},
  {id:"marquinhos",name:"Marquinhos",ovr:122,position:"CB",country:"BRAZIL",flag:"BR",rarity:"ELITE",weight:35,image:""},
  {id:"fabinho",name:"Fabinho",ovr:120,position:"CDM",country:"BRAZIL",flag:"BR",rarity:"ELITE",weight:28,image:""},
  {id:"fernandinho",name:"Fernandinho",ovr:121,position:"CDM",country:"BRAZIL",flag:"BR",rarity:"ELITE",weight:28,image:""},
  {id:"davidluiz",name:"David Luiz",ovr:120,position:"CB",country:"BRAZIL",flag:"BR",rarity:"ELITE",weight:25,image:""},
  {id:"lucio",name:"Lúcio",ovr:124,position:"CB",country:"BRAZIL",flag:"BR",rarity:"ICON",weight:9,image:""},
  {id:"brunofernandes",name:"Bruno Fernandes",ovr:123,position:"CAM",country:"PORTUGAL",flag:"PT",rarity:"ELITE",weight:48,image:""},
  {id:"bernardosilva",name:"Bernardo Silva",ovr:124,position:"CAM",country:"PORTUGAL",flag:"PT",rarity:"ELITE",weight:48,image:""},
  {id:"joaocancelo",name:"João Cancelo",ovr:122,position:"LB",country:"PORTUGAL",flag:"PT",rarity:"ELITE",weight:38,image:""},
  {id:"joaofelix",name:"João Félix",ovr:120,position:"CF",country:"PORTUGAL",flag:"PT",rarity:"ELITE",weight:34,image:""},
  {id:"rafaelleao",name:"Rafael Leão",ovr:123,position:"LW",country:"PORTUGAL",flag:"PT",rarity:"ELITE",weight:48,image:""},
  {id:"kvaratskhelia",name:"Khvicha Kvaratskhelia",ovr:123,position:"LW",country:"GEORGIA",flag:"GE",rarity:"ELITE",weight:42,image:""},
  {id:"isak",name:"Alexander Isak",ovr:122,position:"ST",country:"SWEDEN",flag:"SE",rarity:"ELITE",weight:40,image:""},
  {id:"watkins",name:"Ollie Watkins",ovr:121,position:"ST",country:"ENGLAND",flag:"EN",rarity:"ELITE",weight:34,image:""},
  {id:"rice",name:"Declan Rice",ovr:123,position:"CDM",country:"ENGLAND",flag:"EN",rarity:"ELITE",weight:48,image:""},
  {id:"saliba",name:"William Saliba",ovr:123,position:"CB",country:"FRANCE",flag:"FR",rarity:"ELITE",weight:44,image:""},
  {id:"gabriel",name:"Gabriel Magalhães",ovr:122,position:"CB",country:"BRAZIL",flag:"BR",rarity:"ELITE",weight:38,image:""},
  {id:"thomasmuller",name:"Thomas Müller",ovr:123,position:"CF",country:"GERMANY",flag:"DE",rarity:"ICON",weight:12,image:""},
  {id:"kimmich",name:"Joshua Kimmich",ovr:124,position:"CDM",country:"GERMANY",flag:"DE",rarity:"ELITE",weight:42,image:""},
  {id:"goretzka",name:"Leon Goretzka",ovr:121,position:"CM",country:"GERMANY",flag:"DE",rarity:"ELITE",weight:34,image:""},
  {id:"gnabry",name:"Serge Gnabry",ovr:121,position:"RW",country:"GERMANY",flag:"DE",rarity:"ELITE",weight:32,image:""},
  {id:"sane",name:"Leroy Sané",ovr:122,position:"LW",country:"GERMANY",flag:"DE",rarity:"ELITE",weight:38,image:""},
  {id:"coman",name:"Kingsley Coman",ovr:121,position:"LW",country:"FRANCE",flag:"FR",rarity:"ELITE",weight:34,image:""},
  {id:"ballack",name:"Michael Ballack",ovr:125,position:"CM",country:"GERMANY",flag:"DE",rarity:"ICON",weight:8,image:""},
  {id:"klose",name:"Miroslav Klose",ovr:124,position:"ST",country:"GERMANY",flag:"DE",rarity:"ICON",weight:9,image:""},
  {id:"schweinsteiger",name:"Bastian Schweinsteiger",ovr:124,position:"CM",country:"GERMANY",flag:"DE",rarity:"ICON",weight:9,image:""},
  {id:"matthaus",name:"Lothar Matthäus",ovr:127,position:"CM",country:"GERMANY",flag:"DE",rarity:"ICON",weight:3,image:""},
  {id:"ozil",name:"Mesut Özil",ovr:123,position:"CAM",country:"GERMANY",flag:"DE",rarity:"ICON",weight:12,image:""},
  {id:"gundogan",name:"İlkay Gündoğan",ovr:122,position:"CM",country:"GERMANY",flag:"DE",rarity:"ELITE",weight:35,image:""},
  {id:"havertz",name:"Kai Havertz",ovr:122,position:"CAM",country:"GERMANY",flag:"DE",rarity:"ELITE",weight:36,image:""},
  {id:"davidvilla",name:"David Villa",ovr:125,position:"ST",country:"SPAIN",flag:"ES",rarity:"ICON",weight:8,image:""},
  {id:"torres",name:"Fernando Torres",ovr:125,position:"ST",country:"SPAIN",flag:"ES",rarity:"ICON",weight:8,image:""},
  {id:"raul",name:"Raúl",ovr:125,position:"ST",country:"SPAIN",flag:"ES",rarity:"ICON",weight:7,image:""},
  {id:"pique",name:"Gerard Piqué",ovr:124,position:"CB",country:"SPAIN",flag:"ES",rarity:"ICON",weight:9,image:""},
  {id:"jordialba",name:"Jordi Alba",ovr:122,position:"LB",country:"SPAIN",flag:"ES",rarity:"ELITE",weight:32,image:""},
  {id:"carvajal",name:"Dani Carvajal",ovr:122,position:"RB",country:"SPAIN",flag:"ES",rarity:"ELITE",weight:34,image:""},
  {id:"fabregas",name:"Cesc Fàbregas",ovr:123,position:"CM",country:"SPAIN",flag:"ES",rarity:"ICON",weight:10,image:""},
  {id:"davidsilva",name:"David Silva",ovr:124,position:"CAM",country:"SPAIN",flag:"ES",rarity:"ICON",weight:9,image:""},
  {id:"rooney",name:"Wayne Rooney",ovr:126,position:"ST",country:"ENGLAND",flag:"EN",rarity:"ICON",weight:5,image:""},
  {id:"giggs",name:"Ryan Giggs",ovr:124,position:"LW",country:"WALES",flag:"WA",rarity:"ICON",weight:8,image:""},
  {id:"shearer",name:"Alan Shearer",ovr:125,position:"ST",country:"ENGLAND",flag:"EN",rarity:"ICON",weight:8,image:""},
  {id:"lineker",name:"Gary Lineker",ovr:123,position:"ST",country:"ENGLAND",flag:"EN",rarity:"ICON",weight:10,image:""},
  {id:"owen",name:"Michael Owen",ovr:123,position:"ST",country:"ENGLAND",flag:"EN",rarity:"ICON",weight:10,image:""},
  {id:"cantona",name:"Eric Cantona",ovr:125,position:"CF",country:"FRANCE",flag:"FR",rarity:"ICON",weight:8,image:""},
  {id:"keane",name:"Roy Keane",ovr:124,position:"CDM",country:"IRELAND",flag:"IE",rarity:"ICON",weight:9,image:""},
  {id:"ferdinand",name:"Rio Ferdinand",ovr:124,position:"CB",country:"ENGLAND",flag:"EN",rarity:"ICON",weight:9,image:""},
  {id:"terry",name:"John Terry",ovr:124,position:"CB",country:"ENGLAND",flag:"EN",rarity:"ICON",weight:9,image:""},
  {id:"vidic",name:"Nemanja Vidić",ovr:123,position:"CB",country:"SERBIA",flag:"RS",rarity:"ICON",weight:10,image:""},
  {id:"evra",name:"Patrice Evra",ovr:122,position:"LB",country:"FRANCE",flag:"FR",rarity:"ICON",weight:12,image:""},
  {id:"ashleycole",name:"Ashley Cole",ovr:123,position:"LB",country:"ENGLAND",flag:"EN",rarity:"ICON",weight:10,image:""},
  {id:"garyneville",name:"Gary Neville",ovr:121,position:"RB",country:"ENGLAND",flag:"EN",rarity:"ICON",weight:14,image:""},
  {id:"solcampbell",name:"Sol Campbell",ovr:122,position:"CB",country:"ENGLAND",flag:"EN",rarity:"ICON",weight:12,image:""},
  {id:"wright",name:"Ian Wright",ovr:122,position:"ST",country:"ENGLAND",flag:"EN",rarity:"ICON",weight:12,image:""},
  {id:"desailly",name:"Marcel Desailly",ovr:124,position:"CB",country:"FRANCE",flag:"FR",rarity:"ICON",weight:9,image:""},
  {id:"thuram",name:"Lilian Thuram",ovr:124,position:"CB",country:"FRANCE",flag:"FR",rarity:"ICON",weight:9,image:""},
  {id:"makeleleprime",name:"Claude Makélélé (Prime)",ovr:124,position:"CDM",country:"FRANCE",flag:"FR",rarity:"ICON",weight:8,image:""},
  {id:"henryprime",name:"Thierry Henry (Prime)",ovr:128,position:"ST",country:"FRANCE",flag:"FR",rarity:"ICON",weight:3,image:""},
  {id:"trezeguet",name:"David Trezeguet",ovr:123,position:"ST",country:"FRANCE",flag:"FR",rarity:"ICON",weight:11,image:""},
  {id:"pires",name:"Robert Pirès",ovr:123,position:"LM",country:"FRANCE",flag:"FR",rarity:"ICON",weight:12,image:""},
  {id:"ribery",name:"Franck Ribéry",ovr:124,position:"LW",country:"FRANCE",flag:"FR",rarity:"ICON",weight:9,image:""},
  {id:"benzema_prime",name:"Karim Benzema (Prime)",ovr:126,position:"ST",country:"FRANCE",flag:"FR",rarity:"ICON",weight:5,image:""},
  {id:"griezmannprime",name:"Antoine Griezmann (Prime)",ovr:125,position:"CF",country:"FRANCE",flag:"FR",rarity:"ELITE",weight:28,image:""},
  {id:"pogba",name:"Paul Pogba",ovr:121,position:"CM",country:"FRANCE",flag:"FR",rarity:"ELITE",weight:35,image:""},
  {id:"deschamps",name:"Didier Deschamps",ovr:122,position:"CDM",country:"FRANCE",flag:"FR",rarity:"ICON",weight:12,image:""},
  {id:"blanc",name:"Laurent Blanc",ovr:123,position:"CB",country:"FRANCE",flag:"FR",rarity:"ICON",weight:10,image:""},
  {id:"barthez",name:"Fabien Barthez",ovr:122,position:"GK",country:"FRANCE",flag:"FR",rarity:"ICON",weight:12,image:""},
  {id:"vanpersieprime",name:"Robin van Persie (Prime)",ovr:126,position:"ST",country:"NETHERLANDS",flag:"NL",rarity:"ICON",weight:7,image:""},
  {id:"bergkampprime",name:"Dennis Bergkamp (Prime)",ovr:127,position:"CAM",country:"NETHERLANDS",flag:"NL",rarity:"ICON",weight:6,image:""},
  {id:"kluivert",name:"Patrick Kluivert",ovr:123,position:"ST",country:"NETHERLANDS",flag:"NL",rarity:"ICON",weight:11,image:""},
  {id:"davids",name:"Edgar Davids",ovr:123,position:"CM",country:"NETHERLANDS",flag:"NL",rarity:"ICON",weight:10,image:""},
  {id:"overmars",name:"Marc Overmars",ovr:122,position:"LW",country:"NETHERLANDS",flag:"NL",rarity:"ICON",weight:12,image:""},
  {id:"koeman",name:"Ronald Koeman",ovr:124,position:"CB",country:"NETHERLANDS",flag:"NL",rarity:"ICON",weight:9,image:""},
  {id:"stam",name:"Jaap Stam",ovr:123,position:"CB",country:"NETHERLANDS",flag:"NL",rarity:"ICON",weight:10,image:""},
  {id:"vandersar",name:"Edwin van der Sar",ovr:125,position:"GK",country:"NETHERLANDS",flag:"NL",rarity:"ICON",weight:8,image:""},
  {id:"seedorfprime",name:"Clarence Seedorf (Prime)",ovr:126,position:"CM",country:"NETHERLANDS",flag:"NL",rarity:"ICON",weight:7,image:""},
  {id:"delpiero",name:"Alessandro Del Piero",ovr:126,position:"CF",country:"ITALY",flag:"IT",rarity:"ICON",weight:6,image:""},
  {id:"totti",name:"Francesco Totti",ovr:126,position:"CAM",country:"ITALY",flag:"IT",rarity:"ICON",weight:5,image:""},
  {id:"buffonprime",name:"Gianluigi Buffon (Prime)",ovr:128,position:"GK",country:"ITALY",flag:"IT",rarity:"ICON",weight:3,image:""},
  {id:"baggio",name:"Roberto Baggio",ovr:127,position:"CAM",country:"ITALY",flag:"IT",rarity:"ICON",weight:4,image:""},
  {id:"nestaprime",name:"Alessandro Nesta (Prime)",ovr:127,position:"CB",country:"ITALY",flag:"IT",rarity:"ICON",weight:5,image:""},
  {id:"gattuso",name:"Gennaro Gattuso",ovr:122,position:"CDM",country:"ITALY",flag:"IT",rarity:"ICON",weight:11,image:""},
  {id:"zambrotta",name:"Gianluca Zambrotta",ovr:123,position:"RB",country:"ITALY",flag:"IT",rarity:"ICON",weight:10,image:""},
  {id:"inzaghi",name:"Filippo Inzaghi",ovr:123,position:"ST",country:"ITALY",flag:"IT",rarity:"ICON",weight:10,image:""},
  {id:"vieri",name:"Christian Vieri",ovr:123,position:"ST",country:"ITALY",flag:"IT",rarity:"ICON",weight:10,image:""},
  {id:"pirlo_prime",name:"Andrea Pirlo (Prime)",ovr:127,position:"CM",country:"ITALY",flag:"IT",rarity:"ICON",weight:5,image:""},
  {id:"delpiero_prime",name:"Alessandro Del Piero (Prime)",ovr:128,position:"CF",country:"ITALY",flag:"IT",rarity:"ICON",weight:3,image:""},
  {id:"figo_prime",name:"Luis Figo (Prime)",ovr:126,position:"RW",country:"PORTUGAL",flag:"PT",rarity:"ICON",weight:7,image:""},
  {id:"deco",name:"Deco",ovr:123,position:"CAM",country:"PORTUGAL",flag:"PT",rarity:"ICON",weight:11,image:""},
  {id:"pepe",name:"Pepe",ovr:124,position:"CB",country:"PORTUGAL",flag:"PT",rarity:"ELITE",weight:30,image:""},
  {id:"ricardocarvalho",name:"Ricardo Carvalho",ovr:123,position:"CB",country:"PORTUGAL",flag:"PT",rarity:"ICON",weight:10,image:""},
  {id:"nani",name:"Nani",ovr:121,position:"LW",country:"PORTUGAL",flag:"PT",rarity:"ELITE",weight:28,image:""},
  {id:"quaresma",name:"Ricardo Quaresma",ovr:121,position:"RW",country:"PORTUGAL",flag:"PT",rarity:"ELITE",weight:26,image:""},
  {id:"james",name:"James Rodríguez",ovr:122,position:"CAM",country:"COLOMBIA",flag:"CO",rarity:"ELITE",weight:34,image:""},
  {id:"falcao",name:"Radamel Falcao",ovr:123,position:"ST",country:"COLOMBIA",flag:"CO",rarity:"ICON",weight:11,image:""},
  {id:"valderrama",name:"Carlos Valderrama",ovr:122,position:"CAM",country:"COLOMBIA",flag:"CO",rarity:"ICON",weight:12,image:""},
  {id:"cavani",name:"Edinson Cavani",ovr:122,position:"ST",country:"URUGUAY",flag:"UY",rarity:"ELITE",weight:30,image:""},
  {id:"forlan",name:"Diego Forlán",ovr:124,position:"ST",country:"URUGUAY",flag:"UY",rarity:"ICON",weight:10,image:""},
  {id:"godin",name:"Diego Godín",ovr:122,position:"CB",country:"URUGUAY",flag:"UY",rarity:"ELITE",weight:30,image:""},
  {id:"dimaria",name:"Ángel Di María",ovr:124,position:"RW",country:"ARGENTINA",flag:"AR",rarity:"ELITE",weight:30,image:""},
  {id:"aguero",name:"Sergio Agüero",ovr:126,position:"ST",country:"ARGENTINA",flag:"AR",rarity:"ICON",weight:6,image:""},
  {id:"tevez",name:"Carlos Tévez",ovr:123,position:"ST",country:"ARGENTINA",flag:"AR",rarity:"ICON",weight:10,image:""},
  {id:"crespo",name:"Hernán Crespo",ovr:124,position:"ST",country:"ARGENTINA",flag:"AR",rarity:"ICON",weight:9,image:""},
  {id:"zanetti",name:"Javier Zanetti",ovr:125,position:"RB",country:"ARGENTINA",flag:"AR",rarity:"ICON",weight:7,image:""},
  {id:"veron",name:"Juan Sebastián Verón",ovr:122,position:"CM",country:"ARGENTINA",flag:"AR",rarity:"ICON",weight:11,image:""},
  {id:"mascherano",name:"Javier Mascherano",ovr:122,position:"CDM",country:"ARGENTINA",flag:"AR",rarity:"ICON",weight:12,image:""},
  {id:"simeone",name:"Diego Simeone",ovr:121,position:"CDM",country:"ARGENTINA",flag:"AR",rarity:"ICON",weight:12,image:""},
  {id:"kaka_prime",name:"Kaká (Prime)",ovr:127,position:"CAM",country:"BRAZIL",flag:"BR",rarity:"ICON",weight:4,image:""},
  {id:"ronaldinho_prime",name:"Ronaldinho (Prime)",ovr:128,position:"LW",country:"BRAZIL",flag:"BR",rarity:"ICON",weight:3,image:""},
  {id:"marcelo_prime",name:"Marcelo (Prime)",ovr:126,position:"LB",country:"BRAZIL",flag:"BR",rarity:"ICON",weight:6,image:""},
  {id:"lucio_prime",name:"Lúcio (Prime)",ovr:126,position:"CB",country:"BRAZIL",flag:"BR",rarity:"ICON",weight:6,image:""},
  {id:"jorginho",name:"Jorginho",ovr:121,position:"CDM",country:"ITALY",flag:"IT",rarity:"ELITE",weight:32,image:""},
  {id:"alaba",name:"David Alaba",ovr:123,position:"CB",country:"AUSTRIA",flag:"AT",rarity:"ELITE",weight:30,image:""},
  {id:"modricprime",name:"Luka Modrić (Prime)",ovr:126,position:"CM",country:"CROATIA",flag:"HR",rarity:"ICON",weight:6,image:""},
  {id:"mandzukic",name:"Mario Mandžukić",ovr:122,position:"ST",country:"CROATIA",flag:"HR",rarity:"ELITE",weight:30,image:""},
  {id:"rakitic",name:"Ivan Rakitić",ovr:122,position:"CM",country:"CROATIA",flag:"HR",rarity:"ELITE",weight:30,image:""},
  {id:"perisic",name:"Ivan Perišić",ovr:122,position:"LW",country:"CROATIA",flag:"HR",rarity:"ELITE",weight:30,image:""},
  {id:"dzeko",name:"Edin Džeko",ovr:122,position:"ST",country:"BOSNIA",flag:"BA",rarity:"ELITE",weight:30,image:""},
  {id:"sonprime2",name:"Son Heung-min (Legend)",ovr:126,position:"LW",country:"SOUTH KOREA",flag:"KR",rarity:"ICON",weight:6,image:""}
];
const GAME_CHANGER_CARD_IDS = ["neymar","vinicius","benzema","griezmann","hazard"];
app.get("/api/store",auth,(req,res)=>{if(req.player.activeDraft&&(!Array.isArray(req.player.activeDraft.choices)||req.player.activeDraft.choices.length!==10||req.player.activeDraft.draftVersion!==2)){req.player.activeDraft=null;saveData();}res.set("Cache-Control","no-store");res.json({gems:req.player.gems,draftVouchers:req.player.draftVouchers||0,activeDraft:req.player.activeDraft||null,ownedCards:req.player.ownedCards,cardLevels:req.player.cardLevels,cardCatalog:STORE_CARDS,draft:{name:"APEX PLAYER DRAFT",voucherCost:150,choices:10,pick:1,version:2}});});
app.post("/api/store/vouchers/buy",auth,storeLimiter,(req,res)=>{const quantity=Math.max(1,Math.min(5,Math.floor(Number(req.body?.quantity)||1)));const current=Math.max(0,Number(req.player.draftVouchers)||0);if(current+quantity>99)return res.status(409).json({error:"Your voucher wallet is full. Use some vouchers before buying more."});const cost=150*quantity;if(req.player.gems<cost)return res.status(409).json({error:"Not enough gems for that many draft vouchers."});req.player.gems-=cost;req.player.draftVouchers=current+quantity;saveData();auditEvent(req.player.id,"draft_vouchers_bought",String(quantity));res.json({gems:req.player.gems,draftVouchers:req.player.draftVouchers});});
const DRAFT_WEIGHTS={ronaldo:1,messi:2,figo:3,mbappe:80,yamal:100,haaland:90,bellingham:85,salah:85,debruyne:85,neymar:60,vinicius:70,modric:45,kane:65,son:60,lewandowski:65,zidane:3,ronaldinho:5,beckham:8,iniesta:12,xavi:12,ibrahimovic:6,benzema:35,suarez:28,griezmann:45,kaka:10,hazard:35,bale:30,kroos:28,casemiro:45,pele:3,ronaldonazario:4,henry:7,pirlo:12,ramos:10,vandijk:30,courtois:28,neuer:16,alisson:40,donnarumma:34,casillas:9,yashin:2,maldini:2,puyol:7,nesta:8,cannavaro:9,lahm:12,cafu:9,robertocarlos:6,gerrard:12,lampard:15,scholes:15,busquets:35,kante:30,vieira:8,makelele:12,foden:55,saka:50,palmer:45,musiala:45,wirtz:45,odegaard:42,grimaldo:35,hakimi:40,trent:40,raphinha:45,lautaro:40,osimhen:38,dybala:32,sonprime:20};
const draftWeight=card=>Math.max(1,Number(DRAFT_WEIGHTS[card.id]??card.weight)||1);
function weightedDraftPick(items){const total=items.reduce((sum,card)=>sum+draftWeight(card),0);let roll=crypto.randomInt(total);for(const card of items){roll-=draftWeight(card);if(roll<0)return card;}return items[items.length-1];}
function draftChanceInTen(targetId,pool){const target=pool.find(card=>card.id===targetId);if(!target)return 0;const total=pool.reduce((sum,card)=>sum+draftWeight(card),0);return Math.max(0,Math.min(100,(1-Math.pow(1-draftWeight(target)/total,Math.min(10,pool.length)))*100));}
app.post("/api/store/draft/start",auth,storeLimiter,(req,res)=>{if(req.player.activeDraft&&req.player.activeDraft.expiresAt>Date.now()&&req.player.activeDraft.draftVersion===2&&Array.isArray(req.player.activeDraft.choices)&&req.player.activeDraft.choices.length===10)return res.json({draft:req.player.activeDraft,draftVouchers:req.player.draftVouchers||0,choiceCount:10});if(req.player.activeDraft)req.player.activeDraft=null;if((req.player.draftVouchers||0)<1)return res.status(409).json({error:"Get an Apex Draft Voucher first."});const pool=STORE_CARDS.filter(card=>card.id!=="arham");if(pool.length<10)return res.status(503).json({error:"Draft pool is unavailable. Try again later."});const odds=Object.fromEntries(pool.map(card=>[card.id,Number(draftChanceInTen(card.id,pool).toFixed(2))]));const remaining=[...pool],choices=[];while(choices.length<10){const picked=weightedDraftPick(remaining);choices.push(picked);remaining.splice(remaining.findIndex(card=>card.id===picked.id),1);}if(choices.length!==10)return res.status(503).json({error:"The draft could not prepare ten unique players. Please try again."});req.player.draftVouchers--;req.player.activeDraft={id:crypto.randomBytes(16).toString("hex"),draftVersion:2,choiceCount:10,createdAt:Date.now(),expiresAt:Date.now()+300000,choices:choices.map(card=>card.id),odds};saveData();auditEvent(req.player.id,"draft_started",req.player.activeDraft.id);res.set("Cache-Control","no-store");res.json({draft:req.player.activeDraft,draftVouchers:req.player.draftVouchers,choices,choiceCount:10});});
app.post("/api/store/draft/choose",auth,storeLimiter,(req,res)=>{const draft=req.player.activeDraft;const cardId=cleanText(req.body?.cardId,24);const draftId=cleanText(req.body?.draftId,64);if(!draft||draft.expiresAt<Date.now()||draft.draftVersion!==2||!Array.isArray(draft.choices)||draft.choices.length!==10){req.player.activeDraft=null;saveData();return res.status(409).json({error:"This is an older draft. Open a fresh ten-player draft."});}if(!draftId||draftId!==draft.id)return res.status(409).json({error:"This draft selection is no longer current. Reopen your active draft."});if(!draft.choices.includes(cardId))return res.status(400).json({error:"That card is not in your current draft."});const card=STORE_CARDS.find(item=>item.id===cardId);if(!card)return res.status(404).json({error:"Player card not found."});const duplicate=req.player.ownedCards.includes(card.id);const level=Math.max(0,Number(req.player.cardLevels[card.id])||0);if(!duplicate)req.player.ownedCards.push(card.id);else req.player.cardLevels[card.id]=Math.min(5,level+1);req.player.ownedCards=[...new Set(req.player.ownedCards)].slice(0,100);req.player.activeDraft=null;saveData();auditEvent(req.player.id,"draft_pick",card.id);res.json({gems:req.player.gems,ownedCards:req.player.ownedCards,cardLevels:req.player.cardLevels,pick:{...card,level:req.player.cardLevels[card.id]||0,duplicate,upgraded:duplicate&&level<5}});});
app.post("/api/games/start",auth,gameLimiter,(req,res)=>{req.player.gameSession={id:crypto.randomBytes(16).toString("hex"),startedAt:Date.now(),mode:cleanText(req.body?.mode,24),eventId:cleanText(req.body?.eventId,32)};res.json({sessionId:req.player.gameSession.id});});
app.post("/api/games/complete",auth,gameLimiter,(req,res)=>{
  const session=req.player.gameSession;
  if(!session||req.body?.sessionId!==session.id)return res.status(409).json({error:"No active game reward session."});
  const elapsed=Date.now()-session.startedAt;
  if(elapsed<5000||elapsed>1800000){req.player.gameSession=null;return res.status(400).json({error:"Play for at least 5 seconds before claiming a reward."});}
  const today=new Date().toISOString().slice(0,10);
  if(req.player.rewardDay!==today){req.player.rewardDay=today;req.player.rewardGemsToday=0;}
  if(Date.now()-req.player.lastGameClaimAt<5000){req.player.gameSession=null;saveData();return res.status(429).json({error:"Start the next game and finish it before claiming more gems."});}
  const reportedScore=Math.max(0,Math.min(5000,Math.floor(Number(req.body?.score)||0)));
  let reward=Math.min(50,15+Math.floor(reportedScore/100)),eventReward=0,eventXp=0,eventId="",eventCard=null;
  const eventKey=["game-changers","neon-derby","last-line"].includes(session.eventId)?session.eventId:"";
  if(eventKey){
    const period=eventKey==="game-changers"?"week-"+Math.floor(Date.now()/604800000):today;
    req.player.eventClaims=req.player.eventClaims||{};
    const claimKey=eventKey+":"+period;
    if(!req.player.eventClaims[claimKey]){
      eventReward=eventKey==="game-changers"?45:eventKey==="neon-derby"?25:15;
      eventXp=eventKey==="game-changers"?300:eventKey==="neon-derby"?180:90;
      req.player.eventClaims[claimKey]=true;eventId=eventKey;
      if(eventKey==="game-changers"){
        const eventPool=STORE_CARDS.filter(card=>GAME_CHANGER_CARD_IDS.includes(card.id));
        if(eventPool.length){
          const awarded=eventPool[crypto.randomInt(eventPool.length)];
          const duplicate=req.player.ownedCards.includes(awarded.id);
          const oldLevel=Math.max(0,Number(req.player.cardLevels[awarded.id])||0);
          const nextLevel=Math.min(5,oldLevel+1);
          if(!duplicate)req.player.ownedCards.push(awarded.id);
          req.player.cardLevels[awarded.id]=nextLevel;
          req.player.ownedCards=[...new Set(req.player.ownedCards)].slice(0,100);
          eventCard={...awarded,rarity:"GAME CHANGERS",ovr:Number(awarded.ovr||0)+nextLevel,level:nextLevel,duplicate,replacedNormalCard:duplicate,upgraded:true};
        }
      }
    }
  }
  reward+=eventReward;
  req.player.gems+=reward;
  req.player.profile.xp=Math.min(10000000,req.player.profile.xp+20+eventXp);
  req.player.rewardGemsToday+=reward;req.player.lastGameClaimAt=Date.now();req.player.gameSession=null;
  saveData();auditEvent(req.player.id,"game_reward_claimed",String(reward));
  if(eventCard)auditEvent(req.player.id,"game_changers_player_awarded",eventCard.id);
  res.json({gems:req.player.gems,reward,eventReward,eventXp,eventId,eventCard,ownedCards:req.player.ownedCards,cardLevels:req.player.cardLevels,dailyEarned:req.player.rewardGemsToday,dailyLimit:null,unlimitedGems:true});
});
app.get("/api/leaderboard", auth, (req, res) => {
  const requested=Math.floor(Number(req.query.limit)||1000);
  const limit=Math.max(1,Math.min(1000,requested));
  const board = [...players.values()].map(publicProfile)
    .sort((a, b) => b.wins - a.wins || b.xp - a.xp || b.goals - a.goals)
    .slice(0, limit)
    .map((p, index) => ({ rank: index + 1, ...p }));
  res.set("Cache-Control","no-store");
  res.json({ leaderboard: board, totalPlayers: players.size, limit, updatedAt: new Date().toISOString() });
});
app.get("/api/events",auth,(_req,res)=>{const now=new Date();const week=Math.floor(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate())/604800000);const events=[{id:"game-changers",title:"GAME CHANGERS: ICON REBORN",subtitle:"Legends return. New eras begin.",type:"featured",description:"Build your squad around game-changing football icons.",mode:"vsattack",rewardGems:45,rewardXp:300,rewardPlayer:"1 GAME CHANGERS PLAYER",endsAt:new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()+(7-now.getUTCDay()))).toISOString()},{id:"neon-derby",title:"NEON DERBY",subtitle:"A city divided. One pitch.",type:"weekly",description:"Take on the derby challenge.",mode:"crossbar",rewardGems:25,rewardXp:180},{id:"last-line",title:"LAST LINE",subtitle:"Keep your fortress standing.",type:"daily",description:"A goalkeeper reaction challenge.",mode:"goalkeeping",rewardGems:15,rewardXp:90}];res.json({featured:events[0],events,rotation:week,serverTime:now.toISOString()});});
app.get("/api/profiles/:id", auth, (req, res) => {
  const id = cleanText(req.params.id, 24).toUpperCase();
  if (!validPlayerId(id)) return res.status(400).json({ error: "Invalid player ID" });
  const p = players.get(id);
  if (!p) return res.status(404).json({ error: "Profile not found" });
  res.json({ profile: publicProfile(p) });
});
app.post("/api/invites", auth, inviteLimiter, (req, res) => {
  pruneExpiredInvites();
  if (invites.size >= MAX_PENDING_INVITES) return res.status(503).json({ error: "Too many pending invites. Try again shortly." });
  const id = cleanText(req.body?.friendId, 24).toUpperCase();
  if (!req.player.friends.has(id)) return res.status(403).json({ error: "Add this player as a friend first" });
  const target = players.get(id);
  if (!target) return res.status(404).json({ error: "Friend not found on this server." });
  if (!socketsByPlayer.get(id)?.size) return res.status(409).json({ error: "That friend is offline. They must connect to Apex Strikers before you can invite them." });
  if (!socketsByPlayer.get(req.player.id)?.size) return res.status(409).json({ error: "Your live game connection is not ready. Reconnect and try again." });
  const roomId = crypto.randomBytes(8).toString("hex");
  invites.set(roomId, { from: req.player.id, to: id, createdAt: Date.now() });
  socketsByPlayer.get(id)?.forEach(s => s.emit("friend:invite", { roomId, fromName: req.player.profile.name }));
  res.status(201).json({ roomId });
});
app.use((err, _req, res, _next) => {
  if (res.headersSent) return;
  const status = err.status || (err.type === "entity.too.large" ? 413 : 400);
  res.status(status).json({ error: status === 413 ? "Request body too large" : "Request rejected" });
});

const io = new Server(server, {
  cors: { origin: allowedOrigins, methods: ["GET", "POST"] },
  maxHttpBufferSize: 16 * 1024,
  connectTimeout: 10000
});
io.use((socket, next) => {
  const id = cleanText(socket.handshake.auth?.playerId, 24).toUpperCase();
  const token = String(socket.handshake.auth?.token || "");
  const player = players.get(id);
  if (!player || !/^[a-f0-9]{64}$/i.test(token) || player.tokenHash !== hashToken(token)) return next(new Error("Authentication required"));
  socket.data.playerId = id;
  next();
});
io.on("connection", socket => {
  const id = socket.data.playerId;
  if (!socketsByPlayer.has(id)) socketsByPlayer.set(id, new Set());
  if (socketsByPlayer.get(id).size >= 3) { socket.disconnect(true); return; }
  socketsByPlayer.get(id).add(socket);
  for (const friendId of players.get(id)?.friends || []) {
    socketsByPlayer.get(friendId)?.forEach(friendSocket => friendSocket.emit("friend:status", { playerId: id, online: true }));
  }
  socket.on("match:accept", payload => {
    pruneExpiredInvites();
    const roomId = cleanText(payload?.roomId, 32);
    const invite = invites.get(roomId);
    if (!invite || invite.to !== id || Date.now() - invite.createdAt > 5 * 60 * 1000) return socket.emit("match:error", { message: "Invite expired or not allowed" });
    const inviterSockets = socketsByPlayer.get(invite.from);
    if (!inviterSockets?.size) {
      invites.delete(roomId);
      return socket.emit("match:error", { message: "The inviting player is no longer online" });
    }
    socket.join(roomId);
    inviterSockets.forEach(s => s.join(roomId));
    const match = { players: new Set([invite.from, invite.to]), createdAt: Date.now(), startAt: Date.now(), states: new Map(), timer: null };
    activeMatches.set(roomId, match);
    invites.delete(roomId);
    io.to(roomId).emit("match:ready", { roomId, startAt: match.startAt, durationSeconds: 90 });
    match.timer = setTimeout(() => {
      if (activeMatches.get(roomId) !== match) return;
      const ids = [...match.players];
      const results = ids.map(playerId => ({ playerId, goals: match.states.get(playerId)?.goals || 0 }));
      activeMatches.delete(roomId);
      io.to(roomId).emit("match:finished", { roomId, finishedAt: Date.now(), players: results });
    }, 90000);
  });
  socket.on("match:decline", payload => {
    const roomId = cleanText(payload?.roomId, 32), invite = invites.get(roomId);
    if (invite?.to === id) invites.delete(roomId);
  });
  let lastStatePacketAt = 0;
  socket.on("match:state", payload => {
    const now = Date.now();
    if (now - lastStatePacketAt < 80) return;
    lastStatePacketAt = now;
    const roomId = cleanText(payload?.roomId, 32);
    const match = activeMatches.get(roomId);
    if (!match || !match.players.has(id) || !socket.rooms.has(roomId)) return;
    if (Date.now() - match.createdAt > 2 * 60 * 60 * 1000) {
      activeMatches.delete(roomId);
      return;
    }
    const state = payload?.state;
    if (!state || !Number.isFinite(Number(state.x)) || !Number.isFinite(Number(state.y))) return;
    const safeState = {
      x: Math.max(0.05, Math.min(0.95, Number(state.x))),
      y: Math.max(0.05, Math.min(0.95, Number(state.y))),
      goals: Math.max(0, Math.min(99, Math.floor(Number(state.goals) || 0))),
      hasBall: Boolean(state.hasBall),
      ballX: Number.isFinite(Number(state.ballX)) ? Math.max(0.02, Math.min(0.98, Number(state.ballX))) : 0.5,
      ballY: Number.isFinite(Number(state.ballY)) ? Math.max(0.02, Math.min(0.98, Number(state.ballY))) : 0.5,
      clock: Math.max(0, Math.min(90, Number(state.clock) || 0))
    };
    match.states.set(id, safeState);
    const serverClock = Math.min(90, (Date.now() - match.startAt) / 1000);
    socket.to(roomId).emit("match:state", {
      roomId,
      fromName: players.get(id)?.profile.name || "Friend",
      playerId: id,
      serverClock,
      state: safeState
    });
  });
  socket.on("disconnect", () => {
    socketsByPlayer.get(id)?.delete(socket);
    if (!socketsByPlayer.get(id)?.size) socketsByPlayer.delete(id);
    for (const [roomId, match] of activeMatches) {
      if (match.players.has(id)) {
        clearTimeout(match.timer);
        activeMatches.delete(roomId);
        io.to(roomId).emit("match:ended", { message: "A player disconnected" });
      }
    }
    for (const friendId of players.get(id)?.friends || []) {
      socketsByPlayer.get(friendId)?.forEach(s => s.emit("friend:status", { playerId: id, online: false }));
    }
  });
});
loadData();
loadYoutubeAccess();
server.listen(PORT, () => console.log("Eclipse Arena API listening on " + PORT));
