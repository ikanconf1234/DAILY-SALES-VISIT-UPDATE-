// Main application settings.
// 1. Add or remove a salesperson here. The id is used in private links.
// Example private form link: /index.html?person=adil&key=adil2026
export const salesPeople = [
  { id: "adil", name: "Adil", formKey: "adil2026" },
  { id: "jenny", name: "Jenny", formKey: "jenny2026" },
  { id: "essam", name: "Essam", formKey: "essam2026" },
  { id: "ajay", name: "Ajay", formKey: "ajay2026" }
];

// 2. Role links use these keys in the URL.
// For real production privacy, replace this with server-side login/authentication.
export const roleAccessKeys = {
  admin: "admin2026",
  manager: "manager2026",
  boss: "boss2026"
};

// 3. Add, remove, or rename dropdown options here.
export const companyTypes = [
  "Client / Owner",
  "Consultant",
  "Main Contractor",
  "Sub-Contractor",
  "Developer",
  "Project Management Consultant (PMC)",
  "Fit-Out Contractor",
  "Marble Factory",
  "Stone Factory",
  "Tile Factory",
  "Fabricator",
  "Applicator / Installer",
  "Building Materials Supplier",
  "Building Materials Trading Company",
  "Waterproofing Contractor",
  "Flooring Contractor",
  "Landscape Contractor",
  "Facility Management Company"
];

export const meetingOutcomes = [
  "New Lead",
  "Follow-up Required",
  "Sample Requested",
  "Quotation Requested",
  "Technical Discussion",
  "LPO Expected",
  "Order Received",
  "N/A",
  "Other"
];

// 4. Theme, logo, and banner customization.
// Change bannerImageUrl to your own company/construction image when hosting.
export const appSettings = {
  appName: "Daily Sales Visit Update",
  formTitle: "DAILY SALES VISIT UPDATE",
  quote: "Building Relationships. Delivering Solutions. Driving Growth.",
  logoUrl: "assets/ikan-logo.png",
  bannerImageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
  companyName: "IKAN",
  address: "P.O. BOX 18083, DUBAI, UAE",
  contactEmail: "info@ikaninc.com",
  contactPhone: "+971 4 3285454",
  fax: "+971 4 3285335",
  website: "www.ikaninc.com",
  googleSheetsWebAppUrl: "https://script.google.com/macros/s/AKfycbz1cpXugyGuDQxaJaxdnQQgyVcRnaKLZjrPfj-g9jtMDHP9WeSItqSu6p81rCk85_61/exec"
};

export const storageKeys = {
  allSubmissions: "dsvu_all_submissions_v1"
};
