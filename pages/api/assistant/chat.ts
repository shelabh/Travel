import { Configuration, OpenAIApi } from 'openai'

import { initialMessages } from '../../../components/Chat/Chat'
import { type Message } from '../../../components/Chat/ChatLine'

// break the app if the API key is missing
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing Environment Variable OPENAI_API_KEY')
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const botName = 'Chloe'
const userName = 'Mienai' // TODO: move to ENV var
const firstMessge = initialMessages[0].message

const openai = new OpenAIApi(configuration)

// @TODO: unit test this. good case for unit testing
const generatePromptFromMessages = (messages: Message[]) => {
  console.log('== INITIAL messages ==', messages)

  let prompt = ''

  // add first user message to prompt
  prompt += messages[1].message

  // remove first conversaiton (first 2 messages)
  const messagesWithoutFirstConvo = messages.slice(2)
  console.log(' == messagesWithoutFirstConvo', messagesWithoutFirstConvo)

  // early return if no messages
  if (messagesWithoutFirstConvo.length == 0) {
    return prompt
  }

  messagesWithoutFirstConvo.forEach((message: Message) => {
    const name = message.who === 'user' ? userName : botName
    prompt += `\n${name}: ${message.message}`
  })
  return prompt
}

export default async function handler(req: any, res: any) {
  const messages = req.body.messages
  const messagesPrompt = generatePromptFromMessages(messages)
  const defaultPrompt = `I am Friendly AI Travel Assistant. \n\nThis is the conversation between AI travel assistant and a user\n\n${botName}: ${firstMessge}\n${userName}: ${messagesPrompt}\n${botName}: `
  const finalPrompt = process.env.AI_PROMPT
    ? `${process.env.AI_PROMPT}${messagesPrompt}\n${botName}: `
    : defaultPrompt

  const payload = {
    model: 'text-davinci-003',
    prompt: finalPrompt,
    temperature: process.env.AI_TEMP ? parseFloat(process.env.AI_TEMP) : 0.7,
    max_tokens: process.env.AI_MAX_TOKENS
      ? parseInt(process.env.AI_MAX_TOKENS)
      : 200,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: [`${botName}:`, `${userName}:`],
    user: req.body?.user,
  }

 
  const response = await openai.createCompletion(payload)
  const firstResponse = response.data.choices[0].text

  res.status(200).json({ text: firstResponse })
}