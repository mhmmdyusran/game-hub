import { createServer } from "http";
import { buildApp, buildSocketServer } from "./app";
import { connectMongo } from "./database/mongo";
import { connectRedis } from "./database/redis";
import { env } from "./config/env";

async function main() {
    console.log("🎮 Game Hub — Starting server...\n");

    // Connect databases
    await connectMongo();
    await connectRedis();

    // Build Fastify app
    const fastify = buildApp();
    await fastify.ready();

    // Wrap with raw HTTP server for Socket.io
    const httpServer = createServer(fastify.server);
    const io = buildSocketServer(httpServer);

    // Start listening
    httpServer.listen(env.PORT, () => {
        console.log(`\n🚀 Server running on http://localhost:${env.PORT}`);
        console.log(`📡 Socket.io ready`);
        console.log(`🌍 Environment: ${env.NODE_ENV}\n`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
        console.log(`\n⚠️  Received ${signal}. Shutting down...`);
        httpServer.close();
        await fastify.close();
        process.exit(0);
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((err: unknown) => {
    console.error("💥 Fatal error:", err);
    process.exit(1);
});
