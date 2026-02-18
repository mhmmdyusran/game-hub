import { io } from "socket.io-client";
import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";
const SOCKET_URL = "http://localhost:3000";

async function testSocket() {
  try {
    const username = `socket_test_${Date.now()}`;
    const password = "password123";

    console.log(`\n🧪 Testing Socket Auth for user: ${username}`);

    // 1. Register to get token
    console.log("👉 Registering...");
    const regRes = await axios.post(`${API_URL}/register`, {
      username,
      password,
    });
    const token = regRes.data.token;
    console.log("✅ Got Token");

    // 2. Connect to Socket
    console.log("👉 Connecting to Socket...");
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log(`✅ Socket Connected! ID: ${socket.id}`);
      socket.disconnect();
      console.log("🎉 Test Passed: Connected and Disconnected.");
      process.exit(0);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connection Error:", err.message);
      process.exit(1);
    });

    // Timeout
    setTimeout(() => {
        console.error("❌ Timeout: Socket did not connect.");
        process.exit(1);
    }, 5000);

  } catch (error: any) {
    console.error("❌ Test Failed:", error.response?.data || error.message);
    process.exit(1);
  }
}

testSocket();
