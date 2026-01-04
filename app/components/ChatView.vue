<template>
    <div id="chat-container">
        <div id="message-container">
            <div v-for="(message, index) in chat.messages" :key="index">
                <ChatMessage
                    v-if="message.role !== 'system'"
                    :is-user="message.role === 'user'"
                    :content="getMessageContent(message)"
                />
            </div>
            <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </div>
        </div>
        <div id="textbox-container">
            <TextBox :disabled="chat.status === 'streaming' || chat.status === 'submitted'" @on-message="handleNewPrompt" />
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { Chat } from "@ai-sdk/vue";

const errorMessage = ref("");

const chat = new Chat({
    api: "/api/chat",
    messages: [
        {
            id: "system-1",
            role: "system",
            parts: [{ type: "text", text: `You are a helpful assistant. Give clear, direct answers. Be concise - use the fewest words needed to fully address the question. Avoid unnecessary explanations, disclaimers, or filler. If more detail would help, offer it briefly.
Use Markdown formatting for your responses, but include headers only when necessary (such as to break up multiple sections).` }],
        },
    ],
    onError: (error) => {
        console.error("Chat error:", error);
        errorMessage.value = "Sorry, there was an error processing your request.";
    },
});

function getMessageContent(message) {
    if (message.parts) {
        return message.parts
            .filter(part => part.type === "text")
            .map(part => part.text)
            .join("");
    }
    return message.content || "";
}

function handleNewPrompt(prompt) {
    errorMessage.value = "";
    chat.sendMessage({ text: prompt });
}
</script>

<style scoped>
#chat-container {
    max-width: 40rem;
    width: 100%;
}

#textbox-container {
    padding-bottom: 1.25rem;
}

.error-message {
    color: #dc2626;
    padding: 0.75rem;
    margin: 0.5rem 0;
    border-radius: 0.375rem;
    background-color: #fef2f2;
}
</style>
