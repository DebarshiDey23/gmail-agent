import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { CallbackManager } from '@langchain/core/callbacks/manager';

export async function categorizeEmailsStreaming(
    emails: { subject: string; snippet: string }[],
    filters: string[]
) {
    let accumulatedText = ""; // will store all tokens

    const prompt = `
You are an assistant that categorizes emails.
The categories are: ${filters.join(", ")}.

Classify the following emails. Output JSON like: [{subject: ..., category: ...}, ...]:

${emails.map((e) => `Subject: ${e.subject}\nSnippet: ${e.snippet}`).join("\n\n")}
`;

    const llm = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        temperature: 0,
        maxRetries: 2,
        streaming: true,
        callbackManager: CallbackManager.fromHandlers({
            handleLLMNewToken: (token: string) => {
                accumulatedText += token;
            },
        }),
    });

    // Invoke LLM (streaming will fill accumulatedText)
    await llm.invoke(prompt);

    // Parse JSON after streaming is done
    try {
        return JSON.parse(accumulatedText);
    } catch (err) {
        console.error("Failed to parse JSON from streamed LLM output:", accumulatedText);
        throw err;
    }
}

