"use strict";
const express = require("express");
const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT) || 3000;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "https://hassanaliniazi110-cyber.github.io")
  .split(",").map(v => v.trim()).filter(Boolean);
const players = new Map();
const tokenToPlayer = new Map();
const DATA_FILE = process.env.ECLIPSE_DATA_FILE || path.join(__dirname, "eclipse-data.json");
function hashToken(token) { return crypto.createHash("sha256").update(String(token)).digest("hex"); }
function saveData() {
  const data = [...players.values()].map(p => ({ id: p.id, tokenHash: p.tokenHash, profile: p.profile, friends: [...p.friends] }));
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
      const player = { id: p.id, tokenHash: p.tokenHash, profile: normalizeProfile(p.profile), friends: new Set(Array.isArray(p.friends) ? p.friends.filter(validPlayerId).slice(0, 100) : []) };
      players.set(player.id, player); tokenToPlayer.set(player.tokenHash, player.id);
    }
  } catch (e) { if (e.code !== "ENOENT") console.error("Could not load player data:", e.message); }
}
const invites = new Map();
const socketsByPlayer = new Map();
const activeMatches = new Map();
const MAX_PLAYERS = Math.max(100, Math.min(50000, Number(process.env.MAX_PLAYERS) || 5000));
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

function cleanText(value, max = 24) {
  return String(value ?? "").replace(/[<>\u0000-\u001f]/g, "").trim().slice(0, max);
}
function validPlayerId(id) { return /^EA-[A-Z0-9]{3,8}-[A-Z0-9]{3,8}$/.test(String(id || "")); }
function publicProfile(p) {
  return { id: p.id, name: p.profile.name, xp: p.profile.xp, goals: p.profile.goals, saves: p.profile.saves,
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
  const player = { id, tokenHash: hashToken(token), profile, friends: new Set() };
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
app.post("/api/friends", auth, (req, res) => {
  const id = cleanText(req.body?.friendId, 24).toUpperCase();
  if (!validPlayerId(id)) return res.status(400).json({ error: "Invalid player ID" });
  if (id === req.player.id) return res.status(400).json({ error: "You cannot add yourself" });
  const friend = players.get(id);
  if (!friend) return res.status(404).json({ error: "Player not found on this server" });
  if (req.player.friends.size >= 100) return res.status(429).json({ error: "Friend limit reached" });
  req.player.friends.add(id);
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
  if (!target) return res.status(404).json({ error: "Friend is offline or not found" });
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
    activeMatches.set(roomId, { players: new Set([invite.from, invite.to]), createdAt: Date.now() });
    invites.delete(roomId);
    io.to(roomId).emit("match:ready", { roomId });
  });
  socket.on("match:decline", payload => {
    const roomId = cleanText(payload?.roomId, 32), invite = invites.get(roomId);
    if (invite?.to === id) invites.delete(roomId);
  });
  socket.on("match:state", payload => {
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
      clock: Math.max(0, Math.min(90, Number(state.clock) || 0))
    };
    socket.to(roomId).emit("match:state", {
      roomId,
      fromName: players.get(id)?.profile.name || "Friend",
      playerId: id,
      state: safeState
    });
  });
  socket.on("disconnect", () => {
    socketsByPlayer.get(id)?.delete(socket);
    if (!socketsByPlayer.get(id)?.size) socketsByPlayer.delete(id);
    for (const [roomId, match] of activeMatches) {
      if (match.players.has(id)) {
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
server.listen(PORT, () => console.log("Eclipse Arena API listening on " + PORT));
