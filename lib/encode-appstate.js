

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const inputPath = process.argv[2];

if (!inputPath) {
    console.error("Usage: node tools/encode-appstate.js path/to/appState.json");
    process.exit(1);
}

const resolvedPath = path.resolve(inputPath);

if (!fs.existsSync(resolvedPath)) {
    console.error(`❌ File not found: ${resolvedPath}`);
    process.exit(1);
}

try {
    const raw = fs.readFileSync(resolvedPath, "utf8");
    JSON.parse(raw); 

    const compressed = zlib.gzipSync(Buffer.from(raw, "utf8"));
    const encoded = compressed.toString("base64");

    console.log("\n✅ Paste this into set.env as APPSTATE:\n");
    console.log(`APPSTATE=${encoded}\n`);
} catch (err) {
    console.error("❌ Failed to encode appstate:", err.message);
    process.exit(1);
}
