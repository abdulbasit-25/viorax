# Signal Room

**Live browser-to-browser screen sharing. No accounts, no downloads, no signal lost.**

🔗 **Live app:** [viorax.vercel.app](https://viorax.vercel.app)

Open a frequency, share the code, go live. Signal Room is a frontend-only, peer-to-peer screen sharing tool — tune in on a 6-character room code from any device and watch, or broadcast your screen to anyone who joins.

## Features

- 📡 **No accounts** — open a frequency and start broadcasting immediately
- 🔢 **Frequency-style room codes** — simple 6-character codes instead of links or logins
- 🔗 **Peer-to-peer** — direct WebRTC connection between devices, nothing recorded or stored on a server
- 👥 **Multi-viewer** — one host can broadcast to multiple connected viewers
- 📷 **QR join** — scan a code on mobile instead of typing it in
- 📱 **Responsive** — desktop hosting, with a touch-friendly join flow on mobile

## Tech stack

- [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [TanStack Router](https://tanstack.com/router) (file-based routing, SSR shell)
- [TanStack Query](https://tanstack.com/query) for data/query state
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Vite](https://vitejs.dev) for the build tooling
- WebRTC for peer-to-peer screen/video streaming
- [Bun](https://bun.sh) as the primary package manager/runtime

## Getting started

### Prerequisites

- [Bun](https://bun.sh) installed (or Node.js + npm as a fallback)

### Install

```bash
bun install
# or
npm install
```

### Run the dev server

```bash
bun dev
# or
npm run dev
```

### Build for production

```bash
bun run build
# or
npm run build
```

> Exact script names follow whatever is defined in `package.json` — check there if a command above doesn't match.

## Project structure

```
src/
  routes/
    __root.tsx      # Root layout: header, footer, nav, error/404 boundaries
    index.tsx       # Landing page — open a frequency / tune in
    about.tsx       # About the project and creator
    help.tsx        # How-to guide for hosts and viewers
  components/
    DeviceSchematic # Animated device/connection illustration
    Waveform        # Idle/active waveform indicator
    QrScanner       # Mobile QR code scanner for joining a room
  lib/
    roomCode        # Room code generation + normalization
public/
  og-image.png       # Social preview image
```

## Routes

| Path     | Purpose                                     |
| -------- | ------------------------------------------- |
| `/`      | Open a frequency (host) or tune in (viewer) |
| `/about` | About the project and its creator           |
| `/help`  | Step-by-step guide for hosts and viewers    |

## How it works

1. A host opens a frequency, which generates a 6-character room code.
2. The host shares that code (or a QR code) with viewers.
3. Viewers enter the code — or scan it on mobile — to tune in.
4. Once connected, the host's screen streams directly to viewers over a peer-to-peer WebRTC connection.

## Credits

Built by **Abdul Basit** ([Archer](https://abdulbasit-archer.vercel.app/)).

## License

No license has been specified for this repository yet. Add a `LICENSE` file if you want to make the terms explicit for other contributors or users.
