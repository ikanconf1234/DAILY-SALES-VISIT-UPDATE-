import { formatDateTime } from "./formatters.js";

export const reportHeaders = [
  "Timestamp",
  "Date",
  "Time",
  "Sales Person",
  "Email",
  "Company Name",
  "Company Type",
  "Person Name",
  "Designation",
  "Contact Number",
  "Email ID",
  "Meeting Outcome",
  "Description / Details",
  "Remarks",
  "Latitude",
  "Longitude",
  "Google Maps Link"
];

export function exportExcelCsv(rows, filename) {
  const csvRows = rows.map((row) => [
    formatDateTime(row.timestamp),
    row.visitDate,
    row.visitTime,
    row.salesPersonName,
    row.email,
    row.companyName,
    row.companyType,
    row.personName,
    row.designation,
    row.contactNumber,
    row.emailId,
    row.meetingOutcome,
    row.description,
    row.remarks,
    row.latitude,
    row.longitude,
    row.mapsLink
  ]);

  const csv = [reportHeaders, ...csvRows]
    .map((row) => row.map(formatCsvCell).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportPdf() {
  // Browser print can save as PDF. This avoids heavy PDF dependencies.
  window.print();
}

function formatCsvCell(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}
