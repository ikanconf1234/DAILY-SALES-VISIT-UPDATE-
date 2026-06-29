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

export function getSubmissionsFromGoogleSheets({ role, key, person }) {
  if (!appSettings.googleSheetsWebAppUrl) {
    return Promise.resolve([]);
  }

  const callbackName = `dsvuSheetsCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const url = new URL(appSettings.googleSheetsWebAppUrl);
  url.searchParams.set("action", "list");
  url.searchParams.set("role", role);
  url.searchParams.set("key", key);
  url.searchParams.set("person", person || "all");
  url.searchParams.set("callback", callbackName);

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("Google Sheets report request timed out."));
    }, 12000);

    function cleanup() {
      window.clearTimeout(timer);
      delete window[callbackName];
      script.remove();
    }

    window[callbackName] = (payload) => {
      cleanup();
      if (payload?.ok) {
        resolve(payload.rows || []);
      } else {
        reject(new Error(payload?.error || "Unable to load Google Sheets report."));
      }
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("Unable to reach Google Sheets report."));
    };

    script.src = url.toString();
    document.body.appendChild(script);
  });
}
