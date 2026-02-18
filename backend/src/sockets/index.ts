import { Server, Socket } from "socket.io";
import { verifyToken } from "../utils/auth";
import { User } from "../database/models/user";

interface AuthSocket extends Socket {
  user?: {
    id: string;
    username: string;
  };
}

export function setupSocket(io: Server) {
  // Middleware: Authenticate Socket Connection
  io.use(async (socket: AuthSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const payload = verifyToken(token);
    if (!payload) {
      return next(new Error("Authentication error: Invalid token"));
    }

    try {
      const user = await User.findById(payload.id);
      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      // Attach user to socket
      socket.user = {
        id: user._id!.toString(),
        username: user.username,
      };
      
      next();
    } catch (error) {
      next(new Error("Authentication error: Internal Error"));
    }
  });

  io.on("connection", (socket: AuthSocket) => {
    if (!socket.user) return; // Should not happen due to middleware

    console.log(`🔌 Client connected: ${socket.id} (User: ${socket.user.username})`);

    socket.emit("welcome", { message: `Welcome ${socket.user.username}!` });

    socket.on("disconnect", (reason) => {
      console.log(`❌ Client disconnected: ${socket.id} (User: ${socket.user?.username}) - ${reason}`);
    });
  });
}
