import { appSettings } from "../data/config.js";

export function renderBanner(label = appSettings.appName, subtitle = appSettings.quote) {
  return `
    <section class="hero" style="--banner-image: url('${appSettings.bannerImageUrl}')">
      <div class="hero-overlay">
        <div class="hero-copy">
          <h1>${appSettings.formTitle}</h1>
          ${subtitle ? `<p class="quote">${subtitle}</p>` : ""}
        </div>
        <img class="hero-logo" src="${appSettings.logoUrl}" alt="${appSettings.companyName} logo">
      </div>
    </section>
  `;
}

export function renderFooter() {
  return `
    <footer class="app-footer">
      <span>${appSettings.companyName}</span>
      <span>${appSettings.address}</span>
      <span>T ${appSettings.contactPhone}</span>
      <span>F ${appSettings.fax}</span>
      <span>E ${appSettings.contactEmail}</span>
      <span>${appSettings.website}</span>
    </footer>
  `;
}

export function renderMessageArea() {
  return `
    <div id="successMessage" class="message success" role="status" hidden></div>
    <div id="errorMessage" class="message error" role="alert" hidden></div>
  `;
}

export function showMessage(type, message) {
  const successMessage = document.querySelector("#successMessage");
  const errorMessage = document.querySelector("#errorMessage");

  if (successMessage) successMessage.hidden = true;
  if (errorMessage) errorMessage.hidden = true;

  const target = type === "success" ? successMessage : errorMessage;
  if (target) {
    target.textContent = message;
    target.hidden = false;
  }
}
