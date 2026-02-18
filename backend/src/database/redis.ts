import { createClient } from "redis";
import type { RedisClientType } from "redis";
import { env } from "../config/env";

export let redisClient: RedisClientType;

export async function connectRedis(): Promise<void> {
    redisClient = createClient({ url: env.REDIS_URL }) as RedisClientType;

    redisClient.on("error", (err: Error) => {
        console.error("❌ Redis error:", err.message);
    });

    redisClient.on("reconnecting", () => {
        console.warn("⚠️  Redis reconnecting...");
    });

    await redisClient.connect();
    console.log("✅ Redis connected");
}

export async function closeRedis(): Promise<void> {
    await redisClient?.quit();
    console.log("🔌 Redis disconnected");
}
