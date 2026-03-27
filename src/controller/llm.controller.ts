import type { FastifyInstance } from "fastify";
import {
  fetchProviders,
  fetchUpstreamModelsRaw,
  getProvider,
  getUpstreamBaseUrl,
  postResponsesAsChatCompletion,
  proxyChatCompletions,
} from "../service/llm-proxy.service";
import { shouldEnableWebSearch } from "../utils/web-search.utils";

export function registerLlmRoutes(app: FastifyInstance): void {
  app.get("/v1/models", async (req, reply) => {
    try {
      const auth = (req.headers["authorization"] as string) ?? null;
      console.log(getUpstreamBaseUrl());
      const data = await fetchUpstreamModelsRaw(auth);
      const providerModels = data[getProvider()];

      return reply.send({
        object: "list",
        data: providerModels.map((model: any) => ({
          id: model,
          object: "model",
          created: 0,
          owned_by: "",
          image: model.image || false,
          provider: true,
        })),
      });
    } catch (error) {
      console.error(error);
      return reply.status(200).send({ object: "list", data: [] });
    }
  });

  app.get("/v1/providers", async (_req, reply) => {
    const data = await fetchProviders();
    return reply.send(data);
  });

  app.post("/v1/chat/completions", async (req, reply) => {
    const auth = (req.headers["authorization"] as string) ?? null;
    const requestBody = req.body as Record<string, unknown>;
    const body: Record<string, unknown> = { ...requestBody, provider: getProvider() };

    if (shouldEnableWebSearch(requestBody.messages)) {
      body.web_search = true;
    }

    const upstream_res = await proxyChatCompletions(auth, body as Record<string, unknown>);

    reply.code(upstream_res.status);
    const ct = upstream_res.headers.get("content-type");
    if (ct) reply.header("content-type", ct);

    const { Readable } = await import("stream");
    const nodeStream = Readable.fromWeb(upstream_res.body as any);
    return reply.send(nodeStream);
  });

  app.post("/v1/responses", async (req, reply) => {
    const auth = (req.headers["authorization"] as string) ?? null;
    const requestBody = req.body as Record<string, unknown>;
    const body: Record<string, unknown> = { ...requestBody };

    if (shouldEnableWebSearch(requestBody.input)) {
      body.web_search = true;
    }

    const output = await postResponsesAsChatCompletion(
      auth,
      body,
      requestBody.input
    );
    return reply.send(output);
  });
}
