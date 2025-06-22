const { defineManifest } = require("plasmo")

module.exports = defineManifest(() => ({
  manifest_version: 3,
  name: "Reel Fiend",
  version: "1.0",
  action: {
    default_popup: "popup.html"
  },
  content_scripts: [
    {
      matches: ["https://www.instagram.com/*"],
      js: ["content.ts"]
    }
  ],
  background: {
    service_worker: "background.ts"
  },
  permissions: [],
  web_accessible_resources: [
    {
      resources: [
        "job-application-job.png",
        "jobApplication.png",
        "job.html"
      ],
      matches: ["<all_urls>"]
    }
  ]
}))
