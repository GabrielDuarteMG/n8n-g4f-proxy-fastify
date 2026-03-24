import ky from "ky";
import type { ChatCompletion, ResponseObject } from "../../types/types";
import { parseToResponse } from "../../utils/Utils";

export const REQUEST_TIMEOUT_MS = 15 * 60 * 1000;

const upstreamKy = ky.create({ timeout: REQUEST_TIMEOUT_MS });

const upstream = process.env.LLM_UPSTREAM!;
const provider = process.env.LLM_PROXY_PROVIDER ?? "";

export function getUpstreamBaseUrl(): string {
  return upstream;
}

export function getProvider(): string {
  return provider;
}

export async function fetchUpstreamModelsRaw(authorization: string | null): Promise<any[]> {
  const data = await upstreamKy
    .get(`${upstream}/backend-api/v2/models`, {
      headers: authorization ? { authorization } : {},
    })
    .json<any[]>();
  return data;
}

export async function fetchProviders(): Promise<unknown> {
  return upstreamKy.get(`${upstream}/v1/providers`).json();
}

export async function proxyChatCompletions(
  authorization: string | null,
  body: Record<string, unknown>
): Promise<Response> {
  return upstreamKy.post(`${upstream}/v1/chat/completions`, {
    json: { ...body, provider },
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      ...(authorization ? { authorization } : {}),
    },
  });
}

export async function postResponsesAsChatCompletion(
  authorization: string | null,
  body: Record<string, unknown>,
  input: unknown
): Promise<ResponseObject> {
  const jsonBody = { ...body, messages: input, provider };
  const upstream_res = await upstreamKy.post<ChatCompletion>(`${upstream}/v1/chat/completions`, {
    json: jsonBody,
    headers: { ...(authorization ? { authorization } : {}) },
  });
  return parseToResponse(await upstream_res.json());
}
