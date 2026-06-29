import { storageKeys } from "../data/config.js";

// Local browser database for the prototype.
// Back up data by exporting reports, or copy this localStorage key from browser dev tools.
export function getSubmissions() {
  try {
    return JSON.parse(localStorage.getItem(storageKeys.allSubmissions)) || [];
  } catch {
    return [];
  }
}

export function saveSubmission(submission) {
  const submissions = getSubmissions();
  submissions.unshift(submission);
  localStorage.setItem(storageKeys.allSubmissions, JSON.stringify(submissions));
}

export function updateSubmission(id, patch) {
  const submissions = getSubmissions().map((submission) =>
    submission.id === id ? { ...submission, ...patch, updatedAt: new Date().toISOString() } : submission
  );
  localStorage.setItem(storageKeys.allSubmissions, JSON.stringify(submissions));
}

export function deleteSubmission(id) {
  const submissions = getSubmissions().filter((submission) => submission.id !== id);
  localStorage.setItem(storageKeys.allSubmissions, JSON.stringify(submissions));
}

export function getSubmissionsByPerson(personId) {
  return getSubmissions().filter((submission) => submission.salesPersonId === personId);
}

export function restoreSubmissions(submissions) {
  localStorage.setItem(storageKeys.allSubmissions, JSON.stringify(submissions));
}
