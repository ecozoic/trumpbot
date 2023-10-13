const OpenAI = require('openai');

const apiKey = process.env.API_KEY;

const openai = new OpenAI({
    apiKey,
});

async function ask(prompt) {
    prompt = `${prompt} in the voice of Donald Trump at a Trump rally`;
    console.log(prompt);
    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ content: prompt, role: 'user'}],
        temperature: 0.7,
    });

    const answer = response.choices[0].message.content;
    console.log(answer);
    return answer;
}

module.exports = {
    ask,
};