import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { SocketProvider, useSocket } from "./components/core/SocketProvider";
import { api } from "./services/api";

function App() {
    return (
        <SocketProvider>
            <div className="min-h-screen bg-gray-900 text-white">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </div>
        </SocketProvider>
    );
}

function HomePage() {
    const { isConnected, connect, disconnect } = useSocket();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);

    useEffect(() => {
        if (token && !isConnected) {
            connect(token);
        }
    }, [token, isConnected, connect]);

    const handleLogin = async () => {
        try {
            const res = await api.post("/auth/login", { username, password });
            const newToken = res.data.token;
            setToken(newToken);
            localStorage.setItem("token", newToken);
            addLog("Login success");
            connect(newToken);
        } catch (err: any) {
            addLog(`Login failed: ${err.response?.data?.message}`);
        }
    };

    const handleRegister = async () => {
        try {
            const res = await api.post("/auth/register", { username, password });
            const newToken = res.data.token;
            setToken(newToken);
            localStorage.setItem("token", newToken);
            addLog("Register success");
            connect(newToken);
        } catch (err: any) {
            addLog(`Register failed: ${err.response?.data?.message}`);
        }
    };

    const handleLogout = () => {
        setToken("");
        localStorage.removeItem("token");
        disconnect();
        addLog("Logged out");
    };

    return (
        <div className="flex flex-col items-center p-10 gap-6">
            <h1 className="text-4xl font-bold text-indigo-400">🎮 Game Hub Socket Test</h1>
            
            <div className={`px-4 py-2 rounded-full font-bold ${isConnected ? "bg-green-600" : "bg-red-600"}`}>
                {isConnected ? "Connected 🟢" : "Disconnected 🔴"}
            </div>

            {!token ? (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm space-y-4">
                    <input 
                        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                        placeholder="Username" 
                        value={username} onChange={e => setUsername(e.target.value)} 
                    />
                    <input 
                        className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                        type="password"
                        placeholder="Password" 
                        value={password} onChange={e => setPassword(e.target.value)} 
                    />
                    <div className="flex gap-2">
                        <button onClick={handleLogin} className="flex-1 bg-blue-600 py-2 rounded hover:bg-blue-700">Login</button>
                        <button onClick={handleRegister} className="flex-1 bg-purple-600 py-2 rounded hover:bg-purple-700">Register</button>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-800 p-6 rounded-lg w-full max-w-sm text-center">
                    <p className="mb-4 text-gray-300">Logged in with token</p>
                    <button onClick={handleLogout} className="bg-red-600 px-6 py-2 rounded hover:bg-red-700">Logout</button>
                </div>
            )}

            <div className="w-full max-w-lg bg-black p-4 rounded h-64 overflow-y-auto border border-gray-700 font-mono text-xs">
                {logs.map((log, i) => <div key={i}>{log}</div>)}
            </div>
        </div>
    );
}

export default App;
