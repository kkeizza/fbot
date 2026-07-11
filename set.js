require("dotenv").config({ path: "./set.env" });

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

function toBool(value, fallback = false) {
    if (value === undefined || value === "") return fallback;
    return String(value).toLowerCase() === "true";
}

// --- Facebook credentials ---------------------------------------------------
// Preferred: APPSTATE — your appState.json cookies, gzip-compressed and
// base64-encoded into a single line. Use tools/encode-appstate.js to
// generate this value from an existing appState.json.
// Fallback: FB_EMAIL + FB_PASSWORD, used only if APPSTATE is empty/invalid
// (ws3-fca supports logging in directly with credentials).
const appstate = process.env.APPSTATE || "";
const email = process.env.FB_EMAIL || "";
const password = process.env.FB_PASSWORD || "";

const authDir = path.join(__dirname, "auth");
const appstatePath = path.join(authDir, "appstate.json");

// NOTE ON "SAFETY": gzip + base64 is compression/encoding, not encryption.
// It keeps the raw cookie JSON out of plain sight in set.env and makes it
// easy to paste as one line, but anyone who reads the APPSTATE value can
// decode it just as easily as this function does. Treat it like a password
// — don't commit set.env, and use auth/ (gitignored) for the decoded file.
function loadAppstate() {
    try {
        // Always start clean so a stale file from a previous run/account is never reused by accident.
        if (fs.existsSync(appstatePath)) {
            fs.unlinkSync(appstatePath);
        }

        if (!appstate || typeof appstate !== "string") {
            return null; // nothing to load — caller falls back to email/password
        }

        // Tolerate a "data:...;base64,XXXX" style prefix as well as a raw base64 string.
        const cleanB64 = appstate.includes(",") ? appstate.split(",").pop().trim() : appstate.trim();

        const compressedData = Buffer.from(cleanB64, "base64");
        const decompressedData = zlib.gunzipSync(compressedData);

        if (!fs.existsSync(authDir)) {
            fs.mkdirSync(authDir, { recursive: true });
        }
        fs.writeFileSync(appstatePath, decompressedData, "utf8");
        console.log("✅ appstate file loaded");

        return JSON.parse(decompressedData.toString("utf8"));
    } catch (e) {
        console.error("❌ appstate error:", e.message);
        return null;
    }
}

const loadedAppState = loadAppstate();

module.exports = {
    prefix: process.env.PREFIX || ".",
    ownerID: process.env.OWNER_ID || "",
    ownerName: process.env.OWNER_NAME || "",
    botName: process.env.BOT_NAME || "Fbot",
    autoRestart: toBool(process.env.AUTO_RESTART),
    autoGreet: toBool(process.env.AUTO_GREET),
    port: process.env.PORT || 3000,

    option: {
        forceLogin: toBool(process.env.FORCE_LOGIN, true),
        listenEvents: toBool(process.env.LISTEN_EVENTS, true),
        logLevel: process.env.LOG_LEVEL || "error",
        selfListen: toBool(process.env.SELF_LISTEN, true),
        updatePresence: toBool(process.env.UPDATE_PRESENCE, true),
        autoMarkDelivery: toBool(process.env.AUTO_MARK_DELIVERY, true),
        autoMarkRead: toBool(process.env.AUTO_MARK_READ, true),
        online: toBool(process.env.ONLINE, true),
    },

    // Exactly one of these will actually be usable at runtime — index.js picks
    // appState if present, otherwise falls back to email/password.
    appState: loadedAppState, // array of cookies, or null
    email,
    password,
};
