import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event);
  const config = useRuntimeConfig();

  const openrouter = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: config.openrouterApiKey,
  });

  const result = streamText({
    model: openrouter("google/gemma-3-27b-it:free"),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
});
