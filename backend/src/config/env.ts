import dotenv from "dotenv";
dotenv.config();

export const env = {
    PORT: Number(process.env["PORT"] ?? 3000),
    MONGO_URI: process.env["MONGO_URI"] ?? "",
    REDIS_URL: process.env["REDIS_URL"] ?? "redis://localhost:6379",
    JWT_SECRET: process.env["JWT_SECRET"] ?? "secret",
    NODE_ENV: process.env["NODE_ENV"] ?? "development",
};
