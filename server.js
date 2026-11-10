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
  const data = [...players.values()].map(p => ({ id: p.id, tokenHash: p.tokenHash, profile: p.profile, friends: [...p.friends], gems: p.gems, ownedCards: p.ownedCards, cardLevels: p.cardLevels, rewardDay: p.rewardDay, rewardGemsToday: p.rewardGemsToday, lastGameClaimAt: p.lastGameClaimAt, eventClaims: p.eventClaims }));
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
      const player = { id: p.id, tokenHash: p.tokenHash, profile: normalizeProfile(p.profile), friends: new Set(Array.isArray(p.friends) ? p.friends.filter(validPlayerId).slice(0, 100) : []), gems: p.gems === undefined ? 250 : Math.max(0, Math.min(1000000, Math.floor(Number(p.gems) || 0))), ownedCards: Array.isArray(p.ownedCards) ? [...new Set(p.ownedCards.filter(x => typeof x === 'string').slice(0, 100))] : ['arham'], cardLevels: p.cardLevels && typeof p.cardLevels === 'object' ? p.cardLevels : {}, rewardDay: String(p.rewardDay || ''), rewardGemsToday: Math.max(0, Math.min(200, Number(p.rewardGemsToday) || 0)), lastGameClaimAt: Math.max(0, Number(p.lastGameClaimAt) || 0), eventClaims: p.eventClaims && typeof p.eventClaims === "object" ? p.eventClaims : {}, gameSession: null };
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
function auditEvent(actorId, action, targetId = "") {
  const entry = { at: new Date().toISOString(), actorId: cleanText(actorId, 24), action: cleanText(action, 64), targetId: cleanText(targetId, 64) };
  try { fs.appendFileSync(AUDIT_FILE, JSON.stringify(entry) + "\\n", { mode: 0o600 }); }
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
  allowedHeaders: ["Content-Type", "Authorization"]
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

app.post("/api/youtube/requests", auth, inviteLimiter, (req, res) => {
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
app.get("/api/admin/audit", auth, (req, res) => {
  if (!youtubeAdminPlayers.has(req.player.id)) return res.status(403).json({ error: "Admin access required." });
  try {
    const lines = fs.readFileSync(AUDIT_FILE, "utf8").trim().split(/\\r?\\n/).filter(Boolean).slice(-100);
    res.json({ events: lines.map(line => { try { return JSON.parse(line); } catch (_) { return null; } }).filter(Boolean) });
  } catch (error) {
    if (error.code === "ENOENT") return res.json({ events: [] });
    return res.status(500).json({ error: "Audit log is temporarily unavailable." });
  }
});
app.get("/api/youtube/requests", auth, (req, res) => {
  if (!youtubeAdminPlayers.has(req.player.id)) return res.status(403).json({ error: "Only the configured Eclipse Arena owner can review requests." });
  res.json({ requests: youtubeAccessData.requests.filter(r => r.status === "pending") });
});
app.post("/api/youtube/requests/:requestId/decision", auth, (req, res) => {
  if (!youtubeAdminPlayers.has(req.player.id)) return res.status(403).json({ error: "Only the configured Eclipse Arena owner can decide requests." });
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
    existing.profile = profile;
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
  const player = { id, tokenHash: hashToken(token), profile, friends: new Set(), gems: 250, ownedCards: ['arham'], cardLevels: { arham: 0 }, rewardDay: '', rewardGemsToday: 0, lastGameClaimAt: 0, eventClaims: {}, gameSession: null };
  players.set(id, player);
  tokenToPlayer.set(player.tokenHash, id);
  saveData();
  res.status(201).json({ playerId: id, token });
});
app.put("/api/profile", auth, profileLimiter, (req, res) => {
  req.player.profile = normalizeProfile(req.body?.profile);
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
const STORE_CARDS = [{id:"arham",name:"Muhammad Arham",ovr:122,position:"ST",country:"SAUDI ARABIA",flag:"SA",rarity:"ELITE"},{id:"messi",name:"Lionel Messi",ovr:123,position:"RW",country:"ARGENTINA",flag:"AR",rarity:"ICON"},{id:"ronaldo",name:"Cristiano Ronaldo",ovr:124,position:"ST",country:"PORTUGAL",flag:"PT",rarity:"ICON"},{id:"mbappe",name:"Kylian Mbappe",ovr:122,position:"ST",country:"FRANCE",flag:"FR",rarity:"ELITE"},{id:"yamal",name:"Lamine Yamal",ovr:121,position:"RW",country:"SPAIN",flag:"ES",rarity:"ELITE"},{id:"haaland",name:"Erling Haaland",ovr:121,position:"ST",country:"NORWAY",flag:"NO",rarity:"ELITE"},{id:"bellingham",name:"Jude Bellingham",ovr:120,position:"CM",country:"ENGLAND",flag:"EN",rarity:"ELITE"},{id:"salah",name:"Mohamed Salah",ovr:120,position:"RW",country:"EGYPT",flag:"EG",rarity:"ELITE"},{id:"debruyne",name:"Kevin De Bruyne",ovr:121,position:"CAM",country:"BELGIUM",flag:"BE",rarity:"ELITE"},{id:"figo",name:"Luis Figo",ovr:119,position:"RW",country:"PORTUGAL",flag:"PT",rarity:"ICON"}];
app.get("/api/store",auth,(req,res)=>res.json({gems:req.player.gems,ownedCards:req.player.ownedCards,cardLevels:req.player.cardLevels,packs:[{id:"scout",name:"SCOUT PACK",cost:100,count:1},{id:"elite",name:"ELITE PACK",cost:250,count:3}]}));
app.post("/api/store/packs",auth,inviteLimiter,(req,res)=>{const packId=cleanText(req.body?.packId,16);const pack=packId==="scout"?{cost:100,count:1}:packId==="elite"?{cost:250,count:3}:null;if(!pack)return res.status(400).json({error:"Unknown pack."});if(req.player.gems<pack.cost)return res.status(409).json({error:"Not enough gems. Play matches to earn more."});req.player.gems-=pack.cost;const pulls=[];for(let i=0;i<pack.count;i++){const card=STORE_CARDS[crypto.randomInt(STORE_CARDS.length)];const level=Math.max(0,Number(req.player.cardLevels[card.id])||0);const duplicate=req.player.ownedCards.includes(card.id);if(!duplicate)req.player.ownedCards.push(card.id);else req.player.cardLevels[card.id]=Math.min(5,level+1);pulls.push({...card,level:req.player.cardLevels[card.id]||0,duplicate,upgraded:duplicate&&level<5});}req.player.ownedCards=[...new Set(req.player.ownedCards)].slice(0,100);saveData();auditEvent(req.player.id,"pack_opened_"+packId,pulls.map(p=>p.id).join(","));res.json({gems:req.player.gems,pulls,ownedCards:req.player.ownedCards,cardLevels:req.player.cardLevels});});
app.post("/api/games/start",auth,inviteLimiter,(req,res)=>{if(req.player.gameSession&&Date.now()-req.player.gameSession.startedAt<1800000)return res.status(409).json({error:"A game reward session is already active."});req.player.gameSession={id:crypto.randomBytes(16).toString("hex"),startedAt:Date.now(),mode:cleanText(req.body?.mode,24)};res.json({sessionId:req.player.gameSession.id});});
app.post("/api/games/complete",auth,inviteLimiter,(req,res)=>{
  const session=req.player.gameSession;
  if(!session||req.body?.sessionId!==session.id)return res.status(409).json({error:"No active game reward session."});
  const elapsed=Date.now()-session.startedAt;
  if(elapsed<5000||elapsed>1800000)return res.status(400).json({error:"Play for at least 20 seconds before claiming a reward."});
  const today=new Date().toISOString().slice(0,10);
  if(req.player.rewardDay!==today){req.player.rewardDay=today;req.player.rewardGemsToday=0;}
  if(req.player.rewardGemsToday>=200){req.player.gameSession=null;saveData();return res.status(429).json({error:"Daily gem reward limit reached."});}
  if(Date.now()-req.player.lastGameClaimAt<45000){req.player.gameSession=null;saveData();return res.status(429).json({error:"Finish another game before claiming more gems."});}
  let reward=25,eventReward=0,eventXp=0,eventId="";
  const eventKey=session.mode==="vsattack"?"game-changers":session.mode==="crossbar"?"neon-derby":session.mode==="goalkeeping"?"last-line":"";
  if(eventKey){
    const period=eventKey==="game-changers"?"week-"+Math.floor(Date.now()/604800000):today;
    req.player.eventClaims=req.player.eventClaims||{};
    const claimKey=eventKey+":"+period;
    if(!req.player.eventClaims[claimKey]){
      eventReward=eventKey==="game-changers"?45:eventKey==="neon-derby"?25:15;
      eventXp=eventKey==="game-changers"?300:eventKey==="neon-derby"?180:90;
      req.player.eventClaims[claimKey]=true;eventId=eventKey;
    }
  }
  reward=Math.min(reward+eventReward,200-req.player.rewardGemsToday);
  req.player.gems=Math.min(1000000,req.player.gems+reward);
  req.player.rewardGemsToday+=reward;req.player.lastGameClaimAt=Date.now();req.player.gameSession=null;
  saveData();auditEvent(req.player.id,"game_reward_claimed",String(reward));
  res.json({gems:req.player.gems,reward,eventReward,eventXp,eventId,dailyEarned:req.player.rewardGemsToday,dailyLimit:200});
});
app.get("/api/leaderboard", auth, (req, res) => {
  const board = [...players.values()].map(publicProfile)
    .sort((a, b) => b.wins - a.wins || b.xp - a.xp || b.goals - a.goals)
    .slice(0, 50)
    .map((p, index) => ({ rank: index + 1, ...p }));
  res.json({ leaderboard: board, updatedAt: new Date().toISOString() });
});
app.get("/api/events",auth,(_req,res)=>{const now=new Date();const week=Math.floor(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate())/604800000);const events=[{id:"game-changers",title:"GAME CHANGERS: ICON REBORN",subtitle:"Legends return. New eras begin.",type:"featured",description:"Build your squad around game-changing football icons.",mode:"vsattack",rewardGems:45,rewardXp:300,endsAt:new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()+(7-now.getUTCDay()))).toISOString()},{id:"neon-derby",title:"NEON DERBY",subtitle:"A city divided. One pitch.",type:"weekly",description:"Take on the derby challenge.",mode:"crossbar",rewardGems:25,rewardXp:180},{id:"last-line",title:"LAST LINE",subtitle:"Keep your fortress standing.",type:"daily",description:"A goalkeeper reaction challenge.",mode:"goalkeeping",rewardGems:15,rewardXp:90}];res.json({featured:events[0],events,rotation:week,serverTime:now.toISOString()});});
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
