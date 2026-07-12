

const commands = new Map();
const events = new Map();

function keith(command) {
    if (!command || !command.name || typeof command.execute !== "function") {
        console.warn("⚠️ Skipped invalid command registration (missing name/execute).");
        return;
    }

    commands.set(command.name.toLowerCase(), command);

    if (Array.isArray(command.aliases)) {
        for (const alias of command.aliases) {
            commands.set(alias.toLowerCase(), command);
        }
    }
}

function evt(event) {
    if (!event || !event.name || typeof event.execute !== "function") {
        console.warn("⚠️ Skipped invalid event registration (missing name/execute).");
        return;
    }
    events.set(event.name, event);
}


function uniqueCommands() {
    const seen = new Set();
    const list = [];
    for (const cmd of commands.values()) {
        if (!seen.has(cmd.name)) {
            seen.add(cmd.name);
            list.push(cmd);
        }
    }
    return list;
}

module.exports = { keith, evt, commands, events, uniqueCommands };
