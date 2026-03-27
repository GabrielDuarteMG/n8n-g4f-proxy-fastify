import {
  WEB_SEARCH_INTENT_PATTERNS,
  WebSearchIntent,
} from "../constants/web-search-intent";

function extractMessageText(content: unknown): string {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";

  return content
    .map((part) => {
      if (typeof part === "string") return part;
      if (!part || typeof part !== "object") return "";
      const maybeText = (part as { text?: unknown }).text;
      return typeof maybeText === "string" ? maybeText : "";
    })
    .join(" ");
}

/** Última mensagem do usuário: suporta chat (messages[]) ou responses (string ou itens com role). */
export function getLastUserMessageText(messagesOrInput: unknown): string {
  if (typeof messagesOrInput === "string") {
    return messagesOrInput.trim();
  }
  if (!Array.isArray(messagesOrInput)) return "";

  for (let i = messagesOrInput.length - 1; i >= 0; i -= 1) {
    const message = messagesOrInput[i] as { role?: unknown; content?: unknown };
    if (message?.role !== "user") continue;
    return extractMessageText(message.content).trim();
  }

  return "";
}

export function shouldEnableWebSearch(messagesOrInput: unknown): boolean {
  const text = getLastUserMessageText(messagesOrInput);
  if (text.length < WebSearchIntent.MinTextLength) return false;

  return WEB_SEARCH_INTENT_PATTERNS.some((re) => re.test(text));
}
