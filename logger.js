
const colors = {
    reset: "\x1b[0m",
    dim: "\x1b[2m",
    cyan: "\x1b[36m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    magenta: "\x1b[35m",
    blue: "\x1b[34m",
};

function timestamp() {
    return new Date().toLocaleTimeString();
}

const KeithLogger = {
    info(...args) {
        console.log(`${colors.cyan}[INFO]${colors.reset} ${colors.dim}${timestamp()}${colors.reset}`, ...args);
    },
    success(...args) {
        console.log(`${colors.green}[OK]${colors.reset} ${colors.dim}${timestamp()}${colors.reset}`, ...args);
    },
    warn(...args) {
        console.warn(`${colors.yellow}[WARN]${colors.reset} ${colors.dim}${timestamp()}${colors.reset}`, ...args);
    },
    error(...args) {
        console.error(`${colors.red}[ERROR]${colors.reset} ${colors.dim}${timestamp()}${colors.reset}`, ...args);
    },
    banner(text) {
        console.log(`${colors.blue}${text}${colors.reset}`);
    },

    
    
    logEvent(event) {
        const chatType = event.isGroup ? `${colors.yellow}GROUP${colors.reset}` : `${colors.cyan}DM${colors.reset}`;

        if (event.type === "message" || event.type === "message_reply") {
            const bodyPreview = event.body
                ? (event.body.length > 80 ? event.body.slice(0, 80) + "…" : event.body)
                : "(no text)";
            const attachmentCount = event.attachments ? event.attachments.length : 0;

            console.log(
                `${colors.magenta}[MSG]${colors.reset} ${colors.dim}${timestamp()}${colors.reset} ` +
                `${chatType} ` +
                `type=${event.type} ` +
                `msgID=${event.messageID || "-"} ` +
                `threadID=${event.threadID || "-"} ` +
                `senderID=${event.senderID || "-"} ` +
                `attachments=${attachmentCount} ` +
                `body="${bodyPreview}"`
            );
            return;
        }

        

        
        console.log(
            `${colors.magenta}[EVT]${colors.reset} ${colors.dim}${timestamp()}${colors.reset} ` +
            `${chatType} ` +
            `type=${event.type || "unknown"} ` +
            `threadID=${event.threadID || "-"} ` +
            `senderID=${event.senderID || event.actorFbId || event.userID || "-"}`
        );
    },
};

module.exports = KeithLogger;
