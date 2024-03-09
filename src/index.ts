import OpenAI from "openai";
import {ChatCompletionTool} from "openai/src/resources/chat/completions";
import {tools} from "./schema-examples";
const AJV = require("ajv");

const ajv = new AJV({strict: false});

function generateToolDescriptorTool(tools: Array<ChatCompletionTool>): ChatCompletionTool {
    if (tools.length == 0) {
        throw new Error("Called without tools")
    }

    return {
        type: "function",
        function: {
            name: "tools_descriptor",
            description: `Call this tool if you need additional tools to satisfy the request.`,
            parameters: {
                type: "object",
                properties: {
                    neededTools: {
                        type: "array",
                        items: {
                            type: "string",
                            "enum": tools.map(t => t.function.name),
                        },
                        description: `The tools what will be available in the next request.`, //todo: the description can include a short description of the available tools if needed
                    },
                },
                required: ["neededTools"],
            },
        },
    }


}

export async function createTwoStepToolCall(openai: OpenAI, chatOptions: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming, availableFunctions: object, options: {
    addTools: string[],
    maxCalls: number,
    callNr: number,
    validateArgs: boolean
} = {addTools: [], validateArgs: true, maxCalls: 6, callNr: 1}) {
    const descriptorToolSchema = generateToolDescriptorTool(chatOptions.tools);
    const enabledTools = chatOptions.tools.filter((t) => options.addTools.includes(t.function.name)) || []
    const finalTools = [...enabledTools, descriptorToolSchema]
    console.log(`[${options.callNr}. request] with tools: ${finalTools.map(t => t.function.name)}`)
    if (options.callNr > options.maxCalls) {
        throw new Error(`Maximum call reached: maxCalls: ${options.maxCalls}`)
    }
    const {messages} = chatOptions;
    const response = await openai.chat.completions.create(
        {
            ...chatOptions,
            tools: finalTools,
            tool_choice: "auto"
        });

    const responseMessage = response.choices[0].message;
    console.log(`[${options.callNr}. response] message: ${responseMessage?.content}`)
    const toolCalls = responseMessage.tool_calls;
    options.addTools = []
    if (responseMessage.tool_calls) {
        messages.push(responseMessage);
        for (const toolCall of toolCalls) {
            const functionName = toolCall.function.name;
            const functionToCall = availableFunctions[functionName];
            const functionArgs = JSON.parse(toolCall.function.arguments);
            console.log(`[${options.callNr}. response] Call tool: ${functionName} with params: ${JSON.stringify(functionArgs)}`)

            if (options.validateArgs) {
                const validationSchema = [...tools, descriptorToolSchema].map(t => t.function).find(t => t.name == functionName)
                const validate = ajv.compile(validationSchema);
                const valid = validate(functionArgs);
                if (!valid) {
                    console.log(`[${functionName}]`, validate.errors);
                } else {
                    console.log(`[${functionName}] Options are valid!`);
                }
            }

            if (functionName === "tools_descriptor") {
                options.addTools = functionArgs.neededTools
                messages.push({
                    tool_call_id: toolCall.id,
                    role: "tool",
                    content: `Tools are available: ${functionArgs.neededTools}`,
                });
            } else {
                const functionResponse = functionToCall(functionArgs);
                messages.push({
                    tool_call_id: toolCall.id,
                    role: "tool",
                    content: functionResponse,
                } as any);
            }
        }

        formatMessages(messages)
        options.callNr += 1;
        await createTwoStepToolCall(openai, {...chatOptions, messages}, availableFunctions, options);
    }
}

function formatMessages(messages) {
    console.log(messages.map((m: any) => {
        if (m?.tool_calls) {
            return `[${m.role}]: tool-call: ${m?.tool_calls?.map(c => ` [name: ${c.function.name} - args: ${c.function.arguments} - id: ${c.id}]`)?.join(", ")}`
        } else if (m?.tool_call_id) {
            return `[${m.role}]: tool-response: ${m?.tool_call_id} message: ${m.content}`
        }
        return `[${m.role}]: message: ${m.content}`
    }))
    console.log()
}