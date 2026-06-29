export function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

export function buildSalespersonFormLink(baseUrl, person) {
  return `${baseUrl}/index.html?person=${person.id}&key=${person.formKey}`;
}

export function buildDashboardLink(baseUrl, role, key, personId = "all") {
  return `${baseUrl}/dashboard.html?role=${role}&key=${key}&person=${personId}`;
}
