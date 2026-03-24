// types.ts

export interface ChatCompletion {
    id?: string;
    object?: string;
    created?: number;
    model?: string;
    provider?: string;
    choices?: Choice[];
    usage?: Usage;
    conversation?: Conversation;
  }
  
  interface Choice {
    index?: number;
    message?: Message;
    finish_reason?: string | null;
  }
  
  interface Message {
    role?: string;
    content?: string | null;
    reasoning?: string | null;
    tool_calls?: ToolCall[] | null;
    audio?: unknown | null;
  }
  
  interface ToolCall {
    id?: string;
    function?: {
      name?: string;
      arguments?: string;
    };
  }
  
  interface Usage {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
    prompt_tokens_details?: {
      cached_tokens?: number;
    };
    completion_tokens_details?: {
      reasoning_tokens?: number;
    };
    cache?: unknown | null;
  }
  
  interface Conversation {
    conversation_id?: string;
    message_id?: string;
    finish_reason?: string | null;
    recipient?: string;
    parent_message_id?: string;
    user_id?: string;
    is_thinking?: boolean;
    p?: string;
    thoughts_summary?: string;
    prompt?: unknown | null;
    generated_images?: unknown | null;
    task?: unknown | null;
  }
  
  // --- Response API types ---
  
  export interface ResponseObject {
    id: string;
    object: "response";
    created_at: number;
    status: "completed" | "incomplete" | "in_progress";
    error: null;
    incomplete_details: { reason: string | null } | null;
    instructions: null;
    max_output_tokens: null;
    model: string;
    output: OutputItem[];
    parallel_tool_calls: boolean;
    previous_response_id: string | null;
    reasoning: {
      effort: null;
      summary: string | null;
    };
    store: boolean;
    temperature: number;
    text: { format: { type: "text" } };
    tool_choice: "auto" | "none" | "required";
    tools: unknown[];
    top_p: number;
    truncation: "disabled" | "auto";
    usage: ResponseUsage;
    user: string | null;
    metadata: ResponseMetadata;
  }
  
  type OutputItem = MessageOutput | FunctionCallOutput | AudioOutput;
  
  interface MessageOutput {
    id: string;
    type: "message";
    status: "completed" | "incomplete";
    role: string;
    content: ContentBlock[];
  }
  
  interface FunctionCallOutput {
    type: "function_call";
    id: string;
    call_id: string;
    name: string;
    arguments: string;
  }
  
  interface ContentBlock {
    type: "output_text" | "audio";
    text?: string;
    annotations?: unknown[];
    data?: unknown;
  }
  
  interface AudioOutput {
    type: "audio";
    data: unknown;
  }
  
  interface ResponseUsage {
    input_tokens: number;
    output_tokens: number;
    output_tokens_details: {
      reasoning_tokens: number;
    };
    total_tokens: number;
  }
  
  interface ResponseMetadata {
    conversation_id: string | null;
    provider: string | null;
    is_thinking: boolean;
  }