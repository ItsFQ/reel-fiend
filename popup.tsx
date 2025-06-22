import React, { useEffect, useState } from "react"
import { FiVideo } from "react-icons/fi"

function IndexPopup() {
  const [count, setCount] = useState<number | null>(null)
  const [timeSpent, setTimeSpent] = useState<number | null>(null)

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id
      if (tabId != null) {
        chrome.tabs.sendMessage(tabId, { type: "GET_COUNT" }, (response) => {
          if (typeof response === "number") {
            setCount(response)
          }
        })
        chrome.tabs.sendMessage(tabId, { type: "GET_TIME_SPENT" }, (response) => {
          if (typeof response === "number") {
            setTimeSpent(response)
          }
        })
      }
    })

    const port = chrome.runtime.connect({ name: "POPUP_PORT" })
    port.onMessage.addListener((msg) => {
      if (typeof msg.count === "number") {
        setCount(msg.count)
      }
      if (typeof msg.timeSpent === "number") {
        setTimeSpent(msg.timeSpent)
      }
    })

    return () => {
      port.disconnect()
    }
  }, [])

  const minutes = timeSpent !== null ? Math.floor(timeSpent / 60) : null

  return (
    <div
      style={{ minWidth: "350px", padding: "20px" }}
      className="rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 text-indigo-200 font-sans shadow-lg"
    >
      <div className="flex items-center justify-center mb-4 space-x-3">
        <FiVideo size={32} color="#818cf8" />
        <h1 className="text-2xl font-extrabold tracking-wide text-indigo-400">
          Reel Tracker
        </h1>
      </div>

      <p className="text-center text-lg font-semibold mb-2">
        {count === null ? (
          <span className="italic">Loading...</span>
        ) : (
          <>
            🎥 Reels Watched:{" "}
            <span className="text-indigo-300">{count}</span>
          </>
        )}
      </p>

      {minutes !== null && (
        <p className="text-center text-md font-medium text-indigo-300 mb-1">
          ⏱️ Time Wasted: {minutes} min
        </p>
      )}
    </div>
  )
}

export default IndexPopup
