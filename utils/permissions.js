import { roleAccessKeys, salesPeople } from "../data/config.js";

export function getSalesPersonByLink(personId, key) {
  return salesPeople.find((person) => person.id === personId && person.formKey === key) || null;
}

export function getAuthorizedRole(role, key) {
  if (roleAccessKeys[role] === key) {
    return role;
  }

  return null;
}

export function getAuthorizedDashboardAccess(role, key, personId) {
  const dashboardRole = getAuthorizedRole(role, key);

  if (dashboardRole) {
    return { role: dashboardRole, lockedPerson: personId || "all" };
  }

  if (role === "salesperson") {
    const person = getSalesPersonByLink(personId, key);

    if (person) {
      return { role: "salesperson", lockedPerson: person.id };
    }
  }

  return null;
}

export function canEdit(role) {
  return role === "admin";
}

export function canDelete(role) {
  return role === "admin";
}

export function canViewReports(role) {
  return ["admin", "manager", "boss", "salesperson"].includes(role);
}
