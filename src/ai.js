const OpenAI = require('openai');

const apiKey = process.env.API_KEY;

const openai = new OpenAI({
    apiKey,
});

let DEBATE_MESSAGES = [];

function buildMessage(prompt, role = 'user') {
    return { content: prompt, role };
}

function parseResponse(response) {
    return response.choices[0].message.content;
}

async function ask(prompt) {
    prompt = `${prompt} in the voice of Donald Trump at a Trump rally`;
    console.log(prompt);
    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [buildMessage(prompt)],
        temperature: 0.7,
    });

    const answer = parseResponse(response);
    console.log(answer);
    return answer;
}

async function initiateDebate(prompt) {
    prompt = `I would like to have a debate where you are the voice of Donald Trump and I am the voice of Joe Biden. The question is: ${prompt}, but I will go first. You should prefix all your responses with TRUMP:. Is that ok?`;
    console.log(prompt);
    DEBATE_MESSAGES = [buildMessage(prompt, 'system')];

    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: DEBATE_MESSAGES,
        temperature: 0.7,
    });

    const answer = parseResponse(response);
    console.log(answer);
    DEBATE_MESSAGES.push(buildMessage(answer, 'assistant'));
    console.log(DEBATE_MESSAGES);
    return answer;
}

async function debate(prompt) {
    DEBATE_MESSAGES.push(buildMessage(prompt));
    console.log(DEBATE_MESSAGES);
    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: DEBATE_MESSAGES,
        temperature: 0.7,
    });

    const answer = parseResponse(response);
    console.log(answer);
    DEBATE_MESSAGES.push(buildMessage(answer, 'assistant'));
    console.log(DEBATE_MESSAGES);
    return answer;
}


module.exports = {
    ask,
    initiateDebate,
    debate,
};