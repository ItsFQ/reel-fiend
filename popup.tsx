import React, { useEffect } from "react";

function IndexPopup() {
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      // if (tabId != null) {
      //   chrome.tabs.sendMessage(tabId, { type: "GET_COUNT" }, (response) => {
      //     console.log("Number of unique reels viewed:", response);
      //   });
      // }
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">Tracking Reels...</h1>
    </div>
  );
}

export default IndexPopup;
