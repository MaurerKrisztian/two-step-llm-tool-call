import {ChatCompletionTool} from "openai/src/resources/chat/completions";

export const tools: Array<ChatCompletionTool> = [
    {
        type: "function",
        function: {
            name: "get_current_weather",
            description: "Get the current weather in a given location",
            parameters: {
                type: "object",
                properties: {
                    location: {
                        type: "string",
                        description: "The city and state, e.g. San Francisco, CA",
                    },
                    unit: {type: "string", enum: ["celsius", "fahrenheit"]},
                },
                required: ["location"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "set_alarm",
            description: "Set an alarm for a specified number of minutes from now",
            parameters: {
                type: "object",
                properties: {
                    minutes: {
                        type: "number",
                        description: "The number of minutes from now to set the alarm",
                    },
                },
                required: ["minutes"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "make_pizza_order",
            description: "Place an order for pizza with custom options",
            parameters: {
                type: "object",
                properties: {
                    size: {
                        type: "string",
                        enum: ["small", "medium", "large"],
                        description: "The size of the pizza",
                    },
                    toppings: {
                        type: "array",
                        items: { type: "string" },
                        description: "List of toppings for the pizza",
                    },
                    extraCheese: {
                        type: "boolean",
                        description: "Whether to add extra cheese or not",
                    },
                },
                required: ["size", "toppings"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_news_headlines",
            description: "Fetch the latest news headlines based on a category",
            parameters: {
                type: "object",
                properties: {
                    category: {
                        type: "string",
                        enum: ["technology", "sports", "entertainment"],
                        description: "The category of news to fetch",
                    },
                },
                required: ["category"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "calculate_interest",
            description: "Calculate the interest for a given principal over a period at a fixed rate",
            parameters: {
                type: "object",
                properties: {
                    principal: {
                        type: "number",
                        description: "The principal amount",
                    },
                    rate: {
                        type: "number",
                        description: "The interest rate per period",
                    },
                    period: {
                        type: "number",
                        description: "The number of periods",
                    },
                },
                required: ["principal", "rate", "period"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "convert_currency",
            description: "Convert an amount from one currency to another",
            parameters: {
                type: "object",
                properties: {
                    amount: {
                        type: "number",
                        description: "The amount to convert",
                    },
                    fromCurrency: {
                        type: "string",
                        description: "The currency code to convert from",
                    },
                    toCurrency: {
                        type: "string",
                        description: "The currency code to convert to",
                    },
                },
                required: ["amount", "fromCurrency", "toCurrency"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "send_email",
            description: "Send an email to a specified recipient",
            parameters: {
                type: "object",
                properties: {
                    to: {
                        type: "string",
                        description: "The email address of the recipient",
                    },
                    subject: {
                        type: "string",
                        description: "The subject of the email",
                    },
                    body: {
                        type: "string",
                        description: "The body content of the email",
                    },
                },
                required: ["to", "subject", "body"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_stock_price",
            description: "Get the current price of a specified stock symbol",
            parameters: {
                type: "object",
                properties: {
                    symbol: {
                        type: "string",
                        description: "The stock symbol",
                    },
                },
                required: ["symbol"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "generate_password",
            description: "Generate a random password with specified constraints",
            parameters: {
                type: "object",
                properties: {
                    length: {
                        type: "number",
                        description: "The length of the password",
                    },
                    includeSymbols: {
                        type: "boolean",
                        description: "Whether to include symbols",
                    },
                    includeNumbers: {
                        type: "boolean",
                        description: "Whether to include numbers",
                    },
                    includeLowercase: {
                        type: "boolean",
                        description: "Whether to include lowercase letters",
                    },
                    includeUppercase: {
                        type: "boolean",
                        description: "Whether to include uppercase letters",
                    },
                },
                required: ["length"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "translate_text",
            description: "Translate text from one language to another",
            parameters: {
                type: "object",
                properties: {
                    text: {
                        type: "string",
                        description: "The text to translate",
                    },
                    fromLanguage: {
                        type: "string",
                        description: "The source language code",
                    },
                    toLanguage: {
                        type: "string",
                        description: "The target language code",
                    },
                },
                required: ["text", "toLanguage"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_directions",
            description: "Get directions from one location to another",
            parameters: {
                type: "object",
                properties: {
                    origin: {
                        type: "string",
                        description: "The starting location",
                    },
                    destination: {
                        type: "string",
                        description: "The destination location",
                    },
                    mode: {
                        type: "string",
                        enum: ["driving", "walking", "bicycling", "transit"],
                        description: "The mode of transportation",
                    },
                },
                required: ["origin", "destination"],
            },
        },
    },
];



export const availableFunctions = {
    get_current_weather: (options: { location: string, unit?: string }) => `Weather data for ${options.location} in ${options.unit || 'default unit'}.`,
    set_alarm: (options: { minutes: number }) => `The alarm is set for ${options.minutes} minute(s). ${JSON.stringify(options)}`,
    make_pizza_order: (options: { size: string, toppings: string[], extraCheese?: boolean }) => `Pizza order success: ${JSON.stringify(options)}`,
    get_news_headlines: (options: { category: string }) => `Fetching news for category: ${options.category}.`,
    calculate_interest: (options: { principal: number, rate: number, period: number }) => `Interest calculated for principal ${options.principal}, rate ${options.rate}, over ${options.period} periods.`,
    convert_currency: (options: { amount: number, fromCurrency: string, toCurrency: string }) => `Currency conversion: ${options.amount} from ${options.fromCurrency} to ${options.toCurrency}.`,
    send_email: (options: { to: string, subject: string, body: string }) => `Email sent to ${options.to}: ${options.subject}.`,
    get_stock_price: (options: { symbol: string }) => `Stock price for ${options.symbol}.`,
    generate_password: (options: { length: number, includeSymbols: boolean, includeNumbers: boolean, includeLowercase: boolean, includeUppercase: boolean }) => `Password generated with length ${options.length} and constraints.`,
    translate_text: (options: { text: string, fromLanguage: string, toLanguage: string }) => `Translation from ${options.fromLanguage || 'auto'} to ${options.toLanguage}: ${options.text}.`,
    get_directions: (options: { origin: string, destination: string, mode: string }) => `Directions from ${options.origin} to ${options.destination} by ${options.mode}.`,
};
