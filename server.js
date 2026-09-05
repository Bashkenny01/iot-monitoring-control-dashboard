const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const { createSimulator } = require('./devices/simulator');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// API: devices and rules
const simulator = createSimulator();

app.get('/api/devices', (req, res) => {
  res.json(simulator.getDevices());
});

app.post('/api/devices/:id/toggle', (req, res) => {
  const id = req.params.id;
  const device = simulator.toggleDevice(id);
  if (!device) return res.status(404).json({ error: 'Device not found' });
  res.json(device);
});

app.get('/api/rules', (req, res) => {
  res.json(simulator.getRules());
});

app.post('/api/rules', (req, res) => {
  const rule = req.body;
  try {
    const created = simulator.addRule(rule);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Fallback to index.html for SPA-ish behavior
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('Client connected', socket.id);
  // send current devices and rules
  socket.emit('initial_state', { devices: simulator.getDevices(), rules: simulator.getRules() });

  socket.on('toggle', (deviceId) => {
    simulator.toggleDevice(deviceId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

// Connect simulator to socket.io
simulator.setIO(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
