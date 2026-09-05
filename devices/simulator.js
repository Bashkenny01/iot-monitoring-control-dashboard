// devices/simulator.js
// Simulated IoT devices and simple automation rule engine

const { v4: uuidv4 } = require('uuid');

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function createDevice(id, name, type) {
  return {
    id,
    name,
    type,
    state: Math.random() > 0.5 ? 'on' : 'off',
    readings: {
      temperature: Math.round((20 + rand(-5, 10)) * 10) / 10,
      humidity: Math.round((40 + rand(-20, 30)) * 10) / 10
    },
    history: []
  };
}

function createSimulator() {
  const devices = [
    createDevice('dev-1', 'Living Room Heater', 'actuator'),
    createDevice('dev-2', 'Basement Humidifier', 'actuator'),
    createDevice('dev-3', 'Garden Sprinkler', 'actuator')
  ];

  const rules = []; // in-memory automation rules
  let io = null;

  function setIO(_io) {
    io = _io;
  }

  function getDevices() {
    return devices;
  }

  function getRules() {
    return rules;
  }

  function emit(event, payload) {
    if (io) io.emit(event, payload);
  }

  function toggleDevice(id, forcedState = null) {
    const device = devices.find(d => d.id === id);
    if (!device) return null;
    if (forcedState) device.state = forcedState;
    else device.state = device.state === 'on' ? 'off' : 'on';
    emit('device_update', device);
    emit('notification', { type: 'info', message: `${device.name} turned ${device.state}` });
    return device;
  }

  function addRule(rule) {
    // rule: { watchDeviceId, targetDeviceId, metric, operator, threshold, action, description }
    if (!rule || !rule.watchDeviceId || !rule.targetDeviceId || !rule.metric || !rule.operator || rule.threshold === undefined || !rule.action) {
      throw new Error('Invalid rule format. Required: watchDeviceId, targetDeviceId, metric, operator, threshold, action');
    }
    // verify devices exist
    const watchDevice = devices.find(d => d.id === rule.watchDeviceId);
    const targetDevice = devices.find(d => d.id === rule.targetDeviceId);
    if (!watchDevice) throw new Error('watchDeviceId does not match any device');
    if (!targetDevice) throw new Error('targetDeviceId does not match any device');

    const r = Object.assign({ id: uuidv4(), createdAt: new Date().toISOString() }, rule);
    rules.push(r);
    emit('rule_created', r);
    return r;
  }

  function evaluateRule(r) {
    const watchedDevice = devices.find(d => d.id === r.watchDeviceId);
    if (!watchedDevice) return;
    const value = watchedDevice.readings[r.metric];
    if (value === undefined) return;
    let triggered = false;
    switch (r.operator) {
      case '>': triggered = value > r.threshold; break;
      case '<': triggered = value < r.threshold; break;
      case '>=': triggered = value >= r.threshold; break;
      case '<=': triggered = value <= r.threshold; break;
      case '==': triggered = value == r.threshold; break;
      default: break;
    }
    if (triggered) {
      const target = devices.find(d => d.id === r.targetDeviceId);
      if (target) {
        const desired = r.action === 'on' ? 'on' : 'off';
        if (target.state !== desired) {
          toggleDevice(target.id, desired);
          emit('automation_trigger', { rule: r, value, watchedDevice });
          emit('notification', { type: 'alert', message: `Automation: ${r.description || r.id} triggered (value=${value})` });
        }
      }
    }
  }

  // simulate periodic sensor updates and evaluate all rules each tick
  setInterval(() => {
    devices.forEach(device => {
      // random walk
      device.readings.temperature = Math.round((device.readings.temperature + rand(-0.5, 0.5)) * 10) / 10;
      device.readings.humidity = Math.round((device.readings.humidity + rand(-1, 1)) * 10) / 10;
      // record history (keep last 50 points)
      device.history.push({ t: Date.now(), temperature: device.readings.temperature, humidity: device.readings.humidity });
      if (device.history.length > 50) device.history.shift();
      emit('device_update', device);
      // alerts
      if (device.readings.temperature > 35) {
        emit('notification', { type: 'alert', message: `${device.name} temperature high: ${device.readings.temperature}°C` });
      }
      if (device.readings.humidity > 80) {
        emit('notification', { type: 'alert', message: `${device.name} humidity high: ${device.readings.humidity}%` });
      }
    });

    // evaluate all rules after updating readings
    rules.forEach(r => {
      try {
        evaluateRule(r);
      } catch (e) {
        // swallow rule evaluation errors but emit a notification for visibility
        emit('notification', { type: 'error', message: `Rule eval error: ${e.message}` });
      }
    });
  }, 3000);

  return { setIO, getDevices, toggleDevice, addRule, getRules };
}

module.exports = { createSimulator };
