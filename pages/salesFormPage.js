import { renderBanner, renderFooter, renderMessageArea, showMessage } from "../components/Layout.js";
import { renderSalesVisitForm } from "../components/FormFields.js";
import { getSalesPersonByLink } from "../utils/permissions.js";
import { getQueryParam } from "../utils/routeUtils.js";
import { captureLocation } from "../services/locationService.js";
import { saveSubmission } from "../services/storageService.js";
import { sendSubmissionToGoogleSheets } from "../services/googleSheetsService.js";

const root = document.querySelector("#app");
const person = getSalesPersonByLink(getQueryParam("person"), getQueryParam("key"));

if (!person) {
  root.innerHTML = `
    ${renderBanner("Private Sales Link", "This form is available only from an assigned salesperson link.")}
    <section class="form-card important">
      <h2>Access Locked</h2>
      <p class="muted">Please use your private sales form link.</p>
    </section>
  `;
} else {
  renderPage();
}

function renderPage() {
  root.innerHTML = `
    ${renderBanner()}
    <section class="form-card important">
      <div class="section-heading">
        <h2>Visit Details</h2>
        <p>Complete the visit update below and submit.</p>
      </div>
      ${renderMessageArea()}
      ${renderSalesVisitForm(person)}
    </section>
    ${renderFooter()}
  `;

  const form = document.querySelector("#salesVisitForm");
  const dateField = form.querySelector('[name="visitDate"]');
  const submitButton = document.querySelector("#submitButton");
  dateField.valueAsDate = new Date();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    try {
      const location = await captureLocation();
      const formData = new FormData(form);
      const now = new Date();

      const submission = {
        id: crypto.randomUUID(),
        timestamp: now.toISOString(),
        visitDate: formData.get("visitDate"),
        visitTime: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        salesPersonId: person.id,
        salesPersonName: person.name,
        email: formData.get("email").trim(),
        companyName: formData.get("companyName").trim(),
        companyType: formData.get("companyType"),
        personName: formData.get("personName").trim(),
        designation: formData.get("designation").trim(),
        contactNumber: formData.get("contactNumber").trim(),
        emailId: formData.get("emailId").trim(),
        meetingOutcome: formData.get("meetingOutcome"),
        description: formData.get("description").trim(),
        remarks: formData.get("remarks").trim(),
        latitude: location.latitude,
        longitude: location.longitude,
        mapsLink: location.mapsLink,
        locationCapturedAt: location.capturedAt
      };

      saveSubmission(submission);
      await sendSubmissionToGoogleSheets(submission);
      form.reset();
      dateField.valueAsDate = new Date();
      showMessage("success", "Thank you. Your sales visit update has been submitted successfully.");
    } catch (error) {
      if (error.code === error.PERMISSION_DENIED) {
        showMessage("error", "Location permission is required to submit this sales visit.");
      } else {
        showMessage("error", "Unable to submit. Please allow location permission and try again.");
      }
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Submit";
    }
  });
}
