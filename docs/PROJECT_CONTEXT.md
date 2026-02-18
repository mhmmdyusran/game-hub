# ⚠️ PROJECT CONTEXT (GLOBAL REFERENCE)

Dokumen ini adalah **context global proyek Game Hub**.  
Ini bukan task implementasi. AI harus menggunakan context ini sebagai referensi utama.

Project ini adalah **platform multiplayer realtime multi-game**.

Saat ini fokus pengembangan adalah **MVP TicTacToe**.  
Game lain akan ditambahkan di masa depan tanpa mengubah core.

---

# 🎮 PROJECT: GAME HUB

Game Hub adalah platform online multiplayer realtime dengan banyak game dalam satu sistem.

Goal:  
Scalable, modular, realtime, production-ready, mobile-friendly.

Semua game berbagi:

- Auth

- Room

- Realtime

- Chat

- Timer

- Reconnect

- Spectator

- Leaderboard

- Infrastructure

Game aktif:

1. TicTacToe.

Game future:

- SOS.

- Gomoku.

- Connect-style.

- Game lainnya.

Arsitektur harus mendukung penambahan game tanpa refactor besar.

---

# 🔐 AUTH

Simple login:  
Username unik + password.

Tidak perlu security kompleks (internal use).

---

# 🏠 MAIN MENU

Setelah login:

- Play

- Profile

- Leaderboard

---

# 🎮 PLAY MENU

Saat ini hanya menampilkan:

- TicTacToe.

Di masa depan:

- List game akan bertambah.

---

# 🧩 ROOM SYSTEM (GLOBAL)

Room berlaku untuk semua game.

Room memiliki:

- gameType

- mode

- players

- spectators

- state

Meskipun MVP hanya TicTacToe, field gameType tetap ada untuk future.

Create room:

- Name

- Public/private

- Max player 2–8

- Max spectator 0–5

- Board size

- Mode

- Configurable rules.

Lobby:

- Host

- Slot switching

- Realtime.

---

# ⚙️ CONFIGURABLE RULES

Host dapat mengatur:

- Timer

- Win condition

- AFK limit

- Mode

- Karakter pemain

- Board size.

---

# ⚡ REALTIME PRINCIPLES

Server authoritative.

Client hanya UI.

State:  
Memory + Redis.

Persistence:  
MongoDB.

---

# 🔄 RECONNECT

Slot reserved.  
State restore.  
Grace 30–60 detik.  
Auto lose jika tidak kembali.

---

# ⏱ TIMER

Server timestamp.  
Timeout = skip turn.  
AFK counter.

---

# 💬 CHAT

Lobby:  
Persist selama room aktif.

In-game:  
Aktif selama match.  
Dihapus setelah match selesai.

---

# 👁 SPECTATOR ADVANCED

Spectator:

- Realtime.

- Join / leave kapan saja.

- Tidak mempengaruhi match.

---

# 🏆 LEADERBOARD

Global leaderboard.  
Per game leaderboard (future).

---

# 🎯 GAME MODULE SYSTEM

Semua game adalah module.

Saat ini hanya TicTacToe diimplementasikan, tetapi sistem harus siap multi-game.

Setiap game hanya berisi:

- Rules

- Turn logic

- Validation

- Win logic.

Tidak boleh berisi:

- Auth

- Room

- Socket core

- Database.

Core reusable.

---

# 🎯 GAME 1: TIC TAC TOE (MVP)

Mode:  
Casual dan Tournament.

Board:  
3x3 – 15x15.

Win:  
Horizontal, vertical, diagonal.

---

## Casual:

Karakter fleksibel:  
X, O, segitiga, kotak, dll hingga 8 simbol unik sesuai jumlah player.

---

## Tournament:

Single elimination.  
BO5 dan BO7.  
Bracket system.

---

# 🔁 REALTIME FLOW ANTAR GAME

Meskipun MVP hanya TicTacToe, flow realtime harus tetap generic.

Socket event global:

- room:create

- room:join

- match:start

- match:move

- match:update

- match:end.

Saat move:

1. Server membaca room.gameType.

2. Server memilih engine dari registry.

3. Engine:
   
   - Validasi move.
   
   - Update state.
   
   - Check win.

4. Server broadcast.

Contoh:  
engine = gameRegistry[room.gameType].

Hal ini memastikan:

- Sistem siap multi-game.

- Tambah game tanpa ubah socket.

---

# 🔌 GAME MODULE INTERFACE

Semua game harus mengikuti standar:

GameModule:

- init(config)

- createInitialState(players, config)

- validateMove(state, move, player)

- applyMove(state, move, player)

- checkWin(state, move, player)

- checkDraw(state)

- getNextTurn(state)

- serializeState(state)

- deserializeState(data).

Core tidak mengetahui detail game.

---

# 📦 GAME ENGINE REGISTRY

Core memiliki registry:

gameRegistry = {  
tictactoe  
}.

Future:  
Tambahkan:

- sos

- dll.

Saat server start:  
Semua game diregistrasi.

Saat room dibuat:  
engine dipilih berdasarkan gameType.

---

# 🔁 FLOW DATA CORE ↔ GAME

Core:

- Socket

- Room

- Timer

- Reconnect

- Spectator

- Chat.

Game:

- Logic

- State.

Flow:

1. Player join.

2. Core create match.

3. engine.createInitialState().

4. Move:  
   validateMove → applyMove.

5. checkWin / checkDraw.

6. Next turn.

7. Broadcast.

8. Save history.

---

# ⚙️ DOCKER & SCALING

Redis adapter.  
Horizontal scaling.  
Sticky session.  
Nginx.

---

# 🧪 LOCAL DEVELOPMENT

Full realtime local.  
Docker.  
Cluster simulation.

---

# 📌 DEVELOPMENT MINDSET

Incremental.  
Modular.  
Realtime-first.  
Production mindset.

Fokus MVP:  
Stabilitas, fairness, realtime.

Game lain ditambahkan setelah platform stabil.
