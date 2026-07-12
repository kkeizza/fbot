require("dotenv").config({ path: "./set.env" });

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

function toBool(value, fallback = false) {
    if (value === undefined || value === "") return fallback;
    return String(value).toLowerCase() === "true";
}


const appstate = process.env.APPSTATE || "";
const email = process.env.FB_EMAIL || "";
const password = process.env.FB_PASSWORD || "";

const authDir = path.join(__dirname, "auth");
const appstatePath = path.join(authDir, "appstate.json");

function loadAppstate() {
    try {
      
        if (fs.existsSync(appstatePath)) {
            fs.unlinkSync(appstatePath);
        }

        if (!appstate || typeof appstate !== "string") {
            return null; 
        }

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

    appState: loadedAppState, 
    email,
    password,
};
