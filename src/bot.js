require('dotenv').config();

const {Client, Events, GatewayIntentBits} = require('discord.js');

const { ask, initiateDebate, debate } = require('./ai.js');

const token = process.env.BOT_TOKEN;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

let isDebateActive = false;
const MAX_DEBATE_DEPTH = 2;
let currentDebateDepth = 0;

client.on(Events.MessageCreate, async message => {
    if (message.content.startsWith('/trump')) {
        const prompt = message.content.substring(7);
        
        let answer = '';
        try {
            answer = await ask(prompt);
        } catch(err) {
            answer = err.message;
        }

        client.channels
            .fetch(message.channelId)
            .then(channel => channel.send(answer));
    } else if (message.content.startsWith('/debate')) {
        const prompt = message.content.substring(8);

        await initiateDebate(prompt);
        isDebateActive = true;
        currentDebateDepth = 0;
    } else if (isDebateActive && currentDebateDepth < MAX_DEBATE_DEPTH && message.author.username === 'Bidenbot') {
        const response = await debate(message.content);

        client.channels
            .fetch(message.channelId)
            .then(channel => channel.send(response.replace('TRUMP:', '').trim()));


        if (++currentDebateDepth === MAX_DEBATE_DEPTH) {
            isDebateActive = false;
            currentDebateDepth = 0;
        }
    }
});

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(token);
