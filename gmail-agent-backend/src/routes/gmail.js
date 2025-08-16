"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gmailService_1 = require("../services/gmailService");
const categorizationServices_1 = require("../services/categorizationServices");
const gmailService_2 = require("../services/gmailService"); // combined service
const router = (0, express_1.Router)();
// Fetch emails for frontend display
router.get("/fetch", async (req, res) => {
    const { email } = req.query;
    if (!email)
        return res.status(400).send("Missing user email");
    try {
        const emails = await (0, gmailService_1.fetchEmailsForUser)(email);
        res.json(emails);
    }
    catch (err) {
        console.error("Error fetching emails:", err);
        res.status(500).send("Error fetching emails");
    }
});
// Categorize emails without labeling
router.post("/categorize", async (req, res) => {
    const { emails, filters } = req.body;
    if (!emails || !filters)
        return res.status(400).send("Missing emails or filters");
    try {
        const categorized = await (0, categorizationServices_1.categorizeEmailsStreaming)(emails, filters);
        res.json(categorized);
    }
    catch (err) {
        console.error("Error categorizing emails:", err);
        res.status(500).send("Error categorizing emails");
    }
});
// Label emails based on categories
router.post("/label", async (req, res) => {
    const { labels, email } = req.body;
    if (!email)
        return res.status(400).send("Missing user email");
    try {
        const emails = await (0, gmailService_1.fetchEmailsForUser)(email);
        const categorized = await (0, categorizationServices_1.categorizeEmailsStreaming)(emails, labels);
        for (const cat of categorized) {
            // Add type checking
            if (!cat.category || !cat.emails || !Array.isArray(cat.emails)) {
                console.warn("Invalid category structure:", cat);
                continue;
            }
            const labelId = await (0, gmailService_2.createLabel)(email, cat.category);
            for (const msg of cat.emails) {
                if (msg && msg.id) {
                    await (0, gmailService_2.applyLabel)(email, msg.id, labelId);
                }
            }
        }
        res.json({ success: true, message: "Emails labeled successfully" });
    }
    catch (err) {
        console.error("Labeling error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=gmail.js.map