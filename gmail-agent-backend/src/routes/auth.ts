import { Router } from "express";
import { google } from "googleapis";
import { env } from "../config/env";
import { encrypt } from "../services/crypto";
import { storeRefreshToken } from "../db/users";
import { db } from "../db/firebase";

const router = Router();

const oauth2Client = new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT_URI
);

router.get("/google", (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/gmail.readonly",
            "https://www.googleapis.com/auth/gmail.labels",
            "https://www.googleapis.com/auth/gmail.modify",
            "https://www.googleapis.com/auth/userinfo.email",
        ],
    });
    res.redirect(url);
});

router.get("/google/callback", async (req, res) => {
    const code = req.query.code as string;
    if (!code) return res.status(400).send("Missing code");

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
        const userInfo = await oauth2.userinfo.get();
        const email = userInfo.data.email!;

        if (tokens.refresh_token) {
            const encryptedToken = encrypt(tokens.refresh_token);
            await storeRefreshToken(email, encryptedToken);
        }

        res.redirect(`https://gmail-agent-t5kd.onrender.com/dashboard?loggedIn=true&email=${encodeURIComponent(email)}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("OAuth error");
    }
});

router.get("/check-token/:email", async (req, res) => {
    const email = req.params.email;
    try {
        const doc = await db.collection("users").doc(email).get();
        if (!doc.exists) {
            return res.json({ message: "No document found - this is good!" });
        }
        const data = doc.data();
        res.json({
            exists: doc.exists,
            hasRefreshToken: !!data?.encryptedRefreshToken,
            data: data
        });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.delete("/force-clear/:email", async (req, res) => {
    const email = req.params.email;
    try {
        console.log(`Force clearing all data for ${email}`);

        // Delete the entire document
        await db.collection("users").doc(email).delete();

        console.log(`Document deleted for ${email}`);
        res.json({ success: true, message: `Completely cleared data for ${email}` });
    } catch (error) {
        console.error("Error force clearing:", error);
        res.status(500).json({ error: error });
    }
});

export default router;
