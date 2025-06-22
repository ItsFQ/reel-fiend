console.log("📸 Content script running")

let lastUrl = location.href
let counter = 0
let startTime = null
let timeSpent = 0 // seconds

function isReelUrl(url) {
  return /^https:\/\/www\.instagram\.com\/reels\/[^/?#]+\/?/.test(url)
}

function saveReel(url) {
  chrome.runtime.sendMessage({ type: "SAVE_REEL", url }, () => {
    if (chrome.runtime.lastError) {
      console.warn("Message failed:", chrome.runtime.lastError.message)
    }
  })
}

function handleUrlChange(url) {
  if (url !== lastUrl) {
    if (isReelUrl(lastUrl) && startTime) {
      const duration = Math.floor((Date.now() - startTime) / 1000)
      timeSpent += duration
      console.log("🕒 Time spent on last reel:", duration, "seconds")
      startTime = null
    }

    lastUrl = url

    if (isReelUrl(url)) {
      counter++
      console.log("🎞️ Reel detected:", url)
      console.log("Reels watched so far:", counter)
      saveReel(url)
      startTime = Date.now()

      // Send updated count and timeSpent to background
      chrome.runtime.sendMessage({
        type: "REEL_COUNT_UPDATED",
        count: counter,
        timeSpent // seconds
      })
      if (!window.overlaySchedulerRunning) {
        window.overlaySchedulerRunning = true
        scheduleRandomOverlaysRepeatedly(3, 30)
      }
    } else {
      // User navigated away from reels: stop scheduling overlays
      if (window.overlaySchedulerRunning) {
        window.overlaySchedulerRunning = false
        clearAllOverlayTimers()
      }
    }
  }
}

setInterval(() => {
  handleUrlChange(location.href)
}, 500)

// SPA support for Instagram's dynamic navigation
;(function (history) {
  const pushState = history.pushState
  const replaceState = history.replaceState

  history.pushState = function () {
    const result = pushState.apply(this, arguments)
    window.dispatchEvent(new Event("locationchange"))
    return result
  }

  history.replaceState = function () {
    const result = replaceState.apply(this, arguments)
    window.dispatchEvent(new Event("locationchange"))
    return result
  }

  window.addEventListener("popstate", () => {
    window.dispatchEvent(new Event("locationchange"))
  })
})(window.history)

window.addEventListener("locationchange", () => {
  handleUrlChange(location.href)
})

// 🔚 Send session data on unload
window.addEventListener("beforeunload", () => {
  if (isReelUrl(location.href) && startTime) {
    const duration = Math.floor((Date.now() - startTime) / 1000)
    timeSpent += duration
    console.log("🕒 Final reel time added before unload:", duration, "seconds")
  }

  chrome.runtime.sendMessage(
    {
      type: "SESSION_END",
      counter,
      timeSpent
    },
    () => {
      if (chrome.runtime.lastError) {
        console.warn(
          "Unload sendMessage failed:",
          chrome.runtime.lastError.message
        )
      }
    }
  )
})

// Accept token and email from web app
window.addEventListener("message", (event) => {
  if (event.origin !== "http://localhost:3000") return

  if (event.data.type === "SET_TOKEN") {
    console.log("📨 Content script received token:", event.data.token)
    chrome.runtime.sendMessage({ type: "SET_TOKEN", token: event.data.token })
  }

  if (event.data.type === "SET_USER_ID") {
    console.log("📨 Content script received user email:", event.data.id)
    chrome.runtime.sendMessage({
      type: "SET_USER_EMAIL",
      userEmail: event.data.id
    })
  }

  if (event.data.type === "HELLO_EXTENSION") {
    chrome.runtime.sendMessage({
      type: "HELLO_EXTENSION",
      payload: event.data.payload
    })
  }
})

// Show job application overlay on reel with smooth fade-in and 1s duration + sound effect
function showJobOverlayOnReel() {
  const reelMedia = document.querySelector(
    ".xz74otr.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1bs05mj.x5yr21d.x10l6tqk.x1d8287x.x19991ni.xwzpupj.xuzhngd"
  )

  if (!reelMedia || !reelMedia.parentElement) {
    console.warn("⚠️ Reel media element not found")
    return
  }

  const parent = reelMedia.parentElement
  parent.style.position = "relative"

  const img = document.createElement("img")
  img.src = "https://eforms.com/images/2018/03/Employment-Job-Application.png"
  img.style.position = "absolute"
  img.style.top = "0"
  img.style.left = "0"
  img.style.width = "100%"
  img.style.height = "100%"
  img.style.objectFit = "cover"
  img.style.zIndex = "999999"
  img.style.pointerEvents = "none"
  img.style.opacity = "0"
  img.style.transition = "opacity 0.4s ease-in-out"

  parent.appendChild(img)

  // Trigger fade-in
  requestAnimationFrame(() => {
    img.style.opacity = "1"
  })

  // Remove overlay after fade-in + 1 second display
  setTimeout(() => {
    img.remove()
  }, 1400) // 400ms fade-in + 1000ms visible
}

// Clear all scheduled overlay timers
function clearAllOverlayTimers() {
  if (window.jobOverlayTimers) {
    window.jobOverlayTimers.forEach((id) => clearTimeout(id))
    window.jobOverlayTimers = []
  }
}

/**
 * Schedule random job overlay appearances once
 * @param {number} amount - How many times to show overlay
 * @param {number} maxSeconds - Max seconds window for all appearances
 */
function scheduleRandomOverlays(amount, maxSeconds) {
  clearAllOverlayTimers()
  window.jobOverlayTimers = []

  for (let i = 0; i < amount; i++) {
    const randomDelay = Math.floor(Math.random() * maxSeconds * 1000)
    const timerId = setTimeout(() => {
      if (isReelUrl(location.href)) {
        showJobOverlayOnReel()
      }
    }, randomDelay)
    window.jobOverlayTimers.push(timerId)
  }
}

/**
 * Schedule overlays repeatedly while user watches reels
 * @param {number} amount - Number of overlays per cycle
 * @param {number} maxSeconds - Duration of each scheduling cycle in seconds
 */
function scheduleRandomOverlaysRepeatedly(amount, maxSeconds) {
  if (!window.overlaySchedulerRunning) return

  scheduleRandomOverlays(amount, maxSeconds)

  // After maxSeconds, check if user is still on a reel and reschedule
  setTimeout(() => {
    if (window.overlaySchedulerRunning && isReelUrl(location.href)) {
      scheduleRandomOverlaysRepeatedly(amount, maxSeconds)
    } else {
      window.overlaySchedulerRunning = false
      clearAllOverlayTimers()
    }
  }, maxSeconds * 1000)
}

// Initial call removed, scheduling starts when user first lands on a reel page
