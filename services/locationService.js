import { makeMapsLink } from "../utils/formatters.js";

// GPS is requested only when the salesperson submits.
// The form does not display GPS details; dashboards show it to admin/manager/boss.
export function captureLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Location capture is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude.toFixed(7);
        const longitude = position.coords.longitude.toFixed(7);

        resolve({
          latitude,
          longitude,
          mapsLink: makeMapsLink(latitude, longitude),
          capturedAt: new Date().toISOString()
        });
      },
      reject,
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  });
}
