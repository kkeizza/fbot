const { evt } = require("../commandHandler");

evt({
    name: "event",

    async execute({ client, event, reply, keithApi }) {
        if (event.logMessageType === "log:subscribe") {
            try {
                const threadInfo = await client.getThreadInfo(event.threadID);
                const totalMembers = threadInfo.participantIDs.length;
                const botID = client.getCurrentUserID();

                const newUsers = event.logMessageData.addedParticipants;
                for (const user of newUsers) {
                    const userID = user.userFbId;
                    const userName = user.fullName || "there";

                    const mentions = [
                        { tag: `@${userName}`, id: userID },
                        { tag: "@keith", id: "100095180674234" },
                        { tag: "@BotCreator", id: "100095180674234" }
                    ];

                    const message = {
                        body: `👋 Welcome @${userName} to the group!
👥 Total members: ${totalMembers}
`,
                        mentions
                    };

                    await client.sendMessage(message, event.threadID);

                    // Set bot nickname if it's the one added
                    if (userID === botID) {
                        const newNickname = "Bot Assistant";
                        await client.nickname(newNickname, event.threadID, botID);
                    }
                }
            } catch (err) {
                console.error("❌ Error in group event:", err);
            }
        }
    }
});
