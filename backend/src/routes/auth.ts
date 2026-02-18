import { FastifyInstance } from "fastify";
import { z } from "zod";
import { User } from "../database/models/user";
import { hashPassword, comparePassword, signToken, verifyToken } from "../utils/auth";

export async function authRoutes(app: FastifyInstance) {
  app.post(
    "/register",
    {
      schema: {
        body: z.object({
          username: z.string().min(3).max(20),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      const { username, password } = request.body as any;

      try {
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
          return reply.status(400).send({ message: "Username already taken" });
        }

        const passwordHash = await hashPassword(password);
        const user = await User.create({ username, passwordHash });

        const token = signToken({ id: user._id?.toString(), username: user.username });

        return reply.send({ token, user: { id: user._id?.toString(), username: user.username } });
      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  );

  app.post(
    "/login",
    {
      schema: {
        body: z.object({
          username: z.string(),
          password: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { username, password } = request.body as any;

      try {
        const user = await User.findByUsername(username);
        if (!user) {
          return reply.status(401).send({ message: "Invalid credentials" });
        }

        const isValid = await comparePassword(password, user.passwordHash);
        if (!isValid) {
          return reply.status(401).send({ message: "Invalid credentials" });
        }

        const token = signToken({ id: user._id?.toString(), username: user.username });

        return reply.send({ token, user: { id: user._id?.toString(), username: user.username } });
      } catch (error) {
         request.log.error(error);
         return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  );
    
  app.get("/me", async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1] ?? "";
    const payload = verifyToken(token);

    if (!payload) {
      return reply.status(401).send({ message: "Invalid token" });
    }

    const user = await User.findById(payload.id);
    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    return reply.send({ user: { id: user._id?.toString(), username: user.username } });
  });
}
