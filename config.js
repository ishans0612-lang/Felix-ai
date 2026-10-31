window.FELIX_CONFIG = {
    appName: "Felix AI",
    version: "0.2.0",

    languages: {
        english: "en-US",
        bengali: "bn-IN",
        hindi: "hi-IN"
    },

    ai: {
        enabled: false,
        provider: "future",
        apiEndpoint: "",
        model: ""
    },

    voice: {
        enabled: true,
        speechRecognition: true,
        speechSynthesis: true
    },

    avatar: {
        enabled: false,
        format: "glb",
        modelPath: "assets/avatar/felix.glb"
    },

    memory: {
        enabled: false,
        storage: "future"
    },

    browserControl: {
        enabled: false
    }
};
