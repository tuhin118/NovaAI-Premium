
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const messages = document.getElementById("messages");
const newChatBtn = document.getElementById("newChatBtn");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const chatList = document.getElementById("chatList");
const themeBtn = document.getElementById("themeBtn");

let chats = JSON.parse(localStorage.getItem("novaai_chats")) || [];


/* =========================
   SEND MESSAGE
========================= */

function sendMessage() {

    const text = messageInput.value.trim();

    if (!text) return;

    removeWelcome();

    addMessage(text, "user");

    messageInput.value = "";
    autoResize();

    saveChat(text);

    showTyping();

    setTimeout(() => {

        removeTyping();

        addMessage(
            "আপনার বার্তা পেয়েছি। আমি NovaAI-এর AI response system-এর জন্য প্রস্তুত। 🚀",
            "ai"
        );

    }, 900);
}


/* =========================
   ADD MESSAGE
========================= */

function addMessage(text, type) {

    const message = document.createElement("div");

    message.className = `message ${type}`;

    const content = document.createElement("div");

    content.className = "message-content";

    content.textContent = text;

    message.appendChild(content);

    messages.appendChild(message);

    scrollToBottom();
}


/* =========================
   TYPING INDICATOR
========================= */

function showTyping() {

    const typing = document.createElement("div");

    typing.className = "message ai";
    typing.id = "typingIndicator";

    typing.innerHTML = `
        <div class="message-content">
            <span>NovaAI is thinking...</span>
        </div>
    `;

    messages.appendChild(typing);

    scrollToBottom();
}


function removeTyping() {

    const typing = document.getElementById("typingIndicator");

    if (typing) {
        typing.remove();
    }
}


/* =========================
   REMOVE WELCOME
========================= */

function removeWelcome() {

    const welcome = document.querySelector(".welcome");

    if (welcome) {
        welcome.remove();
    }
}


/* =========================
   SCROLL
========================= */

function scrollToBottom() {

    messages.scrollTo({
        top: messages.scrollHeight,
        behavior: "smooth"
    });
}


/* =========================
   TEXTAREA AUTO RESIZE
========================= */

function autoResize() {

    messageInput.style.height = "auto";

    messageInput.style.height =
        Math.min(messageInput.scrollHeight, 140) + "px";
}


messageInput.addEventListener("input", autoResize);


/* =========================
   ENTER TO SEND
========================= */

messageInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        sendMessage();
    }
});


/* =========================
   SEND BUTTON
========================= */

sendBtn.addEventListener("click", sendMessage);


/* =========================
   SUGGESTIONS
========================= */

document.querySelectorAll(".suggestion").forEach(button => {

    button.addEventListener("click", () => {

        messageInput.value = button.textContent.trim();

        autoResize();

        messageInput.focus();
    });

});


/* =========================
   NEW CHAT
========================= */

newChatBtn.addEventListener("click", () => {

    messages.innerHTML = `
        <div class="welcome">

            <div class="welcome-icon">✦</div>

            <h2>How can I help you?</h2>

            <p>
                Ask NovaAI anything. Start a conversation and explore
                the possibilities.
            </p>

            <div class="suggestions">

                <button class="suggestion">
                    Explain artificial intelligence
                </button>

                <button class="suggestion">
                    Help me write something
                </button>

                <button class="suggestion">
                    Give me a creative idea
                </button>

                <button class="suggestion">
                    Help me with coding
                </button>

            </div>

        </div>
    `;

    attachSuggestionEvents();

    messageInput.value = "";

    autoResize();
});


/* =========================
   MOBILE SIDEBAR
========================= */

menuBtn.addEventListener("click", () => {

    sidebar.classList.toggle("open");

});


/* =========================
   THEME BUTTON
========================= */

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

});


/* =========================
   CHAT HISTORY
========================= */

function saveChat(text) {

    chats.unshift({
        text: text,
        time: Date.now()
    });

    chats = chats.slice(0, 10);

    localStorage.setItem(
        "novaai_chats",
        JSON.stringify(chats)
    );

    renderHistory();
}


function renderHistory() {

    if (!chats.length) {

        chatList.innerHTML = `
            <div class="empty-history">
                No conversations yet
            </div>
        `;

        return;
    }

    chatList.innerHTML = "";

    chats.forEach(chat => {

        const item = document.createElement("button");

        item.className = "side-btn";

        item.textContent =
            chat.text.length > 28
                ? chat.text.substring(0, 28) + "..."
                : chat.text;

        chatList.appendChild(item);

    });
}


/* =========================
   SUGGESTION EVENTS
========================= */

function attachSuggestionEvents() {

    document.querySelectorAll(".suggestion").forEach(button => {

        button.addEventListener("click", () => {

            messageInput.value =
                button.textContent.trim();

            autoResize();

            messageInput.focus();

        });

    });

}


/* =========================
   INITIALIZE
========================= */

renderHistory();
