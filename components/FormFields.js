import { companyTypes, meetingOutcomes, salesPeople } from "../data/config.js";

export function renderSalesVisitForm(person) {
  return `
    <form id="salesVisitForm" class="sales-form" novalidate>
      <div class="field-grid">
        ${lockedEmailInput()}
        ${dateInput("Date", "visitDate", true)}
        ${salesPersonSelect(person)}
        ${textInput("Company Name", "companyName", "text", true, "organization", "span-2")}
        ${selectInput("Company Type", "companyType", companyTypes, true, "span-2")}
        ${textInput("Person Name", "personName", "text", true, "name")}
        ${textInput("Designation", "designation", "text", true)}
        ${textInput("Contact Number", "contactNumber", "tel", true, "tel")}
        ${textInput("Email ID", "emailId", "email", true, "email")}
        ${selectInput("Meeting Outcome", "meetingOutcome", meetingOutcomes, true, "span-2")}
        ${textareaInput("Description / Details", "description", "Provide details related to the selected option above, if applicable.", "span-2")}
        ${textareaInput("Remarks", "remarks", "", "span-2", 3)}
      </div>
      <button id="submitButton" type="submit">Submit</button>
    </form>
  `;
}

function textInput(label, name, type = "text", required = false, autocomplete = "", className = "") {
  return `
    <label class="field ${className}">
      <span>${label}</span>
      <input type="${type}" name="${name}" autocomplete="${autocomplete}" ${required ? "required" : ""}>
    </label>
  `;
}

function lockedEmailInput() {
  return `
    <label class="field">
      <span>Email</span>
      <input type="email" name="email" value="ikanconf@gmail.com" readonly required>
    </label>
  `;
}

function dateInput(label, name, required = false) {
  return `
    <label class="field">
      <span>${label}</span>
      <input type="date" name="${name}" ${required ? "required" : ""}>
    </label>
  `;
}

function salesPersonSelect(person) {
  const options = salesPeople
    .map((salesPerson) => `<option value="${salesPerson.id}" ${salesPerson.id === person.id ? "selected" : ""}>${salesPerson.name}</option>`)
    .join("");

  return `
    <label class="field span-2">
      <span>Sales Person Name</span>
      <select name="salesPersonId" required disabled>${options}</select>
      <input type="hidden" name="salesPersonId" value="${person.id}">
    </label>
  `;
}

function selectInput(label, name, options, required = false, className = "") {
  return `
    <label class="field ${className}">
      <span>${label}</span>
      <select name="${name}" ${required ? "required" : ""}>
        <option value="">Choose ${label.toLowerCase()}</option>
        ${options.map((option) => `<option>${option}</option>`).join("")}
      </select>
    </label>
  `;
}

function textareaInput(label, name, helperText = "", className = "", rows = 4) {
  return `
    <label class="field ${className}">
      <span>${label}</span>
      <textarea name="${name}" rows="${rows}"></textarea>
      ${helperText ? `<small>${helperText}</small>` : ""}
    </label>
  `;
}
