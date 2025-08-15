import { google } from "googleapis";
import { env } from "../config/env";
import { getRefreshToken } from "../db/users";
import { decrypt } from "./crypto";

/**
 * Returns an OAuth2Client configured with the user's refresh token
 * @param userEmail user's email to fetch stored refresh token
 */
export async function getOAuth2ClientForUser(userEmail: string) {
    const oauth2Client = new google.auth.OAuth2(
        env.GOOGLE_CLIENT_ID,
        env.GOOGLE_CLIENT_SECRET,
        env.GOOGLE_REDIRECT_URI
    );

    // Fetch encrypted refresh token from DB
    const encryptedToken = await getRefreshToken(userEmail);
    if (!encryptedToken) {
        throw new Error("No refresh token found for user");
    }

    try {
        // Decrypt token
        const refreshToken = decrypt(encryptedToken);

        // Set credentials
        oauth2Client.setCredentials({ refresh_token: refreshToken });

        return oauth2Client;
    } catch (decryptError) {
        console.error(`Failed to decrypt refresh token for ${userEmail}:`, decryptError);
        throw new Error("Corrupted refresh token - user needs to re-authenticate");
    }
}