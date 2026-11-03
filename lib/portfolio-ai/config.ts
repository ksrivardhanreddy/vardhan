/** Set false and rebuild to disable both the chat UI and its API. */
export const AI_CHAT_ENABLED = true;

export function chatEnabled(environmentSetting?: string): boolean {
  return AI_CHAT_ENABLED && environmentSetting !== "false";
}
