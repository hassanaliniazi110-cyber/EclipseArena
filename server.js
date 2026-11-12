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
// Bound slow-header and stalled-request exposure on the public API listener.
server.headersTimeout = 20_000;
server.requestTimeout = 30_000;
server.keepAliveTimeout = 5_000;
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
// Recovery keys that have already been consumed. Replays must never create a fresh account.
const revokedDeviceRecoveryKeyHashes = new Set();
const DEFAULT_DATA_FILE = path.join(__dirname, "eclipse-data.json");
const DATA_FILE = path.resolve(process.cwd(), process.env.ECLIPSE_DATA_FILE || DEFAULT_DATA_FILE);
const DATA_FILE_CANDIDATES = [...new Set([
  DATA_FILE,
  DEFAULT_DATA_FILE,
  path.resolve(process.cwd(), "eclipse-data.json")
].flatMap(file => [file, file + ".bak", file + ".backup", file + ".old", file + ".tmp"]))];

// Public legacy leaderboard entries recovered from the November 5 export.
// These are display-only records: no login credentials or token hashes are stored.
const LEGACY_LEADERBOARD_PLAYERS = [
  { id: "EA-4CD88B-8126BD", name: "Monkey D. Luffy", xp: 70, goals: 0, saves: 0, wins: 0, best: 0, player: "Muhammad Arham", goalkeeper: "David Raya", ovr: 92 },
  { id: "EA-669FD8-01FAC3", name: "Master FC Mobile King", xp: 4490, goals: 110, saves: 4, wins: 12, best: 1700, player: "Muhammad Arham", goalkeeper: "David Raya", ovr: 99 },
  { id: "EA-CD608D-89E6C0", name: "Eclipse Player", xp: 0, goals: 0, saves: 0, wins: 0, best: 0, player: "Muhammad Arham", goalkeeper: "David Raya", ovr: 92 },
  { id: "EA-3F79BA-1FE951", name: "Eclipse Player", xp: 0, goals: 0, saves: 0, wins: 0, best: 0, player: "Muhammad Arham", goalkeeper: "David Raya", ovr: 92 },
  { id: "EA-DDAE82-FAC2C1", name: "Eclipse Player", xp: 0, goals: 0, saves: 0, wins: 0, best: 0, player: "Muhammad Arham", goalkeeper: "David Raya", ovr: 92 },
  { id: "EA-F356F8-71EBFF", name: "Eclipse Player", xp: 0, goals: 0, saves: 0, wins: 0, best: 0, player: "Muhammad Arham", goalkeeper: "David Raya", ovr: 92 },
  { id: "EA-76D022-06EE23", name: "Eclipse Player", xp: 590, goals: 12, saves: 2, wins: 1, best: 1000, player: "Muhammad Arham", goalkeeper: "David Raya", ovr: 93 },
  { id: "EA-531D54-C75733", name: "Umar shoaib", xp: 4450, goals: 123, saves: 9, wins: 2, best: 2500, player: "Muhammad Arham", goalkeeper: "David Raya", ovr: 99 },
  { id: "EA-819D55-F7B15E", name: "Eclipse Player", xp: 0, goals: 0, saves: 0, wins: 0, best: 0, player: "Muhammad Arham", goalkeeper: "David Raya", ovr: 92 },
  { id: "EA-EB54E4-344C1A", name: "Master FC Mobile King", xp: 4490, goals: 110, saves: 4, wins: 12, best: 1700, player: "Muhammad Arham", goalkeeper: "David Raya", ovr: 99 },
  { id: "EA-1585BE-4F82D5", name: "Eclipse Player", xp: 0, goals: 0, saves: 0, wins: 0, best: 0, player: "Muhammad Arham", goalkeeper: "David Raya", ovr: 92 },
  { id: "EA-00AAD9-07BD43", name: "Eclipse Player", xp: 0, goals: 0, saves: 0, wins: 0, best: 0, player: "Muhammad Arham", goalkeeper: "David Raya", ovr: 92 },
  { id: "EA-4074F1-22874E", name: "Eclipse Player", xp: 490, goals: 0, saves: 13, wins: 0, best: 1300, player: "Muhammad Arham", goalkeeper: "David Raya", ovr: 92 },
  { id: "EA-AF8701-077619", name: "Eclipse Player", xp: 0, goals: 0, saves: 0, wins: 0, best: 0, player: "Muhammad Arham", goalkeeper: "David Raya", ovr: 92 },
  { id: "EA-3A43D1-6C5386", name: "Monkey D. Luffy", xp: 70, goals: 0, saves: 0, wins: 0, best: 0, player: "Muhammad Arham", goalkeeper: "David Raya", ovr: 92 },
  { id: "EA-B5FADC-B31191", name: "Monkey D. Luffy", xp: 70, goals: 0, saves: 0, wins: 0, best: 0, player: "Muhammad Arham", goalkeeper: "David Raya", ovr: 92 }
];
function hashToken(token) { return crypto.createHash("sha256").update(String(token)).digest("hex"); }
function tokenHashMatches(storedHash, token) {
  if (typeof storedHash !== "string" || !/^[a-f0-9]{64}$/i.test(storedHash)) return false;
  const expected = Buffer.from(storedHash, "hex");
  const supplied = Buffer.from(hashToken(token), "hex");
  return expected.length === supplied.length && crypto.timingSafeEqual(expected, supplied);
}
function saveData() {
  const data = [...players.values()].map(p => ({
    id: p.id, tokenHash: p.tokenHash, deviceKeyHash: p.deviceKeyHash || "",
    revokedDeviceKeyHashes: Array.isArray(p.revokedDeviceKeyHashes) ? p.revokedDeviceKeyHashes : [],
    approvalStatus: p.approvalStatus || "pending", createdAt: p.createdAt || "",
    profile: p.profile, friends: [...p.friends], gems: p.gems,
    ownedCards: p.ownedCards, cardLevels: p.cardLevels, draftVouchers: p.draftVouchers,
    activeDraft: p.activeDraft, rewardDay: p.rewardDay, rewardGemsToday: p.rewardGemsToday,
    lastGameClaimAt: p.lastGameClaimAt, eventClaims: p.eventClaims, draftPity: p.draftPity
  }));
  const temp = DATA_FILE + ".tmp";
  // Keep the last valid snapshot before replacing the active file.
  try {
    if (fs.existsSync(DATA_FILE)) {
      const previous = fs.readFileSync(DATA_FILE);
      const parsed = JSON.parse(previous.toString("utf8"));
      if (parsed && parsed.version === 1 && Array.isArray(parsed.players)) {
        const safeBackupPlayers = parsed.players.map(record => {
          const safeRecord = { ...record };
          if (!/^[a-f0-9]{64}$/i.test(safeRecord.deviceKeyHash || "") &&
              /^[a-f0-9]{64}$/i.test(safeRecord.deviceKey || "")) {
            safeRecord.deviceKeyHash = hashToken(String(safeRecord.deviceKey).toLowerCase());
          }
          delete safeRecord.deviceKey;
          return safeRecord;
        });
        fs.writeFileSync(DATA_FILE + ".bak", JSON.stringify({ ...parsed, players: safeBackupPlayers }), { mode: 0o600 });
        fs.chmodSync(DATA_FILE + ".bak", 0o600);
      }
    }
  } catch (error) {
    console.error("[storage] Could not refresh previous-data backup:", error.message);
  }
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(temp, JSON.stringify({ version: 1, players: data }), { mode: 0o600 });
  fs.renameSync(temp, DATA_FILE);
}
function sanitizeLegacyDeviceKeySnapshots() {
  for (const candidate of DATA_FILE_CANDIDATES) {
    const file = path.resolve(candidate);
    if (!fs.existsSync(file)) continue;
    try {
      const saved = JSON.parse(fs.readFileSync(file, "utf8"));
      if (!saved || saved.version !== 1 || !Array.isArray(saved.players)) continue;
      let changed = false;
      const safePlayers = saved.players.map(record => {
        const safeRecord = { ...record };
        if (Object.prototype.hasOwnProperty.call(safeRecord, "deviceKey")) {
          if (!/^[a-f0-9]{64}$/i.test(safeRecord.deviceKeyHash || "") &&
              /^[a-f0-9]{64}$/i.test(safeRecord.deviceKey || "")) {
            safeRecord.deviceKeyHash = hashToken(String(safeRecord.deviceKey).toLowerCase());
          }
          delete safeRecord.deviceKey;
          changed = true;
        }
        return safeRecord;
      });
      if (changed) {
        const temp = file + ".security-tmp";
        fs.writeFileSync(temp, JSON.stringify({ ...saved, players: safePlayers }), { mode: 0o600 });
        fs.chmodSync(temp, 0o600);
        fs.renameSync(temp, file);
      }
      fs.chmodSync(file, 0o600);
    } catch (error) {
      console.error("[security] Could not sanitize a legacy player snapshot:", path.basename(file), error.message);
    }
  }
}

function loadData() {
  const snapshots = [];
  const inspected = new Set();
  for (const candidate of DATA_FILE_CANDIDATES) {
    const file = path.resolve(candidate);
    if (inspected.has(file) || !fs.existsSync(file)) continue;
    inspected.add(file);
    try {
      const saved = JSON.parse(fs.readFileSync(file, "utf8"));
      if (saved.version !== 1 || !Array.isArray(saved.players)) continue;
      const validPlayers = saved.players.filter(p =>
        p && validPlayerId(p.id) && /^[a-f0-9]{64}$/i.test(p.tokenHash || "")
      );
      if (validPlayers.length) {
        snapshots.push({
          file,
          players: validPlayers,
          modifiedAt: fs.statSync(file).mtimeMs || 0
        });
      }
    } catch (error) {
      console.error("[storage] Skipping unreadable player snapshot:", path.basename(file), error.message);
    }
  }
  if (!snapshots.length) {
    console.log("[storage] No existing player snapshot found at the configured or legacy paths.");
    return;
  }

  // Prefer the most complete snapshot first, then add accounts found only
  // in older backups or the previous working-directory location.
  snapshots.sort((a, b) => b.players.length - a.players.length || b.modifiedAt - a.modifiedAt);
  const recovered = new Map();
  const revokedKeysByPlayer = new Map();
  for (const snapshot of snapshots) {
    for (const p of snapshot.players) {
      if (!recovered.has(p.id)) recovered.set(p.id, p);
      if (Array.isArray(p.revokedDeviceKeyHashes)) {
        if (!revokedKeysByPlayer.has(p.id)) revokedKeysByPlayer.set(p.id, new Set());
        for (const keyHash of p.revokedDeviceKeyHashes) {
          if (/^[a-f0-9]{64}$/i.test(keyHash || "")) {
            revokedKeysByPlayer.get(p.id).add(keyHash.toLowerCase());
          }
        }
      }
    }
  }

  const hasLegacyDeviceKeys = snapshots.some(snapshot =>
    snapshot.players.some(p => /^[a-f0-9]{64}$/i.test(p.deviceKey || "") && !/^[a-f0-9]{64}$/i.test(p.deviceKeyHash || ""))
  );

  for (const p of recovered.values()) {
    const player = {
      id: p.id,
      tokenHash: p.tokenHash,
      revokedDeviceKeyHashes: [...(revokedKeysByPlayer.get(p.id) || new Set())],
      deviceKeyHash: /^[a-f0-9]{64}$/i.test(p.deviceKeyHash || "")
        ? p.deviceKeyHash.toLowerCase()
        : (/^[a-f0-9]{64}$/i.test(p.deviceKey || "") ? hashToken(p.deviceKey.toLowerCase()) : ""),
      approvalStatus: p.approvalStatus === "pending" ? "pending" : "approved",
      createdAt: String(p.createdAt || ""),
      profile: normalizeProfile({ ...p.profile, ovr: serverOverallFromXp(p.profile?.xp) }),
      friends: new Set(Array.isArray(p.friends) ? p.friends.filter(validPlayerId).slice(0, 100) : []),
      gems: p.gems === undefined ? 250 : Math.max(0, Math.floor(Number(p.gems) || 0)),
      ownedCards: Array.isArray(p.ownedCards) ? [...new Set(p.ownedCards.filter(x => typeof x === "string").slice(0, 100))] : ["arham"],
      cardLevels: p.cardLevels && typeof p.cardLevels === "object" ? p.cardLevels : {},
      draftVouchers: Math.max(0, Math.min(99, Number(p.draftVouchers) || 0)),
      activeDraft: p.activeDraft && typeof p.activeDraft === "object" ? p.activeDraft : null,
      rewardDay: String(p.rewardDay || ""),
      rewardGemsToday: Math.max(0, Number(p.rewardGemsToday) || 0),
      lastGameClaimAt: Math.max(0, Number(p.lastGameClaimAt) || 0),
      eventClaims: p.eventClaims && typeof p.eventClaims === "object" ? p.eventClaims : {},
      draftPity: p.draftPity && typeof p.draftPity === "object" ? p.draftPity : {},
      gameSession: null
    };
    for (const keyHash of player.revokedDeviceKeyHashes) revokedDeviceRecoveryKeyHashes.add(keyHash);
    players.set(player.id, player);
    tokenToPlayer.set(player.tokenHash, player.id);
  }

  const primary = snapshots[0];
  const mergedRevokedCount = [...revokedKeysByPlayer.values()].reduce((sum, set) => sum + set.size, 0);
  const primaryRevokedCount = primary.players.reduce((sum, p) =>
    sum + (Array.isArray(p.revokedDeviceKeyHashes)
      ? new Set(p.revokedDeviceKeyHashes.filter(key => /^[a-f0-9]{64}$/i.test(key || ""))).size
      : 0), 0);
  const migrationNeeded = primary.file !== DATA_FILE || recovered.size > primary.players.length ||
    hasLegacyDeviceKeys || mergedRevokedCount > primaryRevokedCount;
  console.log("[storage] Loaded " + players.size + " registered accounts from " +
    snapshots.length + " valid snapshot(s); primary file: " + path.basename(primary.file) + ".");
  if (migrationNeeded) {
    console.log("[storage] Migrating recovered player records to the configured data file.");
    saveData();
    sanitizeLegacyDeviceKeySnapshots();
  }
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
function base32Decode(value) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const clean = String(value || "").toUpperCase().replace(/\s+/g, "").replace(/=+$/g, "");
  let bits = "";
  for (const char of clean) {
    const index = alphabet.indexOf(char);
    if (index < 0) return null;
    bits += index.toString(2).padStart(5, "0");
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return Buffer.from(bytes);
}
function normalizedAdminTotpSecret() {
  return String(process.env.APEX_ADMIN_2FA_SECRET || "")
    .toUpperCase().replace(/\s+/g, "").replace(/=+$/g, "");
}
function isAdminTotpConfigured() {
  const secret = normalizedAdminTotpSecret();
  if (!/^[A-Z2-7]{32,64}$/.test(secret)) return false;
  const key = base32Decode(secret);
  return Boolean(key && key.length >= 20);
}
function verifyAdminTotp(code) {
  const secret = normalizedAdminTotpSecret();
  if (!isAdminTotpConfigured()) return false;
  const digits = String(code || "").trim();
  if (!/^\d{6}$/.test(digits)) return false;
  const key = base32Decode(secret);
  const counter = Math.floor(Date.now() / 30000);
  for (let offset = -1; offset <= 1; offset++) {
    const message = Buffer.alloc(8);
    message.writeBigUInt64BE(BigInt(counter + offset));
    const digest = crypto.createHmac("sha1", key).update(message).digest();
    const position = digest[digest.length - 1] & 15;
    const binary = ((digest[position] & 127) << 24) |
      ((digest[position + 1] & 255) << 16) |
      ((digest[position + 2] & 255) << 8) |
      (digest[position + 3] & 255);
    const expected = Buffer.from(String(binary % 1000000).padStart(6, "0"), "ascii");
    const supplied = Buffer.from(digits, "ascii");
    if (crypto.timingSafeEqual(expected, supplied)) return true;
  }
  return false;
}
function requireOwnerIdentity(req, res, next) {
  if (!youtubeAdminPlayers.has(req.player.id)) return res.status(403).json({ error: "Owner access required." });
  next();
}
function requireOwner(req, res, next) {
  if (!youtubeAdminPlayers.has(req.player.id)) return res.status(403).json({ error: "Owner access required." });
  if (!isAdminTotpConfigured()) {
    return res.status(503).json({
      error: "Owner 2FA is not configured correctly. Set APEX_ADMIN_2FA_SECRET to a 32–64 character Base32 authenticator key in the backend environment, then restart the server."
    });
  }
  if (!verifyAdminTotp(req.get("X-Admin-2FA"))) {
    return totpAttemptLimiter(req, res, () => {
      auditEvent(req.player.id, "owner_2fa_failed");
      return res.status(401).json({ error: "A valid current 6-digit authenticator code is required." });
    });
  }
  next();
}
const ADMIN_GEM_BALANCE = 999999999999999;
function syncAdminGemWallet(player) {
  if (youtubeAdminPlayers.has(player.id)) player.gems = ADMIN_GEM_BALANCE;
  return player.gems;
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
  windowMs: 15 * 60 * 1000, limit: 6, standardHeaders: "draft-7", legacyHeaders: false,
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
const youtubeRequestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, limit: 6, standardHeaders: "draft-7", legacyHeaders: false,
  message: { error: "Too many YouTube access requests. Please wait before trying again." }
});
const youtubeCommentsLimiter = rateLimit({
  windowMs: 60 * 1000, limit: 8, standardHeaders: "draft-7", legacyHeaders: false,
  message: { error: "Too many comments requests. Please wait a moment." }
});
const profileLimiter = rateLimit({
  windowMs: 60 * 1000, limit: 30, standardHeaders: "draft-7", legacyHeaders: false,
  message: { error: "Too many profile updates. Please wait a moment." }
});
// Keep store actions on separate counters so buying a voucher does not consume
// the draft-start or draft-pick allowance.
const voucherBuyLimiter = rateLimit({
  windowMs: 60 * 1000, limit: 30, standardHeaders: "draft-7", legacyHeaders: false,
  message: { error: "Too many voucher purchases. Please wait a moment." }
});
const draftStartLimiter = rateLimit({
  windowMs: 60 * 1000, limit: 20, standardHeaders: "draft-7", legacyHeaders: false,
  message: { error: "Too many draft openings. Please wait a moment." }
});
const draftChooseLimiter = rateLimit({
  windowMs: 60 * 1000, limit: 20, standardHeaders: "draft-7", legacyHeaders: false,
  message: { error: "Too many draft picks. Please wait a moment." }
});
const adminLimiter = rateLimit({
  windowMs: 60 * 1000, limit: 20, standardHeaders: "draft-7", legacyHeaders: false,
  message: { error: "Too many owner actions. Please wait before trying again." }
});
// Slow down repeated authenticator-code guesses without limiting successful checks.
const totpAttemptLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, limit: 5, skipSuccessfulRequests: true,
  // This limiter is only reached after owner identity is verified.
  keyGenerator: req => String(req.player.id),
  standardHeaders: "draft-7", legacyHeaders: false,
  message: { error: "Too many 2FA attempts. Wait 15 minutes before trying again." }
});
const friendLimiter = rateLimit({
  windowMs: 60 * 1000, limit: 18, standardHeaders: "draft-7", legacyHeaders: false,
  message: { error: "Too many friend actions. Please wait a moment." }
});
function pruneExpiredInvites() {
  const cutoff = Date.now() - 5 * 60 * 1000;
  for (const [id, invite] of invites) if (invite.createdAt < cutoff) invites.delete(id);
}


app.disable("x-powered-by");
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  referrerPolicy: { policy: "no-referrer" },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: false }
}));
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  next();
});
app.use(cors({
  origin(origin, callback) {
    // Requests without Origin are allowed for non-browser health tooling;
    // browser origins must match the explicit allowlist.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Admin-2FA"],
  maxAge: 600,
  credentials: false
}));
app.use(express.json({ limit: "12kb", strict: true }));
app.use((req, res, next) => { if (req.path.startsWith("/api/")) res.setHeader("Cache-Control", "no-store, max-age=0"); next(); });
app.use(rateLimit({ windowMs: 60 * 1000, limit: 90, standardHeaders: "draft-7", legacyHeaders: false }));
app.get("/health", auth, requireOwnerIdentity, adminLimiter, requireOwner, (req, res) => {
  // Health diagnostics require the owner's player token plus a current authenticator code.

  return res.set("Cache-Control", "no-store").json({
    ok: true,
    service: "Apex Strikers API",
    registeredPlayers: players.size,
    owner2FAConfigured: true
  });
});
// Public, read-only comments endpoint. Keep YOUTUBE_API_KEY on the server, never in frontend files.
app.get("/api/youtube/comments", youtubeCommentsLimiter, async (req, res) => {
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
    requestStatus: latest?.status || "none"
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

app.get("/api/admin/audit", auth, requireOwnerIdentity, adminLimiter, requireOwner, (req, res) => {
  try {
    const lines = fs.readFileSync(AUDIT_FILE, "utf8").trim().split(/\r?\n/).filter(Boolean).slice(-100);
    res.json({ events: lines.map(line => { try { return JSON.parse(line); } catch (_) { return null; } }).filter(Boolean) });
  } catch (error) {
    if (error.code === "ENOENT") return res.json({ events: [] });
    return res.status(500).json({ error: "Audit log is temporarily unavailable." });
  }
});
app.get("/api/youtube/requests", auth, requireOwnerIdentity, adminLimiter, requireOwner, (req, res) => {
  res.json({ requests: youtubeAccessData.requests.filter(r => r.status === "pending") });
});
app.post("/api/youtube/requests/:requestId/decision", auth, requireOwnerIdentity, adminLimiter, requireOwner, (req, res) => {
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
  // Wallet and collection data stay private to the player's authenticated store endpoint.
  return { id: p.id, name: p.profile.name, xp: p.profile.xp, goals: p.profile.goals, saves: p.profile.saves,
    wins: p.profile.wins, best: p.profile.best, player: p.profile.player, goalkeeper: p.profile.goalkeeper,
    ovr: p.profile.ovr, online: Boolean(socketsByPlayer.get(p.id)?.size) };
}
const playerApiWindows = new Map();
let playerApiChecks = 0;
function auth(req, res, next) {
  const match = /^Bearer\s+([a-f0-9]{64})$/i.exec(req.get("authorization") || "");
  const id = match && tokenToPlayer.get(hashToken(match[1]));
  if (!id || !players.has(id)) return res.status(401).json({ error: "Authentication required. Reconnect to the server." });
  req.player = players.get(id);
  if (req.player.approvalStatus !== "approved") {
    auditEvent(id, "blocked_unapproved_account_access");
    return res.status(403).json({ error: "This account is not approved for access." });
  }
  const now = Date.now();
  let bucket = playerApiWindows.get(id);
  if (!bucket || now - bucket.startedAt >= 60000) {
    bucket = { startedAt: now, count: 0 };
    playerApiWindows.set(id, bucket);
  }
  if (bucket.count >= 240) {
    res.setHeader("Retry-After", String(Math.max(1, Math.ceil((60000 - (now - bucket.startedAt)) / 1000))));
    return res.status(429).json({ error: "Too many requests for this account. Please wait a moment." });
  }
  bucket.count += 1;
  if (++playerApiChecks % 512 === 0) {
    for (const [playerId, entry] of playerApiWindows) {
      if (now - entry.startedAt >= 60000) playerApiWindows.delete(playerId);
    }
  }
  next();
}
function serverOverallFromXp(xp) {
  return Math.min(99, 92 + Math.floor(Math.max(0, Number(xp) || 0) / 500));
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
  const rawDeviceKey = String(req.body?.deviceKey || "");
  const deviceKeyHash = /^[a-f0-9]{64}$/i.test(rawDeviceKey) ? hashToken(rawDeviceKey.toLowerCase()) : "";
  const deviceMatch = deviceKeyHash && [...players.values()].find(p => p.deviceKeyHash === deviceKeyHash);
  const bearerPlayerId = bearer && tokenToPlayer.get(hashToken(bearer[1]));
  if (bearerPlayerId && deviceMatch && deviceMatch.id !== bearerPlayerId) {
    auditEvent(bearerPlayerId, "device_key_account_mismatch", deviceMatch.id);
    return res.status(409).json({ error: "That recovery key belongs to a different player account." });
  }
  if (!deviceKeyHash && !bearerPlayerId) {
    return res.status(400).json({ error: "A valid 32-byte device recovery key is required." });
  }
  if (deviceKeyHash && revokedDeviceRecoveryKeyHashes.has(deviceKeyHash)) {
    auditEvent("register", "device_key_replay_blocked");
    return res.status(409).json({ error: "This recovery key has already been used. Reconnect using the latest key saved on your device." });
  }
  const existingId = bearerPlayerId || deviceMatch?.id;
  if (existingId && players.has(existingId)) {
    const existing = players.get(existingId);
    existing.profile = { ...existing.profile, name: profile.name, player: profile.player, goalkeeper: profile.goalkeeper };
    existing.profile.ovr = serverOverallFromXp(existing.profile.xp);
    if (deviceKeyHash && (!existing.deviceKeyHash || existing.deviceKeyHash === deviceKeyHash)) existing.deviceKeyHash = deviceKeyHash;
    // A still-valid bearer token is already the active session. Keep it stable so
    // overlapping startup/store requests cannot invalidate one another.
    if (bearerPlayerId && existing.tokenHash === hashToken(bearer[1])) {
      saveData();
      return res.json({ playerId: existing.id, token: bearer[1], status: existing.approvalStatus || "approved" });
    }
    // A device key is a one-time recovery credential. Replace it after use so a
    // copied old key cannot be replayed for future account recovery.
    const recoveredByDeviceKey = !bearerPlayerId && Boolean(deviceMatch && deviceMatch.id === existing.id);
    tokenToPlayer.delete(existing.tokenHash);
    const rotatedToken = crypto.randomBytes(32).toString("hex");
    existing.tokenHash = hashToken(rotatedToken);
    tokenToPlayer.set(existing.tokenHash, existing.id);
    // Revoke all already-open sockets authenticated with the previous token.
    const previousSockets = socketsByPlayer.get(existing.id);
    if (previousSockets) {
      for (const socket of [...previousSockets]) socket.disconnect(true);
      socketsByPlayer.delete(existing.id);
    }
    let replacementDeviceKey = "";
    if (recoveredByDeviceKey) {
      // Remember the consumed key so a second tab or copied old key cannot
      // accidentally register a second account with the same credential.
      const consumedKeyHash = existing.deviceKeyHash;
      if (consumedKeyHash && /^[a-f0-9]{64}$/i.test(consumedKeyHash)) {
        if (!Array.isArray(existing.revokedDeviceKeyHashes)) existing.revokedDeviceKeyHashes = [];
        if (!existing.revokedDeviceKeyHashes.includes(consumedKeyHash)) {
          existing.revokedDeviceKeyHashes.push(consumedKeyHash);
        }
        revokedDeviceRecoveryKeyHashes.add(consumedKeyHash);
      }
      replacementDeviceKey = crypto.randomBytes(32).toString("hex");
      existing.deviceKeyHash = hashToken(replacementDeviceKey);
      auditEvent(existing.id, "account_recovered");
    }
    saveData();
    return res.json({
      playerId: existing.id,
      token: rotatedToken,
      ...(replacementDeviceKey ? { deviceKey: replacementDeviceKey } : {}),
      status: existing.approvalStatus || "approved"
    });
  }
  if (players.size >= MAX_PLAYERS) return res.status(503).json({ error: "The server is full. Please try again later." });
  let id;
  do { id = "EA-" + crypto.randomBytes(3).toString("hex").toUpperCase() + "-" + crypto.randomBytes(3).toString("hex").toUpperCase(); } while (players.has(id));
  const token = crypto.randomBytes(32).toString("hex");
  const safeNewProfile = normalizeProfile({ name: profile.name, player: profile.player, goalkeeper: profile.goalkeeper, ovr: 92 });
  safeNewProfile.ovr = serverOverallFromXp(safeNewProfile.xp);
  const player = { id, tokenHash: hashToken(token), deviceKeyHash, revokedDeviceKeyHashes: [], approvalStatus: "approved", createdAt: new Date().toISOString(), profile: safeNewProfile, friends: new Set(), gems: 250, draftVouchers: 0, activeDraft: null, ownedCards: ['arham'], cardLevels: { arham: 0 }, rewardDay: '', rewardGemsToday: 0, lastGameClaimAt: 0, eventClaims: {}, gameSession: null };
  players.set(id, player);
  tokenToPlayer.set(player.tokenHash, id);
  saveData();
  res.status(201).json({ playerId: id, token, status: "approved" });
});
app.put("/api/profile", auth, profileLimiter, (req, res) => {
  const rawProfile = req.body?.profile && typeof req.body.profile === "object" ? req.body.profile : {};
  const incoming = normalizeProfile(rawProfile);

  // Progress and leaderboard statistics are server-owned. Never let a browser
  // write XP, goals, saves, wins, best score, or OVR directly.
  const protectedFields = ["xp", "goals", "saves", "wins", "best", "ovr"];
  const attemptedStatEdit = protectedFields.some(field =>
    Object.prototype.hasOwnProperty.call(rawProfile, field) &&
    Number(rawProfile[field]) !== Number(req.player.profile[field])
  );
  if (attemptedStatEdit) {
    auditEvent(req.player.id, "blocked_profile_stat_edit");
  }

  // Only allow ordinary profile choices to be changed by the player.
  req.player.profile = {
    ...req.player.profile,
    name: incoming.name,
    player: incoming.player,
    goalkeeper: incoming.goalkeeper
  };
  saveData();
  res.set("Cache-Control", "no-store");
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
app.post("/api/friends", auth,friendLimiter, (req, res) => {
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
app.post("/api/friends/remove", auth,friendLimiter, (req, res) => {
  const id = cleanText(req.body?.friendId, 24).toUpperCase();
  req.player.friends.delete(id);
  players.get(id)?.friends.delete(req.player.id);
  saveData();
  res.json({ ok: true });
});
// Admin can inspect public player profiles only. Authentication tokens and private account secrets are never returned.
app.get("/api/admin/players", auth, requireOwnerIdentity, adminLimiter, requireOwner, (req, res) => {
  const all = [...players.values()].map(publicProfile)
    .sort((a, b) => Number(b.online) - Number(a.online) || b.xp - a.xp || a.name.localeCompare(b.name));
  res.json({ players: all, total: all.length, online: all.filter(p => p.online).length });
});
const STORE_CARDS = [
  {id:"arham",name:"Muhammad Arham",ovr:122,position:"ST",country:"SAUDI ARABIA",flag:"SA",rarity:"ELITE",image:""},
  {id:"messi",name:"Lionel Messi",ovr:123,position:"RW",country:"ARGENTINA",flag:"AR",rarity:"ICON",image:""},
  {id:"ronaldo",name:"Cristiano Ronaldo",ovr:124,position:"ST",country:"PORTUGAL",flag:"PT",rarity:"ICON",image:""},
  {id:"mbappe",name:"Kylian Mbappé",ovr:122,position:"ST",country:"FRANCE",flag:"FR",rarity:"ELITE",image:""},
  {id:"yamal",name:"Lamine Yamal",ovr:121,position:"RW",country:"SPAIN",flag:"ES",rarity:"ELITE",image:""},
  {id:"haaland",name:"Erling Haaland",ovr:121,position:"ST",country:"NORWAY",flag:"NO",rarity:"ELITE",image:""},
  {id:"bellingham",name:"Jude Bellingham",ovr:120,position:"CM",country:"ENGLAND",flag:"EN",rarity:"ELITE",image:""},
  {id:"salah",name:"Mohamed Salah",ovr:120,position:"RW",country:"EGYPT",flag:"EG",rarity:"ELITE",image:""},
  {id:"debruyne",name:"Kevin De Bruyne",ovr:121,position:"CAM",country:"BELGIUM",flag:"BE",rarity:"ELITE",image:""},
  {id:"figo",name:"Luis Figo",ovr:119,position:"RW",country:"PORTUGAL",flag:"PT",rarity:"ICON",image:""},
  {id:"neymar",name:"Neymar Jr.",ovr:122,position:"LW",country:"BRAZIL",flag:"BR",rarity:"GAME CHANGERS",image:""},
  {id:"vinicius",name:"Vinícius Júnior",ovr:123,position:"LW",country:"BRAZIL",flag:"BR",rarity:"GAME CHANGERS",image:""},
  {id:"modric",name:"Luka Modrić",ovr:120,position:"CM",country:"CROATIA",flag:"HR",rarity:"ELITE",image:""},
  {id:"kane",name:"Harry Kane",ovr:122,position:"ST",country:"ENGLAND",flag:"EN",rarity:"ELITE",image:""},
  {id:"son",name:"Son Heung-min",ovr:121,position:"LW",country:"SOUTH KOREA",flag:"KR",rarity:"ELITE",image:""},
  {id:"lewandowski",name:"Robert Lewandowski",ovr:122,position:"ST",country:"POLAND",flag:"PL",rarity:"ELITE",image:""},
  {id:"zidane",name:"Zinedine Zidane",ovr:126,position:"CAM",country:"FRANCE",flag:"FR",rarity:"ICON",image:""},
  {id:"ronaldinho",name:"Ronaldinho",ovr:126,position:"LW",country:"BRAZIL",flag:"BR",rarity:"ICON",image:""},
  {id:"beckham",name:"David Beckham",ovr:124,position:"RM",country:"ENGLAND",flag:"EN",rarity:"ICON",image:""},
  {id:"iniesta",name:"Andrés Iniesta",ovr:125,position:"CM",country:"SPAIN",flag:"ES",rarity:"ICON",image:""},
  {id:"xavi",name:"Xavi",ovr:124,position:"CM",country:"SPAIN",flag:"ES",rarity:"ICON",image:""},
  {id:"ibrahimovic",name:"Zlatan Ibrahimović",ovr:125,position:"ST",country:"SWEDEN",flag:"SE",rarity:"ICON",image:""},
  {id:"benzema",name:"Karim Benzema",ovr:122,position:"ST",country:"FRANCE",flag:"FR",rarity:"GAME CHANGERS",image:""},
  {id:"suarez",name:"Luis Suárez",ovr:121,position:"ST",country:"URUGUAY",flag:"UY",rarity:"ELITE",image:""},
  {id:"griezmann",name:"Antoine Griezmann",ovr:121,position:"ST",country:"FRANCE",flag:"FR",rarity:"GAME CHANGERS",image:""},
  {id:"kaka",name:"Kaká",ovr:124,position:"CAM",country:"BRAZIL",flag:"BR",rarity:"ICON",image:""},
  {id:"hazard",name:"Eden Hazard",ovr:121,position:"LW",country:"BELGIUM",flag:"BE",rarity:"GAME CHANGERS",image:""},
  {id:"bale",name:"Gareth Bale",ovr:123,position:"RW",country:"WALES",flag:"WA",rarity:"ICON",image:""},
  {id:"kroos",name:"Toni Kroos",ovr:124,position:"CM",country:"GERMANY",flag:"DE",rarity:"ICON",image:""},
  {id:"casemiro",name:"Casemiro",ovr:121,position:"CDM",country:"BRAZIL",flag:"BR",rarity:"ELITE",image:""},
  {id:"pele",name:"Pelé",ovr:128,position:"ST",country:"BRAZIL",flag:"BR",rarity:"ICON",image:""},
  {id:"ronaldonazario",name:"Ronaldo Nazário",ovr:127,position:"ST",country:"BRAZIL",flag:"BR",rarity:"ICON",image:""},
  {id:"henry",name:"Thierry Henry",ovr:126,position:"ST",country:"FRANCE",flag:"FR",rarity:"ICON",image:""},
  {id:"pirlo",name:"Andrea Pirlo",ovr:125,position:"CM",country:"ITALY",flag:"IT",rarity:"ICON",image:""},
  {id:"ramos",name:"Sergio Ramos",ovr:125,position:"CB",country:"SPAIN",flag:"ES",rarity:"ICON",image:""},
  {id:"vandijk",name:"Virgil van Dijk",ovr:126,position:"CB",country:"NETHERLANDS",flag:"NL",rarity:"ELITE",image:""},
  {id:"courtois",name:"Thibaut Courtois",ovr:125,position:"GK",country:"BELGIUM",flag:"BE",rarity:"ELITE",image:""},
  {id:"neuer",name:"Manuel Neuer",ovr:125,position:"GK",country:"GERMANY",flag:"DE",rarity:"ICON",image:""},
  {id:"alisson",name:"Alisson Becker",ovr:123,position:"GK",country:"BRAZIL",flag:"BR",rarity:"ELITE",image:""},
  {id:"donnarumma",name:"Gianluigi Donnarumma",ovr:124,position:"GK",country:"ITALY",flag:"IT",rarity:"ELITE",image:""},
  {id:"casillas",name:"Iker Casillas",ovr:125,position:"GK",country:"SPAIN",flag:"ES",rarity:"ICON",image:""},
  {id:"yashin",name:"Lev Yashin",ovr:126,position:"GK",country:"SOVIET UNION",flag:"SU",rarity:"ICON",image:""},
  {id:"maldini",name:"Paolo Maldini",ovr:128,position:"LB",country:"ITALY",flag:"IT",rarity:"ICON",image:""},
  {id:"puyol",name:"Carles Puyol",ovr:125,position:"CB",country:"SPAIN",flag:"ES",rarity:"ICON",image:""},
  {id:"nesta",name:"Alessandro Nesta",ovr:125,position:"CB",country:"ITALY",flag:"IT",rarity:"ICON",image:""},
  {id:"cannavaro",name:"Fabio Cannavaro",ovr:125,position:"CB",country:"ITALY",flag:"IT",rarity:"ICON",image:""},
  {id:"lahm",name:"Philipp Lahm",ovr:124,position:"RB",country:"GERMANY",flag:"DE",rarity:"ICON",image:""},
  {id:"cafu",name:"Cafu",ovr:125,position:"RB",country:"BRAZIL",flag:"BR",rarity:"ICON",image:""},
  {id:"robertocarlos",name:"Roberto Carlos",ovr:126,position:"LB",country:"BRAZIL",flag:"BR",rarity:"ICON",image:""},
  {id:"gerrard",name:"Steven Gerrard",ovr:125,position:"CM",country:"ENGLAND",flag:"EN",rarity:"ICON",image:""},
  {id:"lampard",name:"Frank Lampard",ovr:124,position:"CM",country:"ENGLAND",flag:"EN",rarity:"ICON",image:""},
  {id:"scholes",name:"Paul Scholes",ovr:124,position:"CM",country:"ENGLAND",flag:"EN",rarity:"ICON",image:""},
  {id:"busquets",name:"Sergio Busquets",ovr:122,position:"CDM",country:"SPAIN",flag:"ES",rarity:"ELITE",image:""},
  {id:"kante",name:"N'Golo Kanté",ovr:123,position:"CDM",country:"FRANCE",flag:"FR",rarity:"ELITE",image:""},
  {id:"vieira",name:"Patrick Vieira",ovr:125,position:"CDM",country:"FRANCE",flag:"FR",rarity:"ICON",image:""},
  {id:"makelele",name:"Claude Makélélé",ovr:122,position:"CDM",country:"FRANCE",flag:"FR",rarity:"ICON",image:""},
  {id:"foden",name:"Phil Foden",ovr:122,position:"CAM",country:"ENGLAND",flag:"EN",rarity:"ELITE",image:""},
  {id:"saka",name:"Bukayo Saka",ovr:122,position:"RW",country:"ENGLAND",flag:"EN",rarity:"ELITE",image:""},
  {id:"palmer",name:"Cole Palmer",ovr:123,position:"CAM",country:"ENGLAND",flag:"EN",rarity:"ELITE",image:""},
  {id:"musiala",name:"Jamal Musiala",ovr:123,position:"CAM",country:"GERMANY",flag:"DE",rarity:"ELITE",image:""},
  {id:"wirtz",name:"Florian Wirtz",ovr:123,position:"CAM",country:"GERMANY",flag:"DE",rarity:"ELITE",image:""},
  {id:"odegaard",name:"Martin Ødegaard",ovr:122,position:"CAM",country:"NORWAY",flag:"NO",rarity:"ELITE",image:""},
  {id:"grimaldo",name:"Alejandro Grimaldo",ovr:120,position:"LB",country:"SPAIN",flag:"ES",rarity:"ELITE",image:""},
  {id:"hakimi",name:"Achraf Hakimi",ovr:123,position:"RB",country:"MOROCCO",flag:"MA",rarity:"ELITE",image:""},
  {id:"trent",name:"Trent Alexander-Arnold",ovr:122,position:"RB",country:"ENGLAND",flag:"EN",rarity:"ELITE",image:""},
  {id:"raphinha",name:"Raphinha",ovr:122,position:"RW",country:"BRAZIL",flag:"BR",rarity:"ELITE",image:""},
  {id:"lautaro",name:"Lautaro Martínez",ovr:123,position:"ST",country:"ARGENTINA",flag:"AR",rarity:"ELITE",image:""},
  {id:"osimhen",name:"Victor Osimhen",ovr:122,position:"ST",country:"NIGERIA",flag:"NG",rarity:"ELITE",image:""},
  {id:"dybala",name:"Paulo Dybala",ovr:122,position:"CAM",country:"ARGENTINA",flag:"AR",rarity:"ELITE",image:""},
  {id:"sonprime",name:"Son Heung-min (Prime)",ovr:124,position:"LW",country:"SOUTH KOREA",flag:"KR",rarity:"ICON",image:""}
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
const GAME_CHANGER_CARD_IDS = ["neymar","vinicius","benzema","griezmann","hazard","son","suarez","lewandowski","salah","kane"];
function getDraftPoolA(){
  const base=STORE_CARDS.filter(card=>card.id!=="arham"&&!GAME_CHANGER_CARD_IDS.includes(card.id)).slice(0,200);
  return base.filter(card=>(Number(card.ovr)||0)>125)
    .map(card=>({...card,...(PLAYER_REAL_WORLD_INFO[card.id]||{club:"Club unverified",careerStatus:"Needs verification"})}));
}
function getDraftOdds(eventId){
  const pool=eventId==="game-changers"
    ? STORE_CARDS.filter(card=>GAME_CHANGER_CARD_IDS.includes(card.id))
    : STORE_CARDS.filter(card=>card.id!=="arham"&&!GAME_CHANGER_CARD_IDS.includes(card.id)).slice(0,200);
  const total=pool.reduce((sum,card)=>sum+draftWeight(card),0);
  return pool.slice().sort((a,b)=>(Number(b.ovr)||0)-(Number(a.ovr)||0)||draftWeight(a)-draftWeight(b)).slice(0,3)
    .map(card=>({id:card.id,name:card.name,ovr:card.ovr,position:card.position,rarity:card.rarity,
      chance:total?Number((draftWeight(card)/total*100).toFixed(4)):0}));
}
app.get("/api/store",auth,(req,res)=>{if(req.player.activeDraft&&(req.player.activeDraft.draftVersion!==4||!req.player.activeDraft.selectedCardId||!["apex-ascension","game-changers"].includes(req.player.activeDraft.eventId))){req.player.activeDraft=null;saveData();}const gems=syncAdminGemWallet(req.player);if(youtubeAdminPlayers.has(req.player.id))saveData();res.set("Cache-Control","no-store");res.json({gems,unlimitedGems:youtubeAdminPlayers.has(req.player.id),draftVouchers:req.player.draftVouchers||0,activeDraft:req.player.activeDraft||null,ownedCards:req.player.ownedCards,cardLevels:req.player.cardLevels,cardCatalog:PUBLIC_STORE_CARDS,draftOdds:{"apex-ascension":getDraftOdds("apex-ascension"),"game-changers":getDraftOdds("game-changers")},draftPools:{poolA:getDraftPoolA()},draftPity:getDraftPityStatus(req.player),draft:{name:"APEX PLAYER DRAFT",voucherCost:150,choices:10,pick:1,version:2}});});
app.post("/api/store/vouchers/buy",auth,voucherBuyLimiter,(req,res)=>{const quantity=Math.max(1,Math.min(10,Math.floor(Number(req.body?.quantity)||1)));const current=Math.max(0,Number(req.player.draftVouchers)||0);if(current+quantity>99)return res.status(409).json({error:"Your voucher wallet is full. Use some vouchers before buying more."});const isOwner=youtubeAdminPlayers.has(req.player.id);const cost=150*quantity;if(!isOwner&&req.player.gems<cost)return res.status(409).json({error:"Not enough gems for that many draft vouchers."});if(!isOwner)req.player.gems-=cost;else syncAdminGemWallet(req.player);req.player.draftVouchers=current+quantity;saveData();auditEvent(req.player.id,"draft_vouchers_bought",String(quantity));res.json({gems:syncAdminGemWallet(req.player),unlimitedGems:isOwner,draftVouchers:req.player.draftVouchers});});
// Club/status snapshot uses official FIFA 2026 squad listings where available. Unconfirmed clubs are never guessed.
const PLAYER_REAL_WORLD_INFO={"ronaldo":{"careerStatus":"ACTIVE","club":"Al Nassr"},"messi":{"careerStatus":"ACTIVE","club":"Inter Miami"},"mbappe":{"careerStatus":"ACTIVE","club":"Real Madrid"},"yamal":{"careerStatus":"ACTIVE","club":"Barcelona"},"haaland":{"careerStatus":"ACTIVE","club":"Manchester City"},"bellingham":{"careerStatus":"ACTIVE","club":"Real Madrid"},"salah":{"careerStatus":"ACTIVE","club":"Liverpool"},"debruyne":{"careerStatus":"ACTIVE","club":"Napoli"},"neymar":{"careerStatus":"ACTIVE","club":"Santos"},"vinicius":{"careerStatus":"ACTIVE","club":"Real Madrid"},"kane":{"careerStatus":"ACTIVE","club":"Bayern Munich"},"son":{"careerStatus":"ACTIVE","club":"Los Angeles FC"},"lewandowski":{"careerStatus":"ACTIVE","club":"Club unverified"},"benzema":{"careerStatus":"ACTIVE","club":"Club unverified"},"suarez":{"careerStatus":"Needs verification","club":"Club unverified"},"griezmann":{"careerStatus":"ACTIVE","club":"Club unverified"},"casemiro":{"careerStatus":"ACTIVE","club":"Manchester United"},"kante":{"careerStatus":"ACTIVE","club":"Al-Ittihad"},"foden":{"careerStatus":"ACTIVE","club":"Club unverified"},"saka":{"careerStatus":"ACTIVE","club":"Arsenal"},"palmer":{"careerStatus":"ACTIVE","club":"Club unverified"},"musiala":{"careerStatus":"ACTIVE","club":"Bayern Munich"},"wirtz":{"careerStatus":"ACTIVE","club":"Liverpool"},"odegaard":{"careerStatus":"ACTIVE","club":"Arsenal"},"grimaldo":{"careerStatus":"ACTIVE","club":"Club unverified"},"hakimi":{"careerStatus":"ACTIVE","club":"Paris Saint-Germain"},"trent":{"careerStatus":"ACTIVE","club":"Real Madrid"},"raphinha":{"careerStatus":"ACTIVE","club":"Barcelona"},"lautaro":{"careerStatus":"ACTIVE","club":"Inter Milan"},"osimhen":{"careerStatus":"ACTIVE","club":"Club unverified"},"dybala":{"careerStatus":"ACTIVE","club":"Club unverified"},"sergioramos":{"careerStatus":"Needs verification","club":"Club unverified"},"courtois":{"careerStatus":"ACTIVE","club":"Real Madrid"},"neuer":{"careerStatus":"ACTIVE","club":"Bayern Munich"},"alisson":{"careerStatus":"ACTIVE","club":"Liverpool"},"donnarumma":{"careerStatus":"ACTIVE","club":"Manchester City"},"vandijk":{"careerStatus":"ACTIVE","club":"Liverpool"},"ederson":{"careerStatus":"ACTIVE","club":"Club unverified"},"raya":{"careerStatus":"ACTIVE","club":"Club unverified"},"mane":{"careerStatus":"ACTIVE","club":"Al Nassr"},"mahrez":{"careerStatus":"ACTIVE","club":"Al-Ahli"},"ziyech":{"careerStatus":"Needs verification","club":"Club unverified"},"bounou":{"careerStatus":"ACTIVE","club":"Al-Hilal"},"thiagosilva":{"careerStatus":"ACTIVE","club":"Club unverified"},"marquinhos":{"careerStatus":"ACTIVE","club":"Paris Saint-Germain"},"fabinho":{"careerStatus":"ACTIVE","club":"Al-Ittihad"},"brunofernandes":{"careerStatus":"ACTIVE","club":"Manchester United"},"bernardosilva":{"careerStatus":"ACTIVE","club":"Club unverified"},"cancelo":{"careerStatus":"ACTIVE","club":"Club unverified"},"joaofelix":{"careerStatus":"ACTIVE","club":"Club unverified"},"rafaelleao":{"careerStatus":"ACTIVE","club":"Club unverified"},"kvaratskhelia":{"careerStatus":"ACTIVE","club":"Paris Saint-Germain"},"isak":{"careerStatus":"ACTIVE","club":"Club unverified"},"watkins":{"careerStatus":"ACTIVE","club":"Club unverified"},"rice":{"careerStatus":"ACTIVE","club":"Arsenal"},"saliba":{"careerStatus":"ACTIVE","club":"Arsenal"},"gabriel":{"careerStatus":"ACTIVE","club":"Arsenal"},"kimmich":{"careerStatus":"ACTIVE","club":"Bayern Munich"},"goretzka":{"careerStatus":"ACTIVE","club":"Bayern Munich"},"gnabry":{"careerStatus":"ACTIVE","club":"Club unverified"},"sane":{"careerStatus":"ACTIVE","club":"Club unverified"},"coman":{"careerStatus":"ACTIVE","club":"Club unverified"},"thomasmuller":{"careerStatus":"ACTIVE","club":"Club unverified"},"jorginho":{"careerStatus":"ACTIVE","club":"Club unverified"},"alaba":{"careerStatus":"ACTIVE","club":"Club unverified"},"pogba":{"careerStatus":"ACTIVE","club":"Club unverified"},"dimaria":{"careerStatus":"ACTIVE","club":"Club unverified"},"cavani":{"careerStatus":"ACTIVE","club":"Club unverified"},"dzeko":{"careerStatus":"ACTIVE","club":"Club unverified"},"perisic":{"careerStatus":"ACTIVE","club":"Club unverified"},"davidluiz":{"careerStatus":"Needs verification","club":"Club unverified"},"sonprime":{"careerStatus":"ACTIVE","club":"Los Angeles FC"},"sonprime2":{"careerStatus":"ACTIVE","club":"Los Angeles FC"},"modric":{"careerStatus":"ACTIVE","club":"AC Milan"},"modricprime":{"careerStatus":"ACTIVE","club":"AC Milan"},"figo":{"careerStatus":"RETIRED","club":"Retired"},"zidane":{"careerStatus":"RETIRED","club":"Retired"},"ronaldinho":{"careerStatus":"RETIRED","club":"Retired"},"beckham":{"careerStatus":"RETIRED","club":"Retired"},"iniesta":{"careerStatus":"RETIRED","club":"Retired"},"xavi":{"careerStatus":"RETIRED","club":"Retired"},"ibrahimovic":{"careerStatus":"RETIRED","club":"Retired"},"kaka":{"careerStatus":"RETIRED","club":"Retired"},"hazard":{"careerStatus":"RETIRED","club":"Retired"},"bale":{"careerStatus":"RETIRED","club":"Retired"},"kroos":{"careerStatus":"RETIRED","club":"Retired"},"pele":{"careerStatus":"RETIRED","club":"Retired"},"ronaldonazario":{"careerStatus":"RETIRED","club":"Retired"},"henry":{"careerStatus":"RETIRED","club":"Retired"},"pirlo":{"careerStatus":"RETIRED","club":"Retired"},"maldini":{"careerStatus":"RETIRED","club":"Retired"},"puyol":{"careerStatus":"RETIRED","club":"Retired"},"nesta":{"careerStatus":"RETIRED","club":"Retired"},"cannavaro":{"careerStatus":"RETIRED","club":"Retired"},"lahm":{"careerStatus":"RETIRED","club":"Retired"},"cafu":{"careerStatus":"RETIRED","club":"Retired"},"robertocarlos":{"careerStatus":"RETIRED","club":"Retired"},"gerrard":{"careerStatus":"RETIRED","club":"Retired"},"lampard":{"careerStatus":"RETIRED","club":"Retired"},"scholes":{"careerStatus":"RETIRED","club":"Retired"},"vieira":{"careerStatus":"RETIRED","club":"Retired"},"makelele":{"careerStatus":"RETIRED","club":"Retired"},"yashin":{"careerStatus":"RETIRED","club":"Retired"},"casillas":{"careerStatus":"RETIRED","club":"Retired"},"petrcech":{"careerStatus":"RETIRED","club":"Retired"},"buffon":{"careerStatus":"RETIRED","club":"Retired"},"oliverkahn":{"careerStatus":"RETIRED","club":"Retired"},"vandersar":{"careerStatus":"RETIRED","club":"Retired"},"peterschmeichel":{"careerStatus":"RETIRED","club":"Retired"},"drogba":{"careerStatus":"RETIRED","club":"Retired"},"etoo":{"careerStatus":"RETIRED","club":"Retired"},"yayatoure":{"careerStatus":"RETIRED","club":"Retired"},"essien":{"careerStatus":"RETIRED","club":"Retired"},"okocha":{"careerStatus":"RETIRED","club":"Retired"},"weah":{"careerStatus":"RETIRED","club":"Retired"},"nakata":{"careerStatus":"RETIRED","club":"Retired"},"parksung":{"careerStatus":"RETIRED","club":"Retired"},"chabumkun":{"careerStatus":"RETIRED","club":"Retired"},"socrates":{"careerStatus":"RETIRED","club":"Retired"},"rivaldo":{"careerStatus":"RETIRED","club":"Retired"},"romario":{"careerStatus":"RETIRED","club":"Retired"},"zico":{"careerStatus":"RETIRED","club":"Retired"},"garrincha":{"careerStatus":"RETIRED","club":"Retired"},"jairzinho":{"careerStatus":"RETIRED","club":"Retired"},"carlosalberto":{"careerStatus":"RETIRED","club":"Retired"},"dunga":{"careerStatus":"RETIRED","club":"Retired"},"bebeto":{"careerStatus":"RETIRED","club":"Retired"},"adriano":{"careerStatus":"RETIRED","club":"Retired"},"juninho":{"careerStatus":"RETIRED","club":"Retired"},"marcelo":{"careerStatus":"RETIRED","club":"Retired"},"danialves":{"careerStatus":"RETIRED","club":"Retired"},"fernandinho":{"careerStatus":"RETIRED","club":"Retired"},"busquets":{"careerStatus":"RETIRED","club":"Retired"},"rakitic":{"careerStatus":"RETIRED","club":"Retired"},"ballack":{"careerStatus":"RETIRED","club":"Retired"},"klose":{"careerStatus":"RETIRED","club":"Retired"},"schweinsteiger":{"careerStatus":"RETIRED","club":"Retired"},"matthaus":{"careerStatus":"RETIRED","club":"Retired"},"ozil":{"careerStatus":"RETIRED","club":"Retired"},"davidvilla":{"careerStatus":"RETIRED","club":"Retired"},"torres":{"careerStatus":"RETIRED","club":"Retired"},"raul":{"careerStatus":"RETIRED","club":"Retired"},"pique":{"careerStatus":"RETIRED","club":"Retired"},"jordialba":{"careerStatus":"RETIRED","club":"Retired"},"fabregas":{"careerStatus":"RETIRED","club":"Retired"},"davidsilva":{"careerStatus":"RETIRED","club":"Retired"},"rooney":{"careerStatus":"RETIRED","club":"Retired"},"giggs":{"careerStatus":"RETIRED","club":"Retired"},"shearer":{"careerStatus":"RETIRED","club":"Retired"},"lineker":{"careerStatus":"RETIRED","club":"Retired"},"owen":{"careerStatus":"RETIRED","club":"Retired"},"cantona":{"careerStatus":"RETIRED","club":"Retired"},"keane":{"careerStatus":"RETIRED","club":"Retired"},"ferdinand":{"careerStatus":"RETIRED","club":"Retired"},"terry":{"careerStatus":"RETIRED","club":"Retired"},"vidic":{"careerStatus":"RETIRED","club":"Retired"},"evra":{"careerStatus":"RETIRED","club":"Retired"},"ashleycole":{"careerStatus":"RETIRED","club":"Retired"},"garyneville":{"careerStatus":"RETIRED","club":"Retired"},"solcampbell":{"careerStatus":"RETIRED","club":"Retired"},"wright":{"careerStatus":"RETIRED","club":"Retired"},"desailly":{"careerStatus":"RETIRED","club":"Retired"},"thuram":{"careerStatus":"RETIRED","club":"Retired"},"trezeguet":{"careerStatus":"RETIRED","club":"Retired"},"pires":{"careerStatus":"RETIRED","club":"Retired"},"ribery":{"careerStatus":"RETIRED","club":"Retired"},"deschamps":{"careerStatus":"RETIRED","club":"Retired"},"blanc":{"careerStatus":"RETIRED","club":"Retired"},"barthez":{"careerStatus":"RETIRED","club":"Retired"},"vanpersie":{"careerStatus":"RETIRED","club":"Retired"},"bergkamp":{"careerStatus":"RETIRED","club":"Retired"},"kluivert":{"careerStatus":"RETIRED","club":"Retired"},"davids":{"careerStatus":"RETIRED","club":"Retired"},"overmars":{"careerStatus":"RETIRED","club":"Retired"},"koeman":{"careerStatus":"RETIRED","club":"Retired"},"stam":{"careerStatus":"RETIRED","club":"Retired"},"delpiero":{"careerStatus":"RETIRED","club":"Retired"},"totti":{"careerStatus":"RETIRED","club":"Retired"},"baggio":{"careerStatus":"RETIRED","club":"Retired"},"gattuso":{"careerStatus":"RETIRED","club":"Retired"},"zambrotta":{"careerStatus":"RETIRED","club":"Retired"},"inzaghi":{"careerStatus":"RETIRED","club":"Retired"},"vieri":{"careerStatus":"RETIRED","club":"Retired"},"deco":{"careerStatus":"RETIRED","club":"Retired"},"ricardocarvalho":{"careerStatus":"RETIRED","club":"Retired"},"quaresma":{"careerStatus":"RETIRED","club":"Retired"},"valderrama":{"careerStatus":"RETIRED","club":"Retired"},"forlan":{"careerStatus":"RETIRED","club":"Retired"},"godin":{"careerStatus":"RETIRED","club":"Retired"},"aguero":{"careerStatus":"RETIRED","club":"Retired"},"tevez":{"careerStatus":"RETIRED","club":"Retired"},"crespo":{"careerStatus":"RETIRED","club":"Retired"},"zanetti":{"careerStatus":"RETIRED","club":"Retired"},"veron":{"careerStatus":"RETIRED","club":"Retired"},"mascherano":{"careerStatus":"RETIRED","club":"Retired"},"simeone":{"careerStatus":"RETIRED","club":"Retired"},"mandzukic":{"careerStatus":"RETIRED","club":"Retired"},"eusebio":{"careerStatus":"RETIRED","club":"No current club"},"georgebest":{"careerStatus":"RETIRED","club":"No current club"},"cruyff":{"careerStatus":"RETIRED","club":"No current club"},"beckenbauer":{"careerStatus":"RETIRED","club":"No current club"},"gerdmuller":{"careerStatus":"RETIRED","club":"No current club"},"vanbasten":{"careerStatus":"RETIRED","club":"No current club"},"gullit":{"careerStatus":"RETIRED","club":"No current club"},"rijkaard":{"careerStatus":"RETIRED","club":"No current club"},"seedorf":{"careerStatus":"RETIRED","club":"No current club"},"robben":{"careerStatus":"RETIRED","club":"No current club"},"sneijder":{"careerStatus":"RETIRED","club":"No current club"},"vandernistelrooy":{"careerStatus":"RETIRED","club":"No current club"},"honda":{"careerStatus":"RETIRED","club":"No current club"},"lucio":{"careerStatus":"RETIRED","club":"No current club"},"makeleleprime":{"careerStatus":"RETIRED","club":"No current club"},"henryprime":{"careerStatus":"RETIRED","club":"No current club"},"vanpersieprime":{"careerStatus":"RETIRED","club":"No current club"},"bergkampprime":{"careerStatus":"RETIRED","club":"No current club"},"seedorfprime":{"careerStatus":"RETIRED","club":"No current club"},"buffonprime":{"careerStatus":"RETIRED","club":"No current club"},"nestaprime":{"careerStatus":"RETIRED","club":"No current club"},"pirlo_prime":{"careerStatus":"RETIRED","club":"No current club"},"delpiero_prime":{"careerStatus":"RETIRED","club":"No current club"},"figo_prime":{"careerStatus":"RETIRED","club":"No current club"},"pepe":{"careerStatus":"RETIRED","club":"No current club"},"nani":{"careerStatus":"RETIRED","club":"No current club"},"kaka_prime":{"careerStatus":"RETIRED","club":"No current club"},"ronaldinho_prime":{"careerStatus":"RETIRED","club":"No current club"},"marcelo_prime":{"careerStatus":"RETIRED","club":"No current club"},"lucio_prime":{"careerStatus":"RETIRED","club":"No current club"},"arham":{"careerStatus":"CUSTOM PLAYER","club":"Apex Strikers"},"ramos":{"careerStatus":"Needs verification","club":"Club unverified"},"joaocancelo":{"careerStatus":"ACTIVE","club":"Al-Hilal"},"gundogan":{"careerStatus":"ACTIVE","club":"Club unverified"},"carvajal":{"careerStatus":"ACTIVE","club":"Real Madrid"},"benzema_prime":{"careerStatus":"ACTIVE","club":"Al-Hilal"},"griezmannprime":{"careerStatus":"ACTIVE","club":"Atlético Madrid"},"james":{"careerStatus":"ACTIVE","club":"Club unverified"},"falcao":{"careerStatus":"Needs verification","club":"Club unverified"},"kagawa":{"careerStatus":"Needs verification","club":"Club unverified"},"havertz":{"careerStatus":"ACTIVE","club":"Arsenal"}};
const PUBLIC_STORE_CARDS=STORE_CARDS.map(card=>({...card,...(PLAYER_REAL_WORLD_INFO[card.id]||{club:"Club unverified",careerStatus:"Needs verification"})}));
const DRAFT_WEIGHTS={ronaldo:1,messi:2,figo:3,mbappe:80,yamal:100,haaland:90,bellingham:85,salah:85,debruyne:85,neymar:60,vinicius:70,modric:45,kane:65,son:60,lewandowski:65,zidane:3,ronaldinho:5,beckham:8,iniesta:12,xavi:12,ibrahimovic:6,benzema:35,suarez:28,griezmann:45,kaka:10,hazard:35,bale:30,kroos:28,casemiro:45,pele:3,ronaldonazario:4,henry:7,pirlo:12,ramos:10,vandijk:30,courtois:28,neuer:16,alisson:40,donnarumma:34,casillas:9,yashin:2,maldini:2,puyol:7,nesta:8,cannavaro:9,lahm:12,cafu:9,robertocarlos:6,gerrard:12,lampard:15,scholes:15,busquets:35,kante:30,vieira:8,makelele:12,foden:55,saka:50,palmer:45,musiala:45,wirtz:45,odegaard:42,grimaldo:35,hakimi:40,trent:40,raphinha:45,lautaro:40,osimhen:38,dybala:32,sonprime:20};
const draftWeight=card=>{const ovr=Number(card.ovr)||0;const tier=ovr>=128?0.06:ovr>=126?0.12:ovr>=124?0.28:ovr>=122?0.75:ovr>=120?2.2:ovr>=118?5:10;const listed=Number(DRAFT_WEIGHTS[card.id]);const weight=Math.max(0.04,Math.min(tier,Number.isFinite(listed)&&listed>0?listed:tier));return Math.max(1,Math.round(weight*1000));};
function weightedDraftPick(items){const total=items.reduce((sum,card)=>sum+draftWeight(card),0);let roll=crypto.randomInt(total);for(const card of items){roll-=draftWeight(card);if(roll<0)return card;}return items[items.length-1];}
function draftChanceInTen(targetId,pool){const target=pool.find(card=>card.id===targetId);if(!target)return 0;const total=pool.reduce((sum,card)=>sum+draftWeight(card),0);return Math.max(0,Math.min(100,(1-Math.pow(1-draftWeight(target)/total,Math.min(10,pool.length)))*100));}
const DRAFT_PITY_LIMITS={poolA:20,poolB:5};
function getDraftPityStatus(player){
  const saved=player.draftPity&&typeof player.draftPity==="object"?player.draftPity:{};
  const result={};
  for(const eventId of ["apex-ascension","game-changers"]){
    const entry=saved[eventId]&&typeof saved[eventId]==="object"?saved[eventId]:{};
    const base=eventId==="game-changers"?STORE_CARDS.filter(card=>GAME_CHANGER_CARD_IDS.includes(card.id)):STORE_CARDS.filter(card=>card.id!=="arham"&&!GAME_CHANGER_CARD_IDS.includes(card.id)).slice(0,200);
    const hasA=base.some(card=>(Number(card.ovr)||0)>125);
    const hasB=base.some(card=>(Number(card.ovr)||0)<=125);
    const a=Math.max(0,Math.min(DRAFT_PITY_LIMITS.poolA-1,Math.floor(Number(entry.poolA)||0)));
    const b=Math.max(0,Math.min(DRAFT_PITY_LIMITS.poolB-1,Math.floor(Number(entry.poolB)||0)));
    result[eventId]={poolA:{remaining:hasA?Math.max(1,DRAFT_PITY_LIMITS.poolA-a):null,limit:DRAFT_PITY_LIMITS.poolA},poolB:{remaining:hasB?Math.max(1,DRAFT_PITY_LIMITS.poolB-b):null,limit:DRAFT_PITY_LIMITS.poolB}};
  }
  return result;
}
function selectDraftWithPity(player,eventId,basePool){
  const aPool=basePool.filter(card=>(Number(card.ovr)||0)>125);
  const bPool=basePool.filter(card=>(Number(card.ovr)||0)<=125);
  if(!player.draftPity||typeof player.draftPity!=="object")player.draftPity={};
  const old=player.draftPity[eventId]&&typeof player.draftPity[eventId]==="object"?player.draftPity[eventId]:{};
  let a=Math.max(0,Math.min(DRAFT_PITY_LIMITS.poolA-1,Math.floor(Number(old.poolA)||0)));
  let b=Math.max(0,Math.min(DRAFT_PITY_LIMITS.poolB-1,Math.floor(Number(old.poolB)||0)));
  let selected,forcedPool="";
  if(aPool.length&&a>=DRAFT_PITY_LIMITS.poolA-1){selected=weightedDraftPick(aPool);forcedPool="A";}
  else if(bPool.length&&b>=DRAFT_PITY_LIMITS.poolB-1){selected=weightedDraftPick(bPool);forcedPool="B";}
  else selected=weightedDraftPick(basePool);
  const isA=(Number(selected.ovr)||0)>125;
  if(isA){a=0;if(bPool.length&&b>=DRAFT_PITY_LIMITS.poolB-1)b=DRAFT_PITY_LIMITS.poolB-1;else if(bPool.length)b=Math.min(DRAFT_PITY_LIMITS.poolB-1,b+1);}
  else{b=0;if(aPool.length&&a>=DRAFT_PITY_LIMITS.poolA-1)a=DRAFT_PITY_LIMITS.poolA-1;else if(aPool.length)a=Math.min(DRAFT_PITY_LIMITS.poolA-1,a+1);}
  player.draftPity[eventId]={poolA:a,poolB:b};
  return {card:selected,forcedPool,pity:getDraftPityStatus(player)[eventId]};
}
app.post("/api/store/draft/start",auth,draftStartLimiter,(req,res)=>{const eventId=["apex-ascension","game-changers"].includes(req.body?.eventId)?req.body.eventId:"apex-ascension";if(req.player.activeDraft&&req.player.activeDraft.expiresAt>Date.now()&&req.player.activeDraft.draftVersion===4&&req.player.activeDraft.eventId===eventId&&req.player.activeDraft.selectedCardId)return res.json({draft:{id:req.player.activeDraft.id,draftVersion:4,eventId,expiresAt:req.player.activeDraft.expiresAt},draftVouchers:req.player.draftVouchers||0});if(req.player.activeDraft)req.player.activeDraft=null;if((req.player.draftVouchers||0)<1)return res.status(409).json({error:"You have no Draft Vouchers. Buy one first."});const pool=eventId==="game-changers"?STORE_CARDS.filter(card=>GAME_CHANGER_CARD_IDS.includes(card.id)):STORE_CARDS.filter(card=>card.id!=="arham"&&!GAME_CHANGER_CARD_IDS.includes(card.id)).slice(0,200);if(!pool.length)return res.status(503).json({error:"This event pack is temporarily unavailable."});const pityPick=selectDraftWithPity(req.player,eventId,pool);const selected=pityPick.card;req.player.draftVouchers--;req.player.activeDraft={id:crypto.randomBytes(16).toString("hex"),draftVersion:4,eventId,createdAt:Date.now(),expiresAt:Date.now()+300000,selectedCardId:selected.id,pityPool:pityPick.forcedPool};saveData();auditEvent(req.player.id,"draft_started",req.player.activeDraft.id);res.set("Cache-Control","no-store");res.json({draft:{id:req.player.activeDraft.id,draftVersion:4,eventId,expiresAt:req.player.activeDraft.expiresAt,pityPool:pityPick.forcedPool},draftVouchers:req.player.draftVouchers,draftPity:pityPick.pity});});
app.post("/api/store/draft/choose",auth,draftChooseLimiter,(req,res)=>{const draft=req.player.activeDraft;const draftId=cleanText(req.body?.draftId,64);if(!draft||draft.expiresAt<Date.now()||draft.draftVersion!==4||!["apex-ascension","game-changers"].includes(draft.eventId)||!draft.selectedCardId){req.player.activeDraft=null;saveData();return res.status(409).json({error:"This pack has expired. Use a fresh Draft Voucher."});}if(!draftId||draftId!==draft.id)return res.status(409).json({error:"This pack is no longer current. Reopen the Draft Room."});const card=STORE_CARDS.find(item=>item.id===draft.selectedCardId);if(!card)return res.status(404).json({error:"The selected player card could not be found."});const duplicate=req.player.ownedCards.includes(card.id);const level=Math.max(0,Number(req.player.cardLevels[card.id])||0);if(!duplicate)req.player.ownedCards.push(card.id);else req.player.cardLevels[card.id]=Math.min(5,level+1);req.player.ownedCards=[...new Set(req.player.ownedCards)].slice(0,100);req.player.activeDraft=null;saveData();auditEvent(req.player.id,"draft_pick",card.id);res.json({gems:req.player.gems,ownedCards:req.player.ownedCards,cardLevels:req.player.cardLevels,eventId:draft.eventId,pick:{...card,rarity:draft.eventId==="game-changers"?"GAME CHANGERS":"APEX ASCENSION",level:req.player.cardLevels[card.id]||0,duplicate,upgraded:duplicate&&level<5}});});
app.post("/api/store/draft/open-ten",auth,draftStartLimiter,(req,res)=>{
  const eventId=["apex-ascension","game-changers"].includes(req.body?.eventId)?req.body.eventId:"apex-ascension";
  if(req.player.activeDraft&&req.player.activeDraft.expiresAt>Date.now()&&req.player.activeDraft.selectedCardId)return res.status(409).json({error:"Finish your current player reveal before opening 10 drafts."});
  if((req.player.draftVouchers||0)<10)return res.status(409).json({error:"You need 10 Draft Vouchers to use Open 10."});
  const pool=eventId==="game-changers"?STORE_CARDS.filter(card=>GAME_CHANGER_CARD_IDS.includes(card.id)):STORE_CARDS.filter(card=>card.id!=="arham"&&!GAME_CHANGER_CARD_IDS.includes(card.id)).slice(0,200);
  if(!pool.length)return res.status(503).json({error:"This event pack is temporarily unavailable."});
  const picks=[];
  for(let i=0;i<10;i++){
    const chosen=selectDraftWithPity(req.player,eventId,pool);
    const card=chosen.card;
    const duplicate=req.player.ownedCards.includes(card.id);
    const level=Math.max(0,Number(req.player.cardLevels[card.id])||0);
    if(!duplicate)req.player.ownedCards.push(card.id);
    else req.player.cardLevels[card.id]=Math.min(5,level+1);
    picks.push({...card,rarity:eventId==="game-changers"?"GAME CHANGERS":"APEX ASCENSION",level:req.player.cardLevels[card.id]||0,duplicate,upgraded:duplicate&&level<5,pityPool:chosen.forcedPool||""});
  }
  req.player.ownedCards=[...new Set(req.player.ownedCards)].slice(0,100);
  req.player.draftVouchers-=10;
  req.player.activeDraft=null;
  saveData();
  auditEvent(req.player.id,"draft_ten_opened",eventId);
  res.set("Cache-Control","no-store");
  res.json({eventId,picks,gems:syncAdminGemWallet(req.player),draftVouchers:req.player.draftVouchers,ownedCards:req.player.ownedCards,cardLevels:req.player.cardLevels,draftPity:getDraftPityStatus(req.player)});
});
app.post("/api/games/start",auth,gameLimiter,(req,res)=>{
  const allowedModes=new Set(["penalty","freekick","longshot","goalkeeping","random","vsattack","crossbar","survival","headtohead"]);
  const allowedEvents=new Set(["","game-changers","neon-derby","last-line","apex-ascension"]);
  const mode=cleanText(req.body?.mode,24),eventId=cleanText(req.body?.eventId,32);
  if(!allowedModes.has(mode))return res.status(400).json({error:"Invalid game mode."});
  if(!allowedEvents.has(eventId))return res.status(400).json({error:"Invalid event."});
  req.player.gameSession={id:crypto.randomBytes(32).toString("hex"),startedAt:Date.now(),mode,eventId};
  res.set("Cache-Control","no-store");
  res.json({sessionId:req.player.gameSession.id});
});
app.post("/api/games/complete",auth,gameLimiter,(req,res)=>{
  const session=req.player.gameSession;
  if(!session||req.body?.sessionId!==session.id)return res.status(409).json({error:"No active game reward session."});
  const elapsed=Date.now()-session.startedAt;
  if(elapsed<5000||elapsed>1800000){req.player.gameSession=null;return res.status(400).json({error:"Play for at least 5 seconds before claiming a reward."});}
  const today=new Date().toISOString().slice(0,10);
  if(req.player.rewardDay!==today){req.player.rewardDay=today;req.player.rewardGemsToday=0;}
  if(Date.now()-req.player.lastGameClaimAt<5000){req.player.gameSession=null;saveData();return res.status(429).json({error:"Start the next game and finish it before claiming more gems."});}
  // Never trust a score submitted by the browser for currency. Base rewards
  // use server-measured session time so edited requests cannot mint extra gems.
  let reward=Math.min(50,15+Math.floor(elapsed/60000)*5),eventReward=0,eventXp=0,eventId="",eventCard=null;
  const eventKey=["game-changers","neon-derby","last-line","apex-ascension"].includes(session.eventId)?session.eventId:"";
  if(eventKey){
    const period=eventKey==="game-changers"?"week-"+Math.floor(Date.now()/604800000):today;
    req.player.eventClaims=req.player.eventClaims||{};
    const claimKey=eventKey+":"+period;
    if(!req.player.eventClaims[claimKey]){
      eventReward=eventKey==="apex-ascension"?100:eventKey==="game-changers"?45:eventKey==="neon-derby"?25:15;
      eventXp=eventKey==="apex-ascension"?750:eventKey==="game-changers"?300:eventKey==="neon-derby"?180:90;
      req.player.eventClaims[claimKey]=true;eventId=eventKey;
      if(eventKey==="game-changers"||eventKey==="apex-ascension"){
        const eventPool=eventKey==="apex-ascension"?STORE_CARDS.filter(card=>card.id!=="arham").slice(0,200):STORE_CARDS.filter(card=>GAME_CHANGER_CARD_IDS.includes(card.id));
        if(eventPool.length){
          const awarded=eventPool[crypto.randomInt(eventPool.length)];
          const duplicate=req.player.ownedCards.includes(awarded.id);
          const oldLevel=Math.max(0,Number(req.player.cardLevels[awarded.id])||0);
          const nextLevel=Math.min(5,oldLevel+1);
          if(!duplicate)req.player.ownedCards.push(awarded.id);
          req.player.cardLevels[awarded.id]=nextLevel;
          req.player.ownedCards=[...new Set(req.player.ownedCards)].slice(0,100);
          eventCard={...awarded,rarity:eventKey==="apex-ascension"?"APEX ASCENSION":"GAME CHANGERS",ovr:Number(awarded.ovr||0)+nextLevel,level:nextLevel,duplicate,replacedNormalCard:duplicate,upgraded:true};
        }
      }
    }
  }
  reward+=eventReward;
  req.player.gems+=reward;syncAdminGemWallet(req.player);
  req.player.profile.xp=Math.min(10000000,req.player.profile.xp+20+eventXp);
  req.player.profile.ovr=serverOverallFromXp(req.player.profile.xp);
  req.player.rewardGemsToday+=reward;req.player.lastGameClaimAt=Date.now();req.player.gameSession=null;
  saveData();auditEvent(req.player.id,"game_reward_claimed",String(reward));
  if(eventCard)auditEvent(req.player.id,"game_changers_player_awarded",eventCard.id);
  res.json({gems:syncAdminGemWallet(req.player),unlimitedGems:youtubeAdminPlayers.has(req.player.id),reward,eventReward,eventXp,eventId,eventCard,ownedCards:req.player.ownedCards,cardLevels:req.player.cardLevels,dailyEarned:req.player.rewardGemsToday,dailyLimit:null});
});
app.get("/api/leaderboard", auth, (req, res) => {
  const requested=Math.floor(Number(req.query.limit)||1000);
  const limit=Math.max(1,Math.min(1000,requested));
  // Every registered account belongs on the board, even before its first match.
  // Return only public competition stats, never wallets, tokens, or owned-card data.
  const boardById = new Map([...players.values()].map(p => [p.id, {
    id: p.id,
    name: cleanText(p.profile.name || "Apex Player", 24),
    xp: Math.max(0, Number(p.profile.xp) || 0),
    goals: Math.max(0, Number(p.profile.goals) || 0),
    saves: Math.max(0, Number(p.profile.saves) || 0),
    wins: Math.max(0, Number(p.profile.wins) || 0),
    best: Math.max(0, Number(p.profile.best) || 0),
    player: cleanText(p.profile.player, 40),
    goalkeeper: cleanText(p.profile.goalkeeper, 40),
    ovr: Math.max(0, Number(p.profile.ovr) || 0),
    online: Boolean(socketsByPlayer.get(p.id)?.size)
  }]));
  // Add recovered November 5 profiles for leaderboard display only.
  // Live authenticated accounts always take priority when an ID overlaps.
  for (const legacy of LEGACY_LEADERBOARD_PLAYERS) {
    if (!boardById.has(legacy.id)) boardById.set(legacy.id, { ...legacy, online: false });
  }
  const board = [...boardById.values()]
    .sort((a, b) => b.wins - a.wins || b.xp - a.xp || b.goals - a.goals || a.name.localeCompare(b.name))
    .slice(0, limit)
    .map((p, index) => ({ rank: index + 1, ...p }));
  res.set("Cache-Control","no-store");
  res.json({ leaderboard: board, totalPlayers: boardById.size, registeredAccounts: players.size, limit, updatedAt: new Date().toISOString() });
});
app.get("/api/events",auth,(_req,res)=>{const now=new Date();const week=Math.floor(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate())/604800000);const events=[{id:"game-changers",title:"GAME CHANGERS: ICON REBORN",subtitle:"Legends return. New eras begin.",type:"featured",description:"Build your squad around game-changing football icons.",mode:"vsattack",rewardGems:45,rewardXp:300,rewardPlayer:"1 GAME CHANGERS PLAYER",endsAt:new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()+(7-now.getUTCDay()))).toISOString()},{id:"apex-ascension",title:"APEX ASCENSION",subtitle:"200 LEGENDS. ONE THRONE.",type:"ULTIMATE EVENT",description:"Enter the ultimate showdown. The 200-player Ascension pool can award one elite signing, plus 100 gems and 750 XP.",mode:"vsattack",rewardGems:100,rewardXp:750,rewardPlayer:"1 OF 200 APEX ASCENSION PLAYERS",playerCount:200},{id:"neon-derby",title:"NEON DERBY",subtitle:"A city divided. One pitch.",type:"weekly",description:"Take on the derby challenge.",mode:"crossbar",rewardGems:25,rewardXp:180},{id:"last-line",title:"LAST LINE",subtitle:"Keep your fortress standing.",type:"daily",description:"A goalkeeper reaction challenge.",mode:"goalkeeping",rewardGems:15,rewardXp:90}];res.json({featured:events[0],events,rotation:week,serverTime:now.toISOString()});});
app.get("/api/profiles/:id", auth, (req, res) => {
  const id = cleanText(req.params.id, 24).toUpperCase();
  if (!validPlayerId(id)) return res.status(400).json({ error: "Invalid player ID" });
  const p = players.get(id);
  if (!p) return res.status(404).json({ error: "Profile not found" });
  res.json({ profile: publicProfile(p) });
});
app.post("/api/invites", auth,friendLimiter, inviteLimiter, (req, res) => {
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
const socketHandshakeWindows = new Map();
io.use((socket, next) => {
  // Socket.IO CORS does not protect WebSocket upgrades by itself.
  const origin = socket.handshake.headers.origin;
  if (typeof origin !== "string" || !allowedOrigins.includes(origin)) return next(new Error("Origin is not allowed"));
  const id = cleanText(socket.handshake.auth?.playerId, 24).toUpperCase();
  const token = String(socket.handshake.auth?.token || "");
  const player = players.get(id);
  if (!player || player.approvalStatus !== "approved" ||
      !/^[a-f0-9]{64}$/i.test(token) || !tokenHashMatches(player.tokenHash, token)) return next(new Error("Authentication required"));
  const now = Date.now();
  let bucket = socketHandshakeWindows.get(id);
  if (!bucket || now - bucket.startedAt >= 60000) {
    bucket = { startedAt: now, count: 0 };
    socketHandshakeWindows.set(id, bucket);
  }
  if (bucket.count >= 30) return next(new Error("Too many connection attempts. Wait a moment."));
  bucket.count += 1;
  socket.data.playerId = id;
  next();
});
function socketWithinLimit(socket, key, limit, windowMs) {
  const now = Date.now();
  if (!socket.data.actionWindows) socket.data.actionWindows = Object.create(null);
  const bucket = socket.data.actionWindows[key] || { startedAt: now, count: 0 };
  if (now - bucket.startedAt >= windowMs) { bucket.startedAt = now; bucket.count = 0; }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  socket.data.actionWindows[key] = bucket;
  return true;
}
io.on("connection", socket => {
  const id = socket.data.playerId;
  if (!socketsByPlayer.has(id)) socketsByPlayer.set(id, new Set());
  if (socketsByPlayer.get(id).size >= 3) { socket.disconnect(true); return; }
  socketsByPlayer.get(id).add(socket);
  for (const friendId of players.get(id)?.friends || []) {
    socketsByPlayer.get(friendId)?.forEach(friendSocket => friendSocket.emit("friend:status", { playerId: id, online: true }));
  }
  socket.on("match:accept", payload => {
    if (!socketWithinLimit(socket, "match:accept", 5, 10000)) return socket.emit("match:error", { message: "Too many match actions. Please wait a moment." });
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
    const match = { players: new Set([invite.from, invite.to]), createdAt: Date.now(), startAt: Date.now(), states: new Map(), lastGoalAt: new Map(), timer: null };
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
    if (!socketWithinLimit(socket, "match:decline", 8, 10000)) return;
    const roomId = cleanText(payload?.roomId, 32), invite = invites.get(roomId);
    if (invite?.to === id) invites.delete(roomId);
  });
  let lastStatePacketAt = 0;
  socket.on("match:state", payload => {
    const now = Date.now();
    if (now - lastStatePacketAt < 80) return;
    if (!socketWithinLimit(socket, "match:state", 12, 1000)) return;
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
    const previousState = match.states.get(id);
    const previousGoals = previousState?.goals || 0;
    const requestedGoals = Math.max(0, Math.min(99, Math.floor(Number(state.goals) || 0)));
    // Reject score rollbacks, multi-goal jumps and implausibly rapid goal updates.
    if (requestedGoals < previousGoals || requestedGoals > previousGoals + 1) return;
    if (requestedGoals > previousGoals) {
      const lastGoalAt = match.lastGoalAt.get(id) || match.startAt;
      if (now - lastGoalAt < 2500) return;
      match.lastGoalAt.set(id, now);
    }
    const serverClock = Math.min(90, (now - match.startAt) / 1000);
    const safeState = {
      x: Math.max(0.05, Math.min(0.95, Number(state.x))),
      y: Math.max(0.05, Math.min(0.95, Number(state.y))),
      goals: requestedGoals,
      hasBall: Boolean(state.hasBall),
      ballX: Number.isFinite(Number(state.ballX)) ? Math.max(0.02, Math.min(0.98, Number(state.ballX))) : 0.5,
      ballY: Number.isFinite(Number(state.ballY)) ? Math.max(0.02, Math.min(0.98, Number(state.ballY))) : 0.5,
      clock: serverClock
    };
    match.states.set(id, safeState);
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
    // Keep presence and active matches alive while another authenticated tab remains.
    if (!socketsByPlayer.get(id)?.size) {
      socketsByPlayer.delete(id);
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
    }
  });
});
loadData();
loadYoutubeAccess();
server.headersTimeout = 15000;
server.requestTimeout = 30000;
server.keepAliveTimeout = 5000;
server.listen(PORT, () => console.log("Eclipse Arena API listening on " + PORT));
