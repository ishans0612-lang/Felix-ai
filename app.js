
"use strict";

/*
 * FELIX AI
 * Main Application Controller
 * Languages: English, Bengali, Hindi
 */

const FelixApp = (() => {

    const elements = {
        input: document.getElementById("messageInput"),
        send: document.getElementById("sendButton"),
        voice: document.getElementById("voiceButton"),
        messages: document.getElementById("chatMessages"),
        language: document.getElementById("languageSelector"),
        status: document.getElementById("statusText")
    };

    const translations = {
        en: {
            greeting: "Hello! I am Felix. How can I help you?",
            listening: "Listening...",
            ready: "Felix is ready",
            thinking: "Thinking...",
            voiceError: "Voice recognition failed.",
            empty: "Please enter a message."
        },

        bn: {
            greeting: "হ্যালো! আমি ফেলিক্স। কীভাবে তোমাকে সাহায্য করতে পারি?",
            listening: "শুনছি...",
            ready: "ফেলিক্স প্রস্তুত",
            thinking: "ভাবছি...",
            voiceError: "ভয়েস বুঝতে সমস্যা হয়েছে।",
            empty: "একটি মেসেজ লেখো।"
        },

        hi: {
            greeting: "नमस्ते! मैं फेलिक्स हूँ। मैं आपकी कैसे मदद कर सकता हूँ?",
            listening: "सुन रहा हूँ...",
            ready: "फेलिक्स तैयार है",
            thinking: "सोच रहा हूँ...",
            voiceError: "आवाज़ समझने में समस्या हुई।",
            empty: "कृपया संदेश लिखें।"
        }
    };

    let language = "en";
    let recognition = null;

    function getLanguage() {
        return translations[language] || translations.en;
    }

    function setStatus(message) {
        elements.status.textContent = message;
    }

    function addMessage(message, sender) {
        const item = document.createElement("div");

        item.classList.add(
            "message",
            sender === "user" ? "user-message" : "assistant-message"
        );

        item.textContent = message;

        elements.messages.appendChild(item);
        elements.messages.scrollTop = elements.messages.scrollHeight;
    }

    function speak(message) {
        if (!("speechSynthesis" in window)) {
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(message);

        const voiceLanguages = {
            en: "en-US",
            bn: "bn-IN",
            hi: "hi-IN"
        };

        utterance.lang = voiceLanguages[language];
        utterance.rate = 1;
        utterance.pitch = 1.1;

        window.speechSynthesis.speak(utterance);
    }

    async function getAIResponse(message) {
        if (window.FelixAI &&
            typeof window.FelixAI.getResponse === "function") {

            return await window.FelixAI.getResponse(message, language);
        }

        return getLanguage().greeting;
    }

    async function sendMessage() {
        const message = elements.input.value.trim();

        if (!message) {
            setStatus(getLanguage().empty);
            return;
        }

        addMessage(message, "user");
        elements.input.value = "";

        setStatus(getLanguage().thinking);
        elements.send.disabled = true;

        try {
            const reply = await getAIResponse(message);

            addMessage(reply, "assistant");
            speak(reply);

        } catch (error) {
            console.error("Felix AI error:", error);

            addMessage(
                "Sorry, something went wrong. Please try again.",
                "assistant"
            );

        } finally {
            elements.send.disabled = false;
            setStatus(getLanguage().ready);
        }
    }

    function changeLanguage(newLanguage) {
        if (!translations[newLanguage]) {
            return;
        }

        language = newLanguage;

        elements.messages.innerHTML = "";

        addMessage(getLanguage().greeting, "assistant");
        setStatus(getLanguage().ready);

        if (recognition) {
            recognition.lang = getVoiceLanguage();
        }
    }

    function getVoiceLanguage() {
        return {
            en: "en-US",
            bn: "bn-IN",
            hi: "hi-IN"
        }[language];
    }

    function initializeVoice() {
        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            elements.voice.disabled = true;
            elements.voice.textContent = "Unavailable";
            return;
        }

        recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;

            elements.input.value = transcript;
            sendMessage();
        };

        recognition.onerror = () => {
            setStatus(getLanguage().voiceError);
        };

        recognition.onend = () => {
            setStatus(getLanguage().ready);
        };

        elements.voice.addEventListener("click", () => {
            recognition.lang = getVoiceLanguage();
            setStatus(getLanguage().listening);

            try {
                recognition.start();
            } catch (error) {
                console.error("Voice error:", error);
                setStatus(getLanguage().voiceError);
            }
        });
    }

    function initialize() {
        if (!Object.values(elements).every(Boolean)) {
            console.error("Felix UI elements are missing.");
            return;
        }

        elements.send.addEventListener("click", sendMessage);

        elements.input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                sendMessage();
            }
        });

        elements.language.addEventListener("change", (event) => {
            changeLanguage(event.target.value);
        });

        initializeVoice();

        addMessage(getLanguage().greeting, "assistant");
        setStatus(getLanguage().ready);
    }

    return {
        initialize,
        sendMessage,
        changeLanguage
    };

})();

document.addEventListener("DOMContentLoaded", FelixApp.initialize);
