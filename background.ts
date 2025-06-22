import { Storage } from "@plasmohq/storage";

const storage = new Storage();
console.log("🚀 Background started");

// 💾 SESSION_END: Handle reel counter flush
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SESSION_END") {
    console.log("🔚 Session ended. Reels watched:", message.counter);
    sendResponse({ status: "received" });
    return true;
  }
});

// 🔄 SAVE_REEL: Optional per-reel URL logging
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SAVE_REEL") {
    console.log("💾 Reel saved:", message.url);
    sendResponse({ status: "saved" });
    return true;
  }
});

// 🧪 HELLO_EXTENSION test message
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "HELLO_EXTENSION") {
    console.log("🧪 Received test message:", message.payload);
    sendResponse({ status: "pong" });
    return true;
  }
});

// 🔐 SET_TOKEN: Save token via Plasmo + chrome.storage
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "SET_TOKEN") {
    console.log("🔐 Token received:", message.token);

    try {
      await storage.set("token", message.token);
      console.log("✅ Token saved via Plasmo storage");

      if (chrome.storage?.local) {
        await chrome.storage.local.set({ token: message.token });
        console.log("🗃️ Token also saved via chrome.storage.local");
      }

      sendResponse({ status: "success" });
    } catch (err) {
      console.error("❌ Error saving token:", err);
      sendResponse({ status: "error", error: err.message });
    }

    return true;
  }
});
