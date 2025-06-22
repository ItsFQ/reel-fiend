import { Storage } from "@plasmohq/storage"
import { createClient } from "@supabase/supabase-js"

// Initialize storage and Supabase client
const storage = new Storage()

const supabaseUrl = "SuperSecret.url"
const supabaseKey = "SuperSecret.base"
const supabase = createClient(supabaseUrl, supabaseKey)

console.log("🚀 Background started")

let popupPort: chrome.runtime.Port | null = null

// Listen for popup connections
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "POPUP_PORT") {
    popupPort = port

    port.onDisconnect.addListener(() => {
      popupPort = null
    })
  }
})

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "SESSION_END") {
    console.log("🔚 Session ended. Reels watched:", message.counter)

    try {
      const userEmail = await storage.get("userEmail")
      console.log(`Email: ${userEmail}`)

      if (!userEmail) {
        console.warn("No user email found in storage. Skipping Supabase update.")
        sendResponse({ status: "no_userEmail" })
        return true
      }

      // Fetch existing watchedReels count
      const { data: existingRow, error: fetchError } = await supabase
        .from("mainData")
        .select("watchedReels")
        .eq("email", userEmail)
        .maybeSingle()

      if (fetchError) {
        console.error("❌ Error fetching current watchedReels:", fetchError)
        sendResponse({ status: "error", error: fetchError.message })
        return true
      }

      if (!existingRow) {
        // Insert new row
        const { data: insertData, error: insertError } = await supabase
          .from("mainData")
          .insert({
            email: userEmail,
            watchedReels: message.counter,
            timeWasted: message.counter * 15,
          })

        if (insertError) {
          console.error("❌ Error inserting new mainData row:", insertError)
          sendResponse({ status: "error", error: insertError.message })
        } else {
          console.log("✅ New mainData row inserted:", insertData)
          sendResponse({ status: "success", data: insertData })
        }
        return true
      }

      // Update existing row
      const currentCount = existingRow.watchedReels ?? 0
      const newCount = currentCount + message.counter

      const { data: updateData, error: updateError } = await supabase
        .from("mainData")
        .update({
          watchedReels: newCount,
          timeWasted: newCount * 15,
        })
        .eq("email", userEmail)

      if (updateError) {
        console.error("❌ Supabase update error:", updateError)
        sendResponse({ status: "error", error: updateError.message })
      } else {
        console.log("✅ mainData updated successfully:", updateData)
        sendResponse({ status: "success", data: updateData })
      }
    } catch (err: any) {
      console.error("⚠️ Error handling SESSION_END:", err)
      sendResponse({ status: "error", error: err.message })
    }

    return true
  }

  if (message.type === "SET_USER_EMAIL") {
    console.log("📧 User email received:", message.userEmail)
    try {
      await storage.set("userEmail", message.userEmail)
      if (chrome.storage?.local) {
        await chrome.storage.local.set({ userEmail: message.userEmail })
      }
      sendResponse({ status: "success" })
    } catch (err: any) {
      sendResponse({ status: "error", error: err.message })
    }
    return true
  }

  if (message.type === "REEL_COUNT_UPDATED") {
    if (popupPort) {
      popupPort.postMessage({
        count: message.count,
        timeSpent: message.timeSpent
      })
    }
    sendResponse({ status: "ok" })
    return true
  }
})
