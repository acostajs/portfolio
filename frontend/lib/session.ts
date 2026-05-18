const SESSION_KEY = "portfolio_chat_session_id";

export const getSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    // Fallback to crypto.randomUUID() which is widely supported now
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};
