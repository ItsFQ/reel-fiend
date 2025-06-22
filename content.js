console.log("📸 Content script running");

let lastUrl = location.href;
let counter = 0;

function isReelUrl(url) {
  return /^https:\/\/www\.instagram\.com\/reels\/[^/?#]+\/?/.test(url);
}

function saveReel(url) {
  chrome.runtime.sendMessage({ type: "SAVE_REEL", url }, () => {
    if (chrome.runtime.lastError) {
      console.warn("Message failed:", chrome.runtime.lastError.message);
    }
  });
}

function handleUrlChange(url) {
  if (url !== lastUrl) {
    lastUrl = url;

    if (isReelUrl(url)) {
      counter++;
      console.log("🎞️ Reel detected:", url);
      console.log("Reels watched so far:", counter);
      saveReel(url);
    }
  }
}

// Fallback polling every 500ms
setInterval(() => {
  handleUrlChange(location.href);
}, 500);

// Patch browser history API for better SPA support
(function(history) {
  const pushState = history.pushState;
  const replaceState = history.replaceState;

  history.pushState = function () {
    const result = pushState.apply(this, arguments);
    window.dispatchEvent(new Event("locationchange"));
    return result;
  };

  history.replaceState = function () {
    const result = replaceState.apply(this, arguments);
    window.dispatchEvent(new Event("locationchange"));
    return result;
  };

  window.addEventListener("popstate", () => {
    window.dispatchEvent(new Event("locationchange"));
  });
})(window.history);

window.addEventListener("locationchange", () => {
  handleUrlChange(location.href);
});

// Initial call
handleUrlChange(location.href);

// 🔚 Flush on unload
window.addEventListener("beforeunload", () => {
  chrome.runtime.sendMessage({ type: "SESSION_END", counter }, () => {
    if (chrome.runtime.lastError) {
      console.warn("Unload sendMessage failed:", chrome.runtime.lastError.message);
    }
  });
});

// 🌐 Accept token from website
window.addEventListener("message", (event) => {
  if (event.origin !== "http://localhost:3000") return;
  if (event.data.type === "SET_TOKEN") {
    console.log("📨 Content script received token:", event.data.token);

    chrome.runtime.sendMessage({ type: "SET_TOKEN", token: event.data.token }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Failed to send token to background:", chrome.runtime.lastError.message);
      } else {
        console.log("✅ Token sent to background:", response);
      }
    });
  }
});

// 🧪 Testing from website
window.addEventListener("message", (event) => {
  if (event.data.type === "HELLO_EXTENSION") {
    chrome.runtime.sendMessage({ type: "HELLO_EXTENSION", payload: event.data.payload });
  }
});



const img = document.createElement("img");
img.src = "https://eforms.com/images/2018/03/Employment-Job-Application.png";

img.onload = () => {
  console.log("✅ Image loaded successfully!");
};

img.onerror = (error) => {
  console.log("❌ Image failed to load:", error);
  console.log("Tried to load:", img.src);
};

img.style.position = "fixed";
img.style.top = "0";
img.style.left = "0";
img.style.width = "100vw";
img.style.height = "100vh";
img.style.objectFit = "cover";
img.style.zIndex = "999999";
img.style.display = "none";
img.style.pointerEvents = "none";

document.body.appendChild(img);

setInterval(() => {
  console.log("SCARY");
  console.log("Image src:", img.src);
  img.style.display = "block";
  setTimeout(() => {
    img.style.display = "none";
  }, 5000);
}, 10000);