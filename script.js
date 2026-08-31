const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const messages = document.getElementById("messages");
const newChatBtn = document.getElementById("newChatBtn");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const chatList = document.getElementById("chatList");
const themeBtn = document.getElementById("themeBtn");
const sidebarOverlay = document.getElementById("sidebarOverlay");

const API_URL = "https://novaai-premium.onrender.com/api/chat";

let chats = JSON.parse(localStorage.getItem("novaai_chats")) || [];

let isSending = false;
let sidebarHistoryState = false;


/* =========================
   SEND MESSAGE
========================= */

async function sendMessage() {

    const text = messageInput.value.trim();

    if (!text || isSending) return;

    isSending = true;

    sendBtn.disabled = true;

    removeWelcome();

    addMessage(text, "user");

    messageInput.value = "";

    autoResize();

    saveChat(text);

    showTyping();

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: text
            })

        });

        let data = {};

        try {
            data = await response.json();
        } catch (jsonError) {
            data = {};
        }

        removeTyping();

        if (!response.ok) {

            addMessage(
                data.error ||
                `Server error (${response.status}). আবার চেষ্টা করুন।`,
                "ai"
            );

            return;
        }

        addMessage(
            data.reply ||
            "NovaAI কোনো response দেয়নি। আবার চেষ্টা করুন।",
            "ai"
        );

    } catch (error) {

        console.error("NovaAI Error:", error);

        removeTyping();

        addMessage(
            "NovaAI server-এর সাথে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পরে আবার চেষ্টা করুন।",
            "ai"
        );

    } finally {

        isSending = false;

        sendBtn.disabled = false;

        messageInput.focus();

    }
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

    removeTyping();

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

    const typing =
        document.getElementById("typingIndicator");

    if (typing) {
        typing.remove();
    }
}


/* =========================
   REMOVE WELCOME
========================= */

function removeWelcome() {

    const welcome =
        document.querySelector(".welcome");

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


messageInput.addEventListener(
    "input",
    autoResize
);


/* =========================
   ENTER TO SEND
========================= */

messageInput.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


/* =========================
   SEND BUTTON
========================= */

sendBtn.addEventListener(
    "click",
    sendMessage
);


/* =========================
   SUGGESTIONS
========================= */

function attachSuggestionEvents() {

    document
        .querySelectorAll(".suggestion")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    messageInput.value =
                        button.textContent.trim();

                    autoResize();

                    messageInput.focus();

                }
            );

        });

}


attachSuggestionEvents();


/* =========================
   NEW CHAT
========================= */

newChatBtn.addEventListener(
    "click",
    () => {

        messages.innerHTML = `

            <div class="welcome">

                <div class="welcome-icon">
                    ✦
                </div>

                <h2>
                    How can I help you?
                </h2>

                <p>
                    Ask NovaAI anything. Start a
                    conversation and explore the
                    possibilities.
                </p>

                <div class="suggestions">

                    <button
                        class="suggestion"
                        type="button">

                        Explain artificial intelligence

                    </button>

                    <button
                        class="suggestion"
                        type="button">

                        Help me write something

                    </button>

                    <button
                        class="suggestion"
                        type="button">

                        Give me a creative idea

                    </button>

                    <button
                        class="suggestion"
                        type="button">

                        Help me with coding

                    </button>

                </div>

            </div>

        `;

        attachSuggestionEvents();

        messageInput.value = "";

        autoResize();

        closeSidebar();

        messageInput.focus();

    }
);


/* =========================
   MOBILE SIDEBAR
========================= */

function openSidebar() {

    sidebar.classList.add("open");

    if (sidebarOverlay) {
        sidebarOverlay.classList.add("active");
        sidebarOverlay.setAttribute(
            "aria-hidden",
            "false"
        );
    }

    menuBtn.setAttribute(
        "aria-expanded",
        "true"
    );
}


function closeSidebar() {

    sidebar.classList.remove("open");

    if (sidebarOverlay) {
        sidebarOverlay.classList.remove("active");
        sidebarOverlay.setAttribute(
            "aria-hidden",
            "true"
        );
    }

    menuBtn.setAttribute(
        "aria-expanded",
        "false"
    );
}


/* =========================
   SIDEBAR HISTORY
========================= */

function openSidebarWithHistory() {

    openSidebar();

    if (!sidebarHistoryState) {

        history.pushState(
            {
                novaaiSidebar: true
            },
            "",
            window.location.href
        );

        sidebarHistoryState = true;
    }
}


function closeSidebarWithHistory() {

    if (!sidebar.classList.contains("open")) {
        return;
    }

    closeSidebar();

    if (sidebarHistoryState) {

        sidebarHistoryState = false;

        history.back();

    }
}


/* =========================
   MENU BUTTON
========================= */

menuBtn.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        if (sidebar.classList.contains("open")) {

            closeSidebarWithHistory();

        } else {

            openSidebarWithHistory();

        }

    }
);


/* =========================
   SIDEBAR OVERLAY
========================= */

if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        () => {

            closeSidebarWithHistory();

        }
    );

}


/* =========================
   CLOSE SIDEBAR
   WHEN CLICKING OUTSIDE
========================= */

document.addEventListener(
    "click",
    (event) => {

        if (window.innerWidth > 800) {
            return;
        }

        if (!sidebar.classList.contains("open")) {
            return;
        }

        if (sidebar.contains(event.target)) {
            return;
        }

        if (menuBtn.contains(event.target)) {
            return;
        }

        closeSidebarWithHistory();

    }
);


/* =========================
   ANDROID / BROWSER BACK
========================= */

window.addEventListener(
    "popstate",
    () => {

        if (sidebar.classList.contains("open")) {

            closeSidebar();

        }

        sidebarHistoryState = false;

    }
);


/* =========================
   HANDLE RESIZE
========================= */

window.addEventListener(
    "resize",
    () => {

        if (window.innerWidth > 800) {

            closeSidebar();

            sidebarHistoryState = false;

        }

    }
);


/* =========================
   THEME BUTTON
========================= */

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light-mode"
        );

    }
);


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


/* =========================
   RENDER HISTORY
========================= */

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

        const item =
            document.createElement("button");

        item.className = "side-btn";

        item.type = "button";

        item.textContent =
            chat.text.length > 28
                ? chat.text.substring(0, 28) + "..."
                : chat.text;

        chatList.appendChild(item);

    });

}


/* =========================
   INITIALIZE
========================= */

renderHistory();

autoResize();
