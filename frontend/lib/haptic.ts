/**
 * Triggers a subtle haptic feedback (vibration) on supported devices.
 * @param pattern - Vibration pattern (defaults to 10ms for a subtle tap)
 */
export const hapticFeedback = (pattern: number | number[] = 10) => {
  if (
    typeof window !== "undefined" &&
    "vibrate" in navigator &&
    navigator.vibrate
  ) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Ignore vibration errors (e.g. if blocked by browser policy)
      console.warn("Haptic feedback failed", e);
    }
  }
};
