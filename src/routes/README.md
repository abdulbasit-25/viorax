# 📡 Signal Room

**Live browser-to-browser screen sharing. No accounts. No downloads. Just connect and share.**

🌐 **Live Demo:** https://Signal Room.vercel.app

Signal Room is a lightweight, frontend-only screen sharing application that lets anyone broadcast their screen instantly using a simple 6-character room code. Built on WebRTC, all streaming happens directly between peers, meaning no recordings, no stored video, and no unnecessary accounts.

---

## ✨ Features

- 📡 **Instant Broadcasting** — Start sharing your screen in seconds.
- 🔢 **6-Character Room Codes** — Easy-to-share frequency-style codes.
- 🔒 **Peer-to-Peer Streaming** — Direct WebRTC connections with no video stored on a server.
- 👥 **Multi-Viewer Support** — Broadcast to multiple viewers simultaneously.
- 📱 **QR Code Joining** — Scan and join instantly from a mobile device.
- 💻 **Fully Responsive** — Optimized for desktop hosts and mobile viewers.
- ⚡ **No Accounts Required** — Open a room and start immediately.

---

## 🚀 Tech Stack

- **React**
- **TypeScript**
- **TanStack Router**
- **TanStack Query**
- **Tailwind CSS**
- **Vite**
- **WebRTC**
- **Bun** (Primary runtime & package manager)

---

## 📦 Installation

### Prerequisites

- Bun (recommended)
- or Node.js with npm

### Install Dependencies

```bash
bun install

# or

npm install
```

### Start Development Server

```bash
bun dev

# or

npm run dev
```

### Build for Production

```bash
bun run build

# or

npm run build
```

---

## 📁 Project Structure

```
src/
│
├── routes/
│   ├── __root.tsx
│   ├── index.tsx
│   ├── about.tsx
│   └── help.tsx
│
├── components/
│   ├── DeviceSchematic
│   ├── Waveform
│   └── QrScanner
│
├── lib/
│   └── roomCode
│
public/
└── og-image.png
```

---

## 📍 Routes

| Route    | Description                      |
| -------- | -------------------------------- |
| `/`      | Create or join a Signal Room     |
| `/about` | About the project and creator    |
| `/help`  | User guide for hosts and viewers |

---

## ⚙️ How It Works

1. Create a new Signal Room.
2. Receive a unique 6-character room code.
3. Share the code or QR code with others.
4. Viewers join using the code or by scanning the QR code.
5. Once connected, your screen streams directly through WebRTC with no intermediary video storage.

---

## 🔒 Privacy

Signal Room is built around peer-to-peer communication.

- No user accounts
- No uploaded recordings
- No cloud video storage
- Direct WebRTC connections between participants

---

## 🌐 Live Demo

https://Signal Room.vercel.app

---

## 👨‍💻 Author

**Abdul Basit (Archer)**

Portfolio: https://abdulbasit-archer.vercel.app

---

## 📄 License

This project currently has no license.

If you plan to allow others to use, modify, or contribute to the project, consider adding an MIT License or another open-source license.
