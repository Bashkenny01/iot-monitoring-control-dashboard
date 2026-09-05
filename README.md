# IoT Monitoring & Control Dashboard

A full-stack IoT monitoring and control dashboard for remotely monitoring connected devices in real time.

Important: This project uses simulated IoT devices and simulated sensor data — no physical hardware is required to run or demo the application. The architecture is designed so real hardware/device integrations can be added later (device adapters, MQTT/HTTP bridges, or cloud IoT connectors).

## Key Features
- Real-time device monitoring (simulated)
- Remote device control (simulated)
- Live device status updates via Socket.IO
- Sensor data (temperature, humidity) simulation
- Alerts and notifications (simulated thresholds)
- Automation rules (monitor one device, act on another)
- Responsive web dashboard

## Technology Stack
- Language: JavaScript (Node.js)
- Backend: Express.js + Socket.IO
- Frontend: Plain HTML/CSS/JavaScript (responsive)
- Simulation: in-memory simulated devices and rule engine

## Project structure (top-level)
- server.js             — Express + Socket.IO server entrypoint
- package.json          — project manifest (dependencies & scripts)
- devices/              — device simulator and automation engine
  - simulator.js
- public/               — frontend assets (index.html, app.js, style.css)
- README.md

## Running locally (simulated)
These instructions start a simulated, local-only version of the dashboard — no physical hardware is required.

1. Install dependencies
```bash
npm install
```

2. Start the server
```bash
npm start
```

3. Open the dashboard
Visit http://localhost:3000 in your browser.

Notes
- The current implementation uses simulated device data only. Hardware integration is not included in this version.
- The architecture (server, device simulator, Socket.IO events) is intentionally structured so you can later replace or augment the simulated devices with real hardware integrations (MQTT clients, serial adapters, cloud device bridges).
- For development with automatic restarts:
```bash
npm run dev
```

Author: Bashkenny01
