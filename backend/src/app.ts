import Fastify, { FastifyInstance } from "fastify";
import { Server } from "socket.io";
import { createServer, type Server as HttpServer } from "http";
import { authRoutes } from "./routes/auth";
import { setupSocket } from "./sockets";

export function buildApp() {
    const fastify = Fastify({
        logger: {
            transport: {
                target: "pino-pretty",
                options: { colorize: true },
            },
        },
    });

    // CORS for REST endpoints
    fastify.addHook("onRequest", async (request, reply) => {
        reply.header("Access-Control-Allow-Origin", "http://localhost:5173");
        reply.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        reply.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        if (request.method === "OPTIONS") {
             return reply.status(204).send();
        }
    });

    // Register Auth Routes
    fastify.register(authRoutes, { prefix: "/api/auth" });

    // Health check
    fastify.get("/health", async () => {
        return {
            status: "ok",
            service: "game-hub-backend",
            timestamp: new Date().toISOString(),
        };
    });

    return fastify;
}

export function buildSocketServer(httpServer: HttpServer): Server {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    
    // Setup Socket Logic (Auth, Events)
    setupSocket(io);

    return io;
}
