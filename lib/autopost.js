const { evt } = require("../commandHandler");

const cron = require('node-cron');

evt({
    name: "autoPost",
    execute: async (api, event) => {
        console.log("Auto-post event triggered.");
    },
    onStart: async (api) => {
        const ownerID = "100030880666720";

        
        const sendGreeting = () => {
            const greetings = [
                "Good morning! Have a wonderful day! 🌅",
                "Hello! Stay blessed and productive! ☀️",
                "Good evening! Hope you had a great day! 🌆",
                "Good night! Rest well and sweet dreams! 🌙"
            ];

            const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
            
            api.sendMessage(randomGreeting, ownerID)
                .then(() => {
                    console.log(`✅ Greeting sent: ${randomGreeting}`);
                })
                .catch((error) => {
                    console.error("❌ Error sending greeting:", error);
                });
        };

        
        const schedules = [
            { cronTime: '0 6 * * *' }, 
            { cronTime: '0 12 * * *' }, 
            { cronTime: '0 18 * * *' }, 
            { cronTime: '0 0 * * *' }, 
        ];

        // Schedule the greetings
        for (const schedule of schedules) {
            cron.schedule(schedule.cronTime, () => {
                console.log(`🕒 Scheduled greeting triggered at ${schedule.cronTime}.`);
                sendGreeting();
            }, {
                timezone: "Africa/Nairobi"
            });
        }

        console.log("✅ Greeting scheduler started in Africa/Nairobi timezone.");
    },
});
