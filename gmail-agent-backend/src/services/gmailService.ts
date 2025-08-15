import { google } from "googleapis";
import { getOAuth2ClientForUser } from "./oauthService"

/**
 * Fetches the most recent emails for a user
 * @param userEmail user's email
 * @param maxResults optional limit (default 50)
 */
export async function fetchEmailsForUser(userEmail: string, maxResults = 50) {
    const oauth2Client = await getOAuth2ClientForUser(userEmail);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const messagesRes = await gmail.users.messages.list({ userId: "me", maxResults });
    const emailContents: {
        subject: string;
        snippet: string;
        id: string;
        internalDate: number;
    }[] = [];

    if (!messagesRes.data.messages) return emailContents;

    for (const msg of messagesRes.data.messages) {
        const fullMsg = await gmail.users.messages.get({ userId: "me", id: msg.id! });
        const headers = fullMsg.data.payload?.headers || [];
        const subject = headers.find(h => h.name === "Subject")?.value || "";
        const snippet = fullMsg.data.snippet || "";
        const internalDate = fullMsg.data.internalDate ? parseInt(fullMsg.data.internalDate) : 0;

        emailContents.push({ subject, snippet, id: msg.id!, internalDate });
    }

    return emailContents;
}

/**
 * Creates a Gmail label if it doesn't exist, returns label ID
 */
export async function createLabel(userEmail: string, labelName: string) {
    const oauth2Client = await getOAuth2ClientForUser(userEmail);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const res = await gmail.users.labels.list({ userId: "me" });
    const existing = res.data.labels?.find(l => l.name === labelName);
    if (existing) return existing.id!;

    const newLabel = await gmail.users.labels.create({
        userId: "me",
        requestBody: {
            name: labelName,
            labelListVisibility: "labelShow",
            messageListVisibility: "show",
        },
    });

    return newLabel.data.id!;
}

/**
 * Applies a label to a Gmail message
 */
export async function applyLabel(userEmail: string, messageId: string, labelId: string) {
    const oauth2Client = await getOAuth2ClientForUser(userEmail);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    await gmail.users.messages.modify({
        userId: "me",
        id: messageId,
        requestBody: { addLabelIds: [labelId] },
    });
}
