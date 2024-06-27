const OpenAI = require("openai");

const apiKey = process.env.API_KEY;

const openai = new OpenAI({
  apiKey,
});

let DEBATE_MESSAGES = [];

const MODEL_PARAMS = {
  model: "gpt-4o",
  temperature: 0.7,
};

function buildMessage(prompt, role = "user") {
  return { content: prompt, role };
}

async function request(messages) {
  console.log("** REQUEST **");
  console.log(messages);

  const response = await openai.chat.completions.create({
    ...MODEL_PARAMS,
    messages,
  });

  const message = response.choices[0].message;
  console.log("** RESPONSE **");
  console.log(message);

  return message.content;
}

async function ask(prompt) {
  prompt = `${prompt} in the voice of Donald Trump at a Trump rally`;
  const answer = await request([buildMessage(prompt)]);

  return answer;
}

async function initiateDebate(prompt) {
  prompt = `I would like to have a debate where you are the voice of Donald Trump and I am the voice of Joe Biden. We should try to disagree and poke fun at one another. The question is: ${prompt}, but I will go first. You should prefix all your responses with TRUMP:. Is that ok?`;
  DEBATE_MESSAGES = [buildMessage(prompt, "system")];

  const answer = await request(DEBATE_MESSAGES);

  DEBATE_MESSAGES.push(buildMessage(answer, "assistant"));
  return answer;
}

async function debate(prompt) {
  DEBATE_MESSAGES.push(buildMessage(prompt));
  const answer = await request(DEBATE_MESSAGES);

  DEBATE_MESSAGES.push(buildMessage(answer, "assistant"));
  return answer;
}

module.exports = {
  ask,
  initiateDebate,
  debate,
};
