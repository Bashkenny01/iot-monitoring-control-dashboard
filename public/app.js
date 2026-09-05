// public/app.js
const socket = io();
let devices = [];
let rules = [];

function el(tag, cls, text){ const e = document.createElement(tag); if(cls) e.className = cls; if(text!==undefined) e.textContent = text; return e; }

async function fetchDevicesAndRules(){
  const res = await fetch('/api/devices');
  devices = await res.json();
  const rr = await fetch('/api/rules');
  rules = await rr.json();
  renderDevices();
  populateDeviceSelectors();
  renderRules();
}

function renderDevices(){
  const container = document.getElementById('devices');
  container.innerHTML = '';
  devices.forEach(d => {
    const card = el('div','card');
    card.innerHTML = `<div class="device-name">${d.name}</div><div class="device-meta">State: <strong>${d.state}</strong></div>`;
    const temp = el('div','device-meta',`Temp: ${d.readings.temperature} °C`);
    const hum = el('div','device-meta',`Humidity: ${d.readings.humidity} %`);
    const controls = el('div','controls');
    const btn = el('button', d.state === 'on' ? '' : 'secondary', d.state === 'on' ? 'Turn OFF' : 'Turn ON');
    btn.addEventListener('click', ()=> toggleDevice(d.id));
    controls.appendChild(btn);
    card.appendChild(temp);
    card.appendChild(hum);
    card.appendChild(controls);
    container.appendChild(card);
  });
}

async function toggleDevice(id){
  await fetch(`/api/devices/${id}/toggle`, { method: 'POST' });
}

function showAlert(msg, type='alert'){
  const list = document.getElementById('alerts');
  const li = document.createElement('li');
  li.textContent = msg;
  list.prepend(li);
}

function populateDeviceSelectors(){
  const targetSel = document.getElementById('targetDevice');
  const watchSel = document.getElementById('watchDevice');
  targetSel.innerHTML = '';
  watchSel.innerHTML = '';
  devices.forEach(d => {
    const opt1 = document.createElement('option'); opt1.value = d.id; opt1.textContent = d.name; targetSel.appendChild(opt1);
    const opt2 = document.createElement('option'); opt2.value = d.id; opt2.textContent = d.name; watchSel.appendChild(opt2);
  });
}

function renderRules(){
  const list = document.getElementById('rulesList');
  list.innerHTML = '';
  rules.forEach(r => {
    const li = document.createElement('li');
    li.textContent = `${r.description || `${r.watchDeviceId} ${r.metric} ${r.operator} ${r.threshold} → ${r.action} ${r.targetDeviceId}`}`;
    list.appendChild(li);
  });
}

// socket events
socket.on('connect', ()=> console.log('connected'));
socket.on('initial_state', (data)=>{
  if (data.devices) devices = data.devices;
  if (data.rules) rules = data.rules;
  renderDevices();
  populateDeviceSelectors();
  renderRules();
});
socket.on('device_update', (device)=>{
  const idx = devices.findIndex(d=>d.id===device.id);
  if (idx >= 0) devices[idx] = device; else devices.push(device);
  renderDevices();
});
socket.on('notification', (n)=>{
  showAlert(n.message, n.type);
});
socket.on('rule_created', (r) => {
  rules.push(r);
  renderRules();
});

// automation form
const form = document.getElementById('ruleForm');
form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const watchDeviceId = document.getElementById('watchDevice').value;
  const watchMetric = document.getElementById('watchMetric').value;
  const operator = document.getElementById('operator').value;
  const threshold = parseFloat(document.getElementById('threshold').value);
  const targetDeviceId = document.getElementById('targetDevice').value;
  const action = document.getElementById('action').value;
  const description = `${devices.find(d=>d.id===watchDeviceId)?.name || watchDeviceId} ${watchMetric} ${operator} ${threshold} → ${action} ${devices.find(d=>d.id===targetDeviceId)?.name || targetDeviceId}`;
  const payload = { watchDeviceId, metric: watchMetric, operator, threshold, targetDeviceId, action, description };
  const res = await fetch('/api/rules', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
  if (res.ok){
    const created = await res.json();
    rules.push(created);
    renderRules();
  } else {
    const err = await res.json();
    alert('Failed to create rule: ' + (err.error||'unknown'));
  }
});

// init
fetchDevicesAndRules();
