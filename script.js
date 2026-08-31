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


/* =========================
   SEND MESSAGE
========================= */

async function sendMessage() {

    const text = messageInput.value.trim();

    if (!text) return;

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


        const data = await response.json();

        removeTyping();


        if (!response.ok) {

            addMessage(
                data.error || "Sorry, something went wrong.",
                "ai"
            );

            return;
        }


        addMessage(
            data.reply || "No response received.",
            "ai"
        );


    } catch (error) {

        console.error("NovaAI Error:", error);

        removeTyping();

        addMessage(
            "NovaAI server-এর সাথে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পরে আবার চেষ্টা করুন।",
            "ai"
        );

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

                <div class="welcome-icon">✦</div>

                <h2>How can I help you?</h2>

                <p>
                    Ask NovaAI anything. Start a
                    conversation and explore the
                    possibilities.
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

        closeSidebar();

    }
);


/* =========================
   MOBILE SIDEBAR
========================= */

function openSidebar() {

    sidebar.classList.add("open");

    if (sidebarOverlay) {
        sidebarOverlay.classList.add("active");
    }

}


function closeSidebar() {

    sidebar.classList.remove("open");

    if (sidebarOverlay) {
        sidebarOverlay.classList.remove("active");
    }

}


menuBtn.addEventListener(
    "click",
    () => {

        if (sidebar.classList.contains("open")) {

            closeSidebar();

        } else {

            openSidebar();

        }

    }
);


/* =========================
   CLOSE SIDEBAR ON OVERLAY
========================= */

if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        closeSidebar
    );

}


/* =========================
   CLOSE SIDEBAR ON MOBILE
========================= */

document.addEventListener(
    "click",
    (event) => {

        if (window.innerWidth > 800) return;

        if (!sidebar.classList.contains("open")) return;

        if (
            sidebar.contains(event.target) ||
            menuBtn.contains(event.target) ||
            (sidebarOverlay &&
             sidebarOverlay.contains(event.target))
        ) {
            return;
        }

        closeSidebar();

    }
);


/* =========================
   ANDROID / BROWSER BACK
========================= */

let sidebarHistoryState = false;


function pushSidebarHistory() {

    if (!sidebarHistoryState) {

        history.pushState(
            { novaaiSidebar: true },
            "",
            window.location.href
        );

        sidebarHistoryState = true;

    }

}


function openSidebarWithHistory() {

    openSidebar();

    pushSidebarHistory();

}


menuBtn.onclick = () => {

    if (sidebar.classList.contains("open")) {

        closeSidebar();

        if (sidebarHistoryState) {

            history.back();

        }

    } else {

        openSidebarWithHistory();

    }

};


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
