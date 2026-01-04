import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  if (!config.openrouterApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "OpenRouter API key not configured",
    });
  }

  const body = await readBody(event);
  if (!body?.messages || !Array.isArray(body.messages)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request: messages array required",
    });
  }

  const openrouter = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: config.openrouterApiKey,
  });

  const result = streamText({
    model: openrouter("google/gemma-3-27b-it:free"),
    messages: await convertToModelMessages(body.messages),
  });

  return result.toUIMessageStreamResponse();
});
