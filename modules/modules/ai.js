window.FelixAI = (() => {

    const responses = {
        en: {
            greeting: "Hello! I am Felix. How can I help you?",
            fallback: "I am Felix. My real AI brain will be connected soon."
        },

        bn: {
            greeting: "হ্যালো! আমি ফেলিক্স। কীভাবে সাহায্য করতে পারি?",
            fallback: "আমি ফেলিক্স। আমার আসল AI Brain শীঘ্রই যুক্ত হবে।"
        },

        hi: {
            greeting: "नमस्ते! मैं फेलिक्स हूँ। मैं आपकी कैसे मदद कर सकता हूँ?",
            fallback: "मैं फेलिक्स हूँ। मेरा असली AI Brain जल्द ही जुड़ेगा।"
        }
    };

    function getResponse(message, language = "en") {
        const selectedLanguage = responses[language] || responses.en;

        if (!message || !message.trim()) {
            return selectedLanguage.greeting;
        }

        return selectedLanguage.fallback;
    }

    return {
        getResponse
    };

})();
