import { getRefreshToken } from "../db/users";
import { encrypt, decrypt } from "./crypto";
import { env, ref } from "process";
import { google } from "googleapis";

export async function fetchEmailsForUser(email: string) {
    const encryptedToken = await getRefreshToken(email);
    const refreshToken = decrypt(encryptedToken);

    const oauth2Client = new google.auth.OAuth2(
        env.GOOGLE_CLIENT_ID,
        env.GOOGLE_CLIENT_SECRET,
        env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({ refresh_token: refreshToken })
    await oauth2Client.getAccessToken();


    const gmail = google.gmail({ version: "v1", auth: oauth2Client })
    const messages = await gmail.users.messages.list({ userId: "me", maxResults: 50 })

    // Fetch full content for each message
    const emailContents = [];

    if (messages.data.messages) {
        for (const msg of messages.data.messages) {
            const fullMsg = await gmail.users.messages.get({ userId: "me", id: msg.id! })
            const subject = fullMsg.data.payload?.headers?.find(h => h.name === "Subject")?.value || ""
            const snippet = fullMsg.data.snippet || ""
            emailContents.push({ subject, snippet })
        }
    }
    return emailContents
}