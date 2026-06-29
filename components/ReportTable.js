import { canDelete, canEdit } from "../utils/permissions.js";
import { escapeHtml, formatDateTime } from "../utils/formatters.js";

export function renderReportTable(rows, role) {
  const adminColumns = canEdit(role) || canDelete(role);
  const showGps = role !== "salesperson";

  if (!rows.length) {
    return `<div class="empty-state">No submissions found.</div>`;
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Date</th>
            <th>Sales Person</th>
            <th>Company</th>
            <th>Type</th>
            <th>Contact</th>
            <th>Outcome</th>
            ${showGps ? "<th>GPS</th>" : ""}
            ${adminColumns ? "<th>Actions</th>" : ""}
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => renderRow(row, role, adminColumns, showGps)).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderRow(row, role, adminColumns, showGps) {
  return `
    <tr>
      <td>${formatDateTime(row.timestamp)}</td>
      <td>${escapeHtml(row.visitDate)}<br><small>${escapeHtml(row.visitTime)}</small></td>
      <td>${escapeHtml(row.salesPersonName)}</td>
      <td><strong>${escapeHtml(row.companyName)}</strong><br><small>${escapeHtml(row.personName)} - ${escapeHtml(row.designation)}</small></td>
      <td>${escapeHtml(row.companyType)}</td>
      <td>${escapeHtml(row.contactNumber)}<br><small>${escapeHtml(row.emailId)}</small></td>
      <td>${escapeHtml(row.meetingOutcome)}<br><small>${escapeHtml(row.description || row.remarks)}</small></td>
      ${showGps ? `<td><a href="${row.mapsLink}" target="_blank" rel="noopener">Open Map</a><br><small>${escapeHtml(row.latitude)}, ${escapeHtml(row.longitude)}</small></td>` : ""}
      ${adminColumns ? `
        <td class="action-cell">
          ${canEdit(role) ? `<button class="mini-button edit" data-edit="${row.id}" type="button">Edit</button>` : ""}
          ${canDelete(role) ? `<button class="mini-button danger" data-delete="${row.id}" type="button">Delete</button>` : ""}
        </td>
      ` : ""}
    </tr>
  `;
}
