import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { CallbackManager } from '@langchain/core/callbacks/manager';


interface CategorizedGroup {
    category: string;
    emails: any[];
}

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
        // Strip markdown and parse JSON (your existing code)
        let cleanedText = accumulatedText.trim();
        if (cleanedText.startsWith('```json')) {
            cleanedText = cleanedText.replace(/^```json\s*/, '');
        }
        if (cleanedText.endsWith('```')) {
            cleanedText = cleanedText.replace(/\s*```$/, '');
        }

        const llmResults = JSON.parse(cleanedText);

        // Transform the results to group by category
        const categorizedGroups: { [key: string]: any[] } = {};

        llmResults.forEach((item: any) => {
            const category = item.category;
            if (!categorizedGroups[category]) {
                categorizedGroups[category] = [];
            }

            // Find the full email object from the original emails array
            const fullEmail = emails.find(email => email.subject === item.subject);
            if (fullEmail) {
                categorizedGroups[category].push(fullEmail);
            }
        });

        // Convert to the expected format
        const result: CategorizedGroup[] = Object.keys(categorizedGroups).map(category => ({
            category,
            emails: categorizedGroups[category] || [] // Ensure emails is never undefined
        }));

        return result;
    } catch (err) {
        console.error("Failed to parse JSON from streamed LLM output:", accumulatedText);
        throw err;
    }
}