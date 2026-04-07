import Fastify from "fastify";
import { registerLlmRoutes } from "./controller/llm.controller";
import { REQUEST_TIMEOUT_MS } from "./service/llm-proxy.service";

export function createApp() {
  const app = Fastify({
    logger: true,
    requestTimeout: REQUEST_TIMEOUT_MS,
  });
  app.get("/health", async () => ({ status: "ok" }));
  registerLlmRoutes(app);
  return app;
}
