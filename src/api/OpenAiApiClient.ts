// @ts-nocheck
import * as dotenv from 'dotenv'
import OpenAI from 'openai'
import { weatherApiClient } from './WeatherApiClient'
dotenv.config()
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

async function getCurrentWeather(location: string) {
    return JSON.stringify(await weatherApiClient.getWeather(location))
}

export async function runConversation(cityName: string): Promise<string> {
    const messages = [
        {
            role: 'user',
            content: `¿Cuál es el clima (de forma detallada) en ${cityName}?`,
        },
    ]
    const tools = [
        {
            type: 'function',
            function: {
                name: 'get_current_weather',
                description: 'Get the current weather in a given location',
                parameters: {
                    type: 'object',
                    properties: {
                        location: {
                            type: 'string',
                            description:
                                'The city and state, e.g. San Francisco, CA',
                        },
                    },
                    required: ['location'],
                },
            },
        },
    ]

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        tools: tools,
        tool_choice: 'auto',
    })
    const responseMessage = response.choices[0].message

    const toolCalls = responseMessage.tool_calls
    if (responseMessage.tool_calls) {
        const availableFunctions = {
            get_current_weather: getCurrentWeather,
        }
        messages.push(responseMessage)
        for (const toolCall of toolCalls) {
            const functionName = toolCall.function.name
            const functionToCall = availableFunctions[functionName]
            const functionArgs = JSON.parse(toolCall.function.arguments)
            const functionResponse = await functionToCall(functionArgs.location)
            messages.push({
                tool_call_id: toolCall.id,
                role: 'tool',
                name: functionName,
                content: functionResponse,
            })
        }
        const secondResponse = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
        })
        return secondResponse.choices[0].message.content
    }
}
