import { appSettings } from "../data/config.js";

// Google Sheets connection:
// 1. Create a Google Sheet.
// 2. Open Extensions > Apps Script.
// 3. Paste google-apps-script.gs from this project.
// 4. Deploy as Web App.
// 5. Paste the Web App URL into appSettings.googleSheetsWebAppUrl.
export async function sendSubmissionToGoogleSheets(submission) {
  if (!appSettings.googleSheetsWebAppUrl) {
    return { skipped: true };
  }

  return fetch(appSettings.googleSheetsWebAppUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(submission)
  });
}
