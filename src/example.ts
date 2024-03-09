import {createTwoStepToolCall} from "./two-step-tool-call";
import {availableFunctions, tools} from "./schema-examples";
require('dotenv').config();

import OpenAI from "openai";
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function input(query: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
}


const openai = new OpenAI({apiKey: process.env.apikey});

async function main() {

    while (true) {
      const result =  await createTwoStepToolCall(openai, {
            model: "gpt-3.5-turbo-0125",
            messages: [
                {
                    role: "system",
                    content: "You need to request tools with the the tool_descriptor tool before you can use it. IMPORTANT: Dont call tools that dont have json description schema."
                }, {
                    role: "user",
                    content: await input("Prompt: ")
                }],
            tools: tools,
            tool_choice: "auto",
        }, availableFunctions)

        console.log(`AI response: ${result?.content}`)
    }
}

main();