"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOAuth2ClientForUser = getOAuth2ClientForUser;
const googleapis_1 = require("googleapis");
const env_1 = require("../config/env");
const users_1 = require("../db/users");
const crypto_1 = require("./crypto");
/**
 * Returns an OAuth2Client configured with the user's refresh token
 * @param userEmail user's email to fetch stored refresh token
 */
async function getOAuth2ClientForUser(userEmail) {
    const oauth2Client = new googleapis_1.google.auth.OAuth2(env_1.env.GOOGLE_CLIENT_ID, env_1.env.GOOGLE_CLIENT_SECRET, env_1.env.GOOGLE_REDIRECT_URI);
    // Fetch encrypted refresh token from DB
    const encryptedToken = await (0, users_1.getRefreshToken)(userEmail);
    if (!encryptedToken) {
        throw new Error("No refresh token found for user");
    }
    try {
        // Decrypt token
        const refreshToken = (0, crypto_1.decrypt)(encryptedToken);
        // Set credentials
        oauth2Client.setCredentials({ refresh_token: refreshToken });
        return oauth2Client;
    }
    catch (decryptError) {
        console.error(`Failed to decrypt refresh token for ${userEmail}:`, decryptError);
        throw new Error("Corrupted refresh token - user needs to re-authenticate");
    }
}
//# sourceMappingURL=oauthService.js.map