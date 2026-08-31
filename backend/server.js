const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("GEMINI_API_KEY is not configured.");
}

const ai = apiKey ? new GoogleGenAI({
    apiKey: apiKey
}) : null;


/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {

    res.json({
        status: "online",
        service: "NovaAI Backend"
    });

});


/* =========================
   AI CHAT
========================= */

app.post("/api/chat", async (req, res) => {

    try {

        const message = req.body.message;

        if (!message || !message.trim()) {

            return res.status(400).json({
                error: "Message is required."
            });

        }

        if (!ai) {

            return res.status(500).json({
                error: "Gemini API key is not configured."
            });

        }


        const response = await ai.models.generateContent({

            model: "gemini-2.5-flash",

            contents: message.trim()

        });


        const reply = response.text || "No response received.";

        res.json({
            reply: reply
        });


    } catch (error) {

        console.error("Gemini API Error:", error);

        res.status(500).json({
            error: "Failed to get AI response."
        });

    }

});


/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {

    console.log(
        `NovaAI backend running on port ${PORT}`
    );

});
