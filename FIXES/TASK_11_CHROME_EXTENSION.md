# TASK 11 — Chrome Extension MVP

**Priority:** 🟢 Low — Post-Launch Growth Feature  
**Estimated Time:** 1–2 weeks  
**Status:** Open — Do After Launch Stabilizes

---

## Overview

A Manifest V3 Chrome extension that:
1. Detects job listings on LinkedIn, Indeed, Glassdoor, and other job boards
2. Captures the job description with one click
3. Sends it to the existing `POST /api/v1/jobs/resume/:resumeId/ats-score` endpoint
4. Shows a popup with the ATS score + missing keywords
5. Provides a "Generate Cover Letter" button that opens the CareerForge web app pre-filled with the job description

---

## Why Post-Launch

- The extension needs the web product to be proven stable first
- Any breaking API changes will break the extension for all users
- Chrome Web Store review takes 1–7 days — submit after core product is stable
- Extension amplifies an existing product; it doesn't replace a broken one

---

## Technical Architecture

### Manifest V3 Structure

```
chrome-extension/
  manifest.json
  background/
    service-worker.js     — handles API calls (not allowed in content scripts)
  content/
    content-script.js     — reads job descriptions from page DOM
    styles.css
  popup/
    popup.html
    popup.js
    popup.css
  icons/
    16.png, 48.png, 128.png
```

### `manifest.json`

```json
{
  "manifest_version": 3,
  "name": "CareerForge AI",
  "version": "1.0.0",
  "description": "Instantly score any job against your resume and generate a cover letter",
  "permissions": ["activeTab", "storage", "identity"],
  "host_permissions": [
    "https://www.linkedin.com/*",
    "https://www.indeed.com/*",
    "https://www.glassdoor.com/*"
  ],
  "background": {
    "service_worker": "background/service-worker.js"
  },
  "content_scripts": [{
    "matches": ["https://www.linkedin.com/jobs/*", "https://www.indeed.com/viewjob*"],
    "js": ["content/content-script.js"]
  }],
  "action": {
    "default_popup": "popup/popup.html",
    "default_icon": "icons/48.png"
  }
}
```

### Content Script — Job Description Extraction

```js
// content/content-script.js

function extractJobDescription() {
  // LinkedIn
  const linkedInDesc = document.querySelector('.jobs-description__content');
  if (linkedInDesc) return linkedInDesc.innerText;

  // Indeed
  const indeedDesc = document.querySelector('#jobDescriptionText');
  if (indeedDesc) return indeedDesc.innerText;

  // Generic fallback — largest text block on page
  const allElements = Array.from(document.querySelectorAll('div, section, article'));
  return allElements
    .sort((a, b) => b.innerText.length - a.innerText.length)[0]
    ?.innerText ?? '';
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_JOB_DESCRIPTION') {
    sendResponse({ jobDescription: extractJobDescription() });
  }
});
```

### Popup Flow

```
[Popup Opens]
    ↓
Is user logged in? (check stored JWT)
    ↓ Yes
Which resume? (dropdown from GET /resumes)
    ↓ User selects
[Analyze] button
    ↓
Content script extracts job description
    ↓
POST /jobs/resume/:resumeId/ats-score
    ↓
Show score: 72/100
Missing keywords: [Python] [Docker] [AWS]
    ↓
[Generate Cover Letter →] → opens careerforge.ai/cover-letters/new?jd=...
```

### Authentication

Store the JWT access token in `chrome.storage.local` after user logs in via the extension's login flow (or via the web app with a `postMessage` to the extension).

---

## API Endpoints Used

| Action | Endpoint |
|---|---|
| List user's resumes | `GET /api/v1/resumes` |
| Run ATS score | `POST /api/v1/jobs/resume/:id/ats-score` |
| Poll job status | `GET /api/v1/jobs/:jobId` |
| (Redirect) Generate cover letter | Opens web app with `?jd=` query param |

---

## Development Setup

```bash
# Load unpacked extension in Chrome
# Go to chrome://extensions → Enable Developer Mode → Load Unpacked → select chrome-extension/
```

---

## Chrome Web Store Submission Checklist

- [ ] All permissions justified in store listing
- [ ] Privacy policy URL (required for `identity` permission)
- [ ] Screenshots of popup in action
- [ ] Icon assets: 16x16, 48x48, 128x128 PNG
- [ ] No remote code execution (Manifest V3 requirement)
- [ ] Review time: 1–7 days
