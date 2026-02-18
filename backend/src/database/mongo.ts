import { MongoClient, Db } from "mongodb";
import { env } from "../config/env";

let client: MongoClient;
let db: Db;

export async function connectMongo(): Promise<void> {
    client = new MongoClient(env.MONGO_URI);
    await client.connect();
    db = client.db("gamehub");
    console.log("✅ MongoDB connected");
}

export function getDb(): Db {
    if (!db) throw new Error("MongoDB not connected. Call connectMongo() first.");
    return db;
}

export async function closeMongo(): Promise<void> {
    await client?.close();
    console.log("🔌 MongoDB disconnected");
}
