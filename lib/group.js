const { evt } = require("../commandHandler");

evt({
    name: "event",

    async execute({ api, event }) {
        if (event.logMessageType === "log:subscribe") {
            try {
                const threadInfo = await api.getThreadInfo(event.threadID);
                const totalMembers = threadInfo.participantIDs.length;
                const botID = api.getCurrentUserID();

                const newUsers = event.logMessageData.addedParticipants;
                for (const user of newUsers) {
                    const userID = user.userFbId;
                    const userName = user.fullName || "there";

                    const mentions = [
                        { tag: `@${userName}`, id: userID },
                        { tag: "@keith", id: "100030880666720" },
                        { tag: "@BotCreator", id: "100030880666720" }
                    ];

                    const message = {
                        body: `👋 Welcome @${userName} to the group!
👥 Total members: ${totalMembers}`,
                        mentions
                    };

                    await api.sendMessage(message, event.threadID);

                    
                    if (userID === botID) {
                        const newNickname = "Bot Assistant";
                        await api.changeNickname(newNickname, event.threadID, botID);
                    }
                }
            } catch (err) {
                console.error("❌ Error in group event:", err);
            }
        }
    }
});
