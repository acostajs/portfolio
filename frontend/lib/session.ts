const SESSION_KEY = "portfolio_chat_session_id";

export const getSessionId = (): string => {
  try {
    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        sessionId = crypto.randomUUID();
      } else {
        // Safe standard UUID v4 fallback
        sessionId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      }
      localStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
  } catch (e) {
    console.error("Local storage or crypto.randomUUID unavailable, generating safe transient session ID:", e);
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
};
