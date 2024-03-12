
## Make the OpenAI (or other LLM) Tools Work Better and Cheaper with a Two-Step Tool Call

I tried using OpenAI's feature for running local functions in a project with many functions. It worked well, even with lots of functions, but the cost of using OpenAI's API increased significantly. This happened because when we send function details (in JSON format) along with our main request, it counts as part of our input tokens, making it more expensive. The problem is, we often send more functions than necessary, even though the AI only needs a few of them to respond to our request.

So, I had an idea to save money and improve performace: What if we only send the details of the functions the AI actually needs? Here's how it works: First, we send a request with our main question or task, including a list of all the functions we could use, but we don't send the detailed instructions for those functions yet. We just give a brief description of each. Then, the AI tells us exactly which functions it needs to answer our question or complete our task. After that, we send another request with the detailed instructions only for those needed functions.

This method can significantly lower the cost per message because we only send the details for the functions that are necessary.
![image](https://github.com/MaurerKrisztian/two-step-llm-tool-call/assets/48491140/ce822855-5b9e-4094-96fa-89117b50bd46)
From another point of view, this method also makes the AI work faster and better. When we send too many detailed functions, we end up giving the AI too much information to handle at once. This can slow down its performance because it has to deal with a lot of extra details. However, if we only send the essential information that the AI needs, we help it stay focused and efficient. This way, we can even add more useful information without overloading it. For example, when using GPT-3 with many functions, we quickly hit the maximum amount of information it can consider at one time. By being selective about what we send, we avoid reaching this limit too soon.

Note: This code is just a demonstration currently

Read more: https://dev.to/maurerkrisztian/make-the-openai-function-calling-work-better-and-cheaper-with-a-two-step-function-call-1p96


## Setup:
Set your OpenAI API key in the .env file as "apikey".
```sh
npm install
npm start
```
