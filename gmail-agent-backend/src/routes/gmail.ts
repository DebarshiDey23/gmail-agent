// src/routes/gmail.ts
import { Router } from "express";
import { fetchEmailsForUser } from "../services/gmailService";
import { categorizeEmailsStreaming } from "../services/categorizationServices";

const router = Router();

router.get("/fetch", async (req, res) => {
    const { email } = req.query;
    const emails = await fetchEmailsForUser(email as string);
    res.json(emails);
});

router.post("/categorize", async (req, res) => {
    const { emails, filters } = req.body;
    try {
        const categorized = await categorizeEmailsStreaming(emails, filters);
        res.json(categorized);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error categorizing emails");
    }
});

export default router;
