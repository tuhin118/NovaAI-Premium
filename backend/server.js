
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json({
        status: "online",
        message: "NovaAI backend is running 🚀"
    });
});

app.post("/api/chat", async (req, res) => {

    try {

        const message = req.body.message;

        if (!message || !message.trim()) {
            return res.status(400).json({
                error: "Message is required"
            });
        }

        /*
         * AI API connection will be added here
         * in the next step.
         */

        res.json({
            reply: "NovaAI backend received your message: " + message
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
});

app.listen(PORT, () => {
    console.log(`NovaAI backend running on port ${PORT}`);
});
