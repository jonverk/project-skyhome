import { Hono } from "hono";
import { createRequestHandler } from "react-router";

const app = new Hono<{ Bindings: Env }>();

const api = new Hono<{ Bindings: Env }>();

api.get("/health", (c) => {
	return c.json({
		status: "ok",
		timestamp: new Date().toISOString(),
	});
});

api.all("*", (c) => {
	return c.json({ error: "Not Found" }, 404);
});

app.route("/api", api);

app.get("*", (c) => {
	const requestHandler = createRequestHandler(
		() => import("virtual:react-router/server-build"),
		import.meta.env.MODE,
	);

	return requestHandler(c.req.raw, {
		cloudflare: { env: c.env, ctx: c.executionCtx as unknown as ExecutionContext },
	});
});

export default app;
