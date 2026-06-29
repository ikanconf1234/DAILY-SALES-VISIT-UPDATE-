import { salesPeople } from "../data/config.js";

export function renderFilters(showPersonFilter = true, selectedPerson = "all") {
  return `
    <div class="filters">
      ${showPersonFilter ? `
        <label>
          <span>Salesperson</span>
          <select id="filterPerson">
            <option value="all" ${selectedPerson === "all" ? "selected" : ""}>All</option>
            ${salesPeople.map((person) => `<option value="${person.id}" ${selectedPerson === person.id ? "selected" : ""}>${person.name}</option>`).join("")}
          </select>
        </label>
      ` : ""}
      <label>
        <span>Date</span>
        <input id="filterDate" type="date">
      </label>
      <label>
        <span>Company</span>
        <input id="filterCompany" type="search" placeholder="Search company">
      </label>
      <button id="clearFiltersButton" class="secondary-button" type="button">Clear Filters</button>
    </div>
  `;
}

export function getFilterValues() {
  return {
    personId: document.querySelector("#filterPerson")?.value || "all",
    date: document.querySelector("#filterDate")?.value || "",
    company: document.querySelector("#filterCompany")?.value.trim().toLowerCase() || ""
  };
}
