const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const voiceButton = document.getElementById("voiceButton");
const chatMessages = document.getElementById("chatMessages");
const languageSelector = document.getElementById("languageSelector");
const statusText = document.getElementById("statusText");

const languages = {
    en: {
        code: "en-US",
        greeting: "Hello! I am Felix. How can I help you?",
        listening: "Listening...",
        thinking: "Thinking...",
        ready: "Felix is ready",
        error: "Sorry, I could not understand that."
    },
    bn: {
        code: "bn-IN",
        greeting: "হ্যালো! আমি ফেলিক্স। তোমাকে কীভাবে সাহায্য করতে পারি?",
        listening: "শুনছি...",
        thinking: "ভাবছি...",
        ready: "ফেলিক্স প্রস্তুত",
        error: "দুঃখিত, আমি বুঝতে পারিনি।"
    },
    hi: {
        code: "hi-IN",
        greeting: "नमस्ते! मैं फेलिक्स हूँ। मैं आपकी कैसे मदद कर सकता हूँ?",
        listening: "सुन रहा हूँ...",
        thinking: "सोच रहा हूँ...",
        ready: "फेलिक्स तैयार है",
        error: "माफ़ कीजिए, मैं समझ नहीं पाया।"
    }
};

let currentLanguage = "en";

function addMessage(message, type) {
    const messageElement = document.createElement("div");

    messageElement.className = `message ${type}`;
    messageElement.textContent = message;

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function speak(message) {
    if (!("speechSynthesis" in window)) {
        statusText.textContent = "Voice output is not supported";
        return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = languages[currentLanguage].code;
    speech.rate = 1;
    speech.pitch = 1.1;

    window.speechSynthesis.speak(speech);
}

function getReply(message) {
    const text = message.toLowerCase();

    if (currentLanguage === "en") {
        if (text.includes("hello") || text.includes("hi")) {
            return "Hello! It is nice to talk with you.";
        }

        if (text.includes("your name")) {
            return "My name is Felix. I am your virtual companion.";
        }

        if (text.includes("how are you")) {
            return "I am doing great! How are you?";
        }

        return "I received your message. My full AI brain will be connected in a later development stage.";
    }

    if (currentLanguage === "bn") {
        if (text.includes("হ্যালো") || text.includes("হাই")) {
            return "হ্যালো! তোমার সঙ্গে কথা বলে ভালো লাগছে।";
        }

        if (text.includes("নাম")) {
            return "আমার নাম ফেলিক্স। আমি তোমার ভার্চুয়াল সঙ্গী।";
        }

        return "তোমার মেসেজ পেয়েছি। পরবর্তী ধাপে আমার সম্পূর্ণ AI Brain যুক্ত করা হবে।";
    }

    if (currentLanguage === "hi") {
        if (text.includes("नमस्ते") || text.includes("हेलो")) {
            return "नमस्ते! आपसे बात करके अच्छा लगा।";
        }

        if (text.includes("नाम")) {
            return "मेरा नाम फेलिक्स है। मैं आपका वर्चुअल साथी हूँ।";
        }

        return "मुझे आपका संदेश मिल गया। अगले चरण में मेरा पूरा AI Brain जोड़ा जाएगा।";
    }

    return languages[currentLanguage].error;
}

function sendMessage() {
    const message = messageInput.value.trim();

    if (!message) return;

    addMessage(message, "user-message");

    messageInput.value = "";
    statusText.textContent = languages[currentLanguage].thinking;

    setTimeout(() => {
        const reply = getReply(message);

        addMessage(reply, "assistant-message");
        speak(reply);

        statusText.textContent = languages[currentLanguage].ready;
    }, 500);
}

sendButton.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});

languageSelector.addEventListener("change", () => {
    currentLanguage = languageSelector.value;

    chatMessages.innerHTML = "";

    const greeting = languages[currentLanguage].greeting;

    addMessage(greeting, "assistant-message");

    statusText.textContent = languages[currentLanguage].ready;
});

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

    voiceButton.addEventListener("click", () => {
        recognition.lang = languages[currentLanguage].code;

        statusText.textContent = languages[currentLanguage].listening;

        try {
            recognition.start();
        } catch (error) {
            statusText.textContent = "Voice recognition is busy";
        }
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;

        messageInput.value = transcript;
        sendMessage();
    };

    recognition.onerror = () => {
        statusText.textContent = languages[currentLanguage].error;
    };

    recognition.onend = () => {
        statusText.textContent = languages[currentLanguage].ready;
    };

} else {
    voiceButton.disabled = true;
    voiceButton.textContent = "Unavailable";
}

statusText.textContent = languages[currentLanguage].ready;
