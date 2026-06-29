import { renderBanner, renderFooter, renderMessageArea, showMessage } from "../components/Layout.js";
import { renderFilters, getFilterValues } from "../components/Filters.js";
import { renderReportTable } from "../components/ReportTable.js";
import { meetingOutcomes, salesPeople } from "../data/config.js";
import { sampleSubmissions } from "../data/sampleSubmissions.js";
import { getQueryParam } from "../utils/routeUtils.js";
import { canViewReports, getAuthorizedDashboardAccess } from "../utils/permissions.js";
import { deleteSubmission, getSubmissions, restoreSubmissions, updateSubmission } from "../services/storageService.js";
import { exportExcelCsv, exportPdf } from "../utils/exportUtils.js";

const root = document.querySelector("#app");
const access = getAuthorizedDashboardAccess(getQueryParam("role"), getQueryParam("key"), getQueryParam("person"));
const role = access?.role;
const lockedPerson = access?.lockedPerson || "all";
const demoMode = getQueryParam("demo") === "1";
let currentRows = [];

if (!role || !canViewReports(role)) {
  root.innerHTML = `
    ${renderBanner("Dashboard Access", "Reports are available only to admin, boss, and manager links.")}
    <section class="form-card important">
      <h2>Access Locked</h2>
      <p class="muted">Please use an authorized dashboard link.</p>
    </section>
  `;
} else {
  seedDemoDataForAdmin();
  renderDashboard();
}

function seedDemoDataForAdmin() {
  if (role === "admin" && demoMode && getSubmissions().length === 0) {
    restoreSubmissions(sampleSubmissions);
  }
}

function renderDashboard() {
  const title = role === "admin" ? "Admin Dashboard" : `${capitalize(role)} Dashboard`;
  const selectedName = lockedPerson === "all"
    ? "Overall Dashboard"
    : `${salesPeople.find((person) => person.id === lockedPerson)?.name || "Salesperson"} Report`;

  root.innerHTML = `
    ${renderBanner(title, "")}
    <section class="form-card records-card">
      <div class="section-heading compact">
        <h2>${selectedName}</h2>
        ${role === "admin" ? "<p>Admin can edit, delete, filter, print, and export reports.</p>" : ""}
      </div>
      ${renderMessageArea()}
      <div id="editPanel"></div>
      ${renderFilters(lockedPerson === "all", lockedPerson)}
      <div id="summaryArea"></div>
      <div class="manager-actions">
        ${role === "salesperson" ? "" : `
          <button id="exportExcelButton" class="secondary-button" type="button">Export Excel</button>
          <button id="exportPdfButton" class="secondary-button" type="button">Export PDF</button>
        `}
        <button id="printButton" class="secondary-button dark" type="button">Print Report</button>
      </div>
      <div id="reportArea"></div>
    </section>
    ${renderFooter()}
  `;

  wireEvents();
  refreshReport();
}

function wireEvents() {
  document.querySelector("#filterPerson")?.addEventListener("change", refreshReport);
  document.querySelector("#filterDate")?.addEventListener("change", refreshReport);
  document.querySelector("#filterCompany")?.addEventListener("input", refreshReport);
  document.querySelector("#clearFiltersButton").addEventListener("click", () => {
    const personFilter = document.querySelector("#filterPerson");
    const dateFilter = document.querySelector("#filterDate");
    const companyFilter = document.querySelector("#filterCompany");

    if (personFilter) personFilter.value = lockedPerson === "all" ? "all" : lockedPerson;
    dateFilter.value = "";
    companyFilter.value = "";
    refreshReport();
  });

  document.querySelector("#exportExcelButton")?.addEventListener("click", () => exportExcelCsv(currentRows, reportFilename()));
  document.querySelector("#exportPdfButton")?.addEventListener("click", exportPdf);
  document.querySelector("#printButton").addEventListener("click", () => window.print());
}

function refreshReport() {
  const filters = getFilterValues();
  const personFilter = lockedPerson === "all" ? filters.personId : lockedPerson;

  const sourceRows = demoMode && getSubmissions().length === 0 ? sampleSubmissions : getSubmissions();

  currentRows = sourceRows.filter((submission) => {
    const matchesPerson = personFilter === "all" || submission.salesPersonId === personFilter;
    const matchesDate = !filters.date || submission.visitDate === filters.date;
    const matchesCompany = !filters.company || submission.companyName.toLowerCase().includes(filters.company);
    return matchesPerson && matchesDate && matchesCompany;
  });

  document.querySelector("#summaryArea").innerHTML = renderSummaryCards(currentRows);
  document.querySelector("#reportArea").innerHTML = renderReportTable(currentRows, role);
  wireTableActions();
}

function renderSummaryCards(rows) {
  const total = rows.length;
  const leads = countOutcome(rows, "New Lead");
  const followUps = countOutcome(rows, "Follow-up Required");
  const quotations = countOutcome(rows, "Quotation Requested");
  const orders = countOutcome(rows, "Order Received");

  return `
    <section class="summary-grid" aria-label="Executive dashboard summary">
      ${summaryCard("Total Visits", total)}
      ${summaryCard("New Leads", leads)}
      ${summaryCard("Follow-ups", followUps)}
      ${summaryCard("Quotations", quotations)}
      ${summaryCard("Orders", orders)}
    </section>
  `;
}

function summaryCard(label, value) {
  return `
    <article class="summary-card">
      <span>${label}</span>
      <strong>${value}</strong>
    </article>
  `;
}

function countOutcome(rows, outcome) {
  return rows.filter((row) => row.meetingOutcome === outcome).length;
}

function wireTableActions() {
  document.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      if (confirm("Delete this submission?")) {
        deleteSubmission(button.dataset.delete);
        refreshReport();
      }
    });
  });

  document.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      openEditPanel(button.dataset.edit);
    });
  });
}

function openEditPanel(id) {
  const submission = getSubmissions().find((row) => row.id === id);
  const editPanel = document.querySelector("#editPanel");

  if (!submission || !editPanel) {
    showMessage("error", "Unable to open this submission for editing.");
    return;
  }

  editPanel.innerHTML = `
    <form id="adminEditForm" class="edit-panel">
      <div class="section-heading compact">
        <h2>Edit Submission</h2>
        <p>Update the required details and save changes.</p>
      </div>
      <div class="field-grid">
        <label class="field span-2">
          <span>Company Name</span>
          <input name="companyName" value="${escapeAttribute(submission.companyName)}" required>
        </label>
        <label class="field">
          <span>Person Name</span>
          <input name="personName" value="${escapeAttribute(submission.personName)}">
        </label>
        <label class="field">
          <span>Contact Number</span>
          <input name="contactNumber" value="${escapeAttribute(submission.contactNumber)}">
        </label>
        <label class="field">
          <span>Email ID</span>
          <input name="emailId" type="email" value="${escapeAttribute(submission.emailId)}">
        </label>
        <label class="field">
          <span>Meeting Outcome</span>
          <select name="meetingOutcome">
            ${meetingOutcomes.map((outcome) => `<option ${outcome === submission.meetingOutcome ? "selected" : ""}>${outcome}</option>`).join("")}
          </select>
        </label>
        <label class="field span-2">
          <span>Description / Details</span>
          <textarea name="description" rows="3">${escapeText(submission.description)}</textarea>
        </label>
        <label class="field span-2">
          <span>Remarks</span>
          <textarea name="remarks" rows="3">${escapeText(submission.remarks)}</textarea>
        </label>
      </div>
      <div class="edit-actions">
        <button type="submit" class="secondary-button dark">Save Changes</button>
        <button type="button" class="secondary-button" id="cancelEditButton">Cancel</button>
      </div>
    </form>
  `;

  document.querySelector("#adminEditForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    updateSubmission(id, {
      companyName: formData.get("companyName").trim(),
      personName: formData.get("personName").trim(),
      contactNumber: formData.get("contactNumber").trim(),
      emailId: formData.get("emailId").trim(),
      meetingOutcome: formData.get("meetingOutcome"),
      description: formData.get("description").trim(),
      remarks: formData.get("remarks").trim()
    });

    editPanel.innerHTML = "";
    showMessage("success", "Submission updated successfully.");
    refreshReport();
  });

  document.querySelector("#cancelEditButton").addEventListener("click", () => {
    editPanel.innerHTML = "";
  });

  editPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function reportFilename() {
  const person = lockedPerson === "all" ? "all" : lockedPerson;
  return `daily-sales-visit-update-${role}-${person}-${new Date().toISOString().slice(0, 10)}`;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeAttribute(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeText(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
