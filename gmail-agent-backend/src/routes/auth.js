"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const googleapis_1 = require("googleapis");
const env_1 = require("../config/env");
const crypto_1 = require("../services/crypto");
const users_1 = require("../db/users");
const firebase_1 = require("../db/firebase");
const router = (0, express_1.Router)();
const oauth2Client = new googleapis_1.google.auth.OAuth2(env_1.env.GOOGLE_CLIENT_ID, env_1.env.GOOGLE_CLIENT_SECRET, env_1.env.GOOGLE_REDIRECT_URI);
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
    const code = req.query.code;
    if (!code)
        return res.status(400).send("Missing code");
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        const oauth2 = googleapis_1.google.oauth2({ auth: oauth2Client, version: "v2" });
        const userInfo = await oauth2.userinfo.get();
        const email = userInfo.data.email;
        if (tokens.refresh_token) {
            const encryptedToken = (0, crypto_1.encrypt)(tokens.refresh_token);
            await (0, users_1.storeRefreshToken)(email, encryptedToken);
        }
        res.redirect(`http://localhost:5173/dashboard?loggedIn=true&email=${encodeURIComponent(email)}`);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("OAuth error");
    }
});
router.get("/check-token/:email", async (req, res) => {
    const email = req.params.email;
    try {
        const doc = await firebase_1.db.collection("users").doc(email).get();
        if (!doc.exists) {
            return res.json({ message: "No document found - this is good!" });
        }
        const data = doc.data();
        res.json({
            exists: doc.exists,
            hasRefreshToken: !!data?.encryptedRefreshToken,
            data: data
        });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
router.delete("/force-clear/:email", async (req, res) => {
    const email = req.params.email;
    try {
        console.log(`Force clearing all data for ${email}`);
        // Delete the entire document
        await firebase_1.db.collection("users").doc(email).delete();
        console.log(`Document deleted for ${email}`);
        res.json({ success: true, message: `Completely cleared data for ${email}` });
    }
    catch (error) {
        console.error("Error force clearing:", error);
        res.status(500).json({ error: error });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map