// Shared registry for commands and events.
// Every file in cmds/ calls keith({...}) instead of module.exports = {...}
// Every file in events/ calls evt({...}) instead of module.exports = {...}
// Both just register into these Maps, which index.js reads from directly.
//
// Aliases: add an `aliases: [...]` array to a command and each alias gets
// registered as its own key pointing at the SAME command object, so
// commands.get("menu") and commands.get("help") both work identically —
// no changes needed anywhere that already does commands.get(name).

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

// `commands` has one entry per name AND per alias, all pointing at the same
// object — great for lookups, bad for counting/listing. Use this instead
// wherever you need the deduplicated list (help menus, load counts, etc).
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
