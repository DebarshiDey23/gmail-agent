import { Router } from "express";
import { google } from "googleapis"
import { env } from "../config/env"
import { encrypt, decrypt } from "../services/crypto"
import { storeRefreshToken, getRefreshToken } from "../db/users";

const router = Router()
const oauth2Client = new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT_URI
);

// Step A: Redirect user to Google Oauth Page

router.get("/google", (req, res) => {
    console.log("ARRIVED")
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/gmail.readonly",
            "https://www.googleapis.com/auth/userinfo.email"
        ]
    });
    res.redirect(url)
})

// Step B: Handle Google callback
router.get("/google/callback", async (req, res) => {
    const code = req.query.code as string;
    if (!code) return res.status(400).send("Missing code");

    try {
        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        const { access_token, refresh_token } = tokens;

        oauth2Client.setCredentials(tokens);


        // Get user info
        const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
        const userInfo = await oauth2.userinfo.get();
        const email = userInfo.data.email!;

        // Check if a token already exists
        let encryptedToken = await getRefreshToken(email);

        // If Google returned a refresh token (first login or forced consent), store it
        if (refresh_token) {
            encryptedToken = encrypt(refresh_token);
            await storeRefreshToken(email, encryptedToken);
        }

        // At this point, `encryptedToken` always contains the valid refresh token
        // You can use it to get access tokens or send it to your Python agent

        res.send("OAuth success — refresh token stored or reused");
    } catch (err) {
        console.error(err);
        res.status(500).send("OAuth error");
    }
});


export default router