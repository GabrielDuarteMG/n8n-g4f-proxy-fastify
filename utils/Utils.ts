// parseToResponse.ts

import { ChatCompletion, ResponseObject } from "../types/types";


const now = (): number => Math.floor(Date.now() / 1000);

const genId = (prefix: string): string =>
  `${prefix}_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;

const resolveStatus = (
  finishReason?: string | null,
): "completed" | "incomplete" | "in_progress" => {
  if (finishReason === "length") return "incomplete";
  return "completed";
};

export function parseToResponse(completion: ChatCompletion): ResponseObject {
  const choice = completion.choices?.[0];
  const message = choice?.message ?? {};
  const usage = completion.usage ?? {};
  const conv = completion.conversation ?? {};

  // --- Content blocks ---
  const contentBlocks: ResponseObject["output"][number] extends {
    content: infer C;
  }
    ? C
    : never[] = [];

  if (message.content) {
    (
      contentBlocks as Array<{
        type: string;
        text: string;
        annotations: unknown[];
      }>
    ).push({
      type: "output_text",
      text: message.content,
      annotations: [],
    });
  }

  if (message.audio) {
    (contentBlocks as Array<{ type: string; data: unknown }>).push({
      type: "audio",
      data: message.audio,
    });
  }

  // --- Output items ---
  const outputItems: ResponseObject["output"] = [];

  if (contentBlocks.length > 0) {
    outputItems.push({
      id: conv.message_id
        ? `msg_${conv.message_id.replace(/-/g, "")}`
        : genId("msg"),
      type: "message",
      status:
        resolveStatus(choice?.finish_reason) === "completed"
          ? "completed"
          : "incomplete",
      role: message.role ?? "assistant",
      content: contentBlocks as {
        type: "output_text" | "audio";
        text?: string;
        annotations?: unknown[];
        data?: unknown;
      }[],
    });
  }

  // Tool calls como items separados
  if (message.tool_calls?.length) {
    for (const tc of message.tool_calls) {
      const callId = tc.id ?? genId("fc");
      outputItems.push({
        type: "function_call",
        id: callId,
        call_id: callId,
        name: tc.function?.name ?? "",
        arguments: tc.function?.arguments ?? "{}",
      });
    }
  }

  // --- Status geral ---
  const finishReason = choice?.finish_reason ?? conv.finish_reason;
  const status = resolveStatus(finishReason);

  return {
    id: completion.id
      ? completion.id.replace("chatcmpl-", "resp_")
      : genId("resp"),
    object: "response",
    created_at: completion.created ?? now(),
    status,
    error: null,
    incomplete_details:
      status === "incomplete" ? { reason: finishReason ?? null } : null,
    instructions: null,
    max_output_tokens: null,
    model: completion.model ?? "unknown",
    output: outputItems,
    parallel_tool_calls: true,
    previous_response_id: conv.parent_message_id
      ? `resp_${conv.parent_message_id.replace(/-/g, "")}`
      : null,
    reasoning: {
      effort: null,
      summary: conv.thoughts_summary || null,
    },
    store: true,
    temperature: 1.0,
    text: { format: { type: "text" } },
    tool_choice: "auto",
    tools: [],
    top_p: 1.0,
    truncation: "disabled",
    usage: {
      input_tokens: usage.prompt_tokens ?? 0,
      output_tokens: usage.completion_tokens ?? 0,
      output_tokens_details: {
        reasoning_tokens:
          usage.completion_tokens_details?.reasoning_tokens ?? 0,
      },
      total_tokens: usage.total_tokens ?? 0,
    },
    user: conv.user_id ?? null,
    metadata: {
      conversation_id: conv.conversation_id ?? null,
      provider: completion.provider ?? null,
      is_thinking: conv.is_thinking ?? false,
    },
  };
}
