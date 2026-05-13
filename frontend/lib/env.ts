export const isLighthouse =
  typeof navigator !== "undefined" &&
  navigator.userAgent.includes("Chrome-Lighthouse");
