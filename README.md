IoT Monitoring & Control Dashboard

A full-stack IoT monitoring and control dashboard for remotely monitoring and controlling connected devices in real time.

Note: This project currently uses simulated IoT devices and simulated sensor data. No physical hardware is required to run or demonstrate the application. The architecture is designed to support future integration with real IoT hardware, MQTT, HTTP APIs, serial devices, or cloud IoT platforms.

🚀 Features

* 📡 Real-time IoT device monitoring
* 🎛️ Remote device control
* 🔄 Live updates using Socket.IO
* 🌡️ Temperature and humidity sensor simulation
* 🚨 Real-time alerts and threshold monitoring
* ⚙️ Automation rules between devices
* 📊 Device status and sensor data visualization
* 📱 Responsive web dashboard
* 🧪 Simulated IoT environment for development and testing

🏗️ Architecture

The application uses a full-stack architecture consisting of:

IoT Device Simulator → Node.js Backend → Socket.IO → Web Dashboard

The device simulator generates sensor readings and device states. The Node.js server processes the data and communicates with the frontend in real time using Socket.IO.

The architecture can later be extended with real hardware integrations such as:

* MQTT devices
* ESP32 / ESP8266
* Raspberry Pi
* Serial-connected hardware
* REST APIs
* Cloud IoT platforms

🛠️ Technology Stack

Backend

* JavaScript
* Node.js
* Express.js
* Socket.IO

Frontend

* HTML5
* CSS3
* JavaScript
* Responsive UI

IoT Simulation

* Simulated connected devices
* Simulated temperature and humidity sensors
* In-memory device state
* Automation and rule engine
* Simulated alerts

📂 Project Structure

iot-monitoring-control-dashboard/
├── devices/
│   └── simulator.js
├── public/
│   ├── index.html
│   ├── app.js
│   └── style.css
├── package.json
├── server.js
└── README.md

⚡ Getting Started

1. Clone the repository

git clone https://github.com/Bashkenny01/iot-monitoring-control-dashboard.git

2. Open the project

cd iot-monitoring-control-dashboard

3. Install dependencies

npm install

4. Start the application

npm start

5. Open the dashboard

Open your browser and visit:

http://localhost:3000

🧪 Development

For automatic server restarts during development:

npm run dev

🔔 Alerts & Automation

The dashboard includes a simulated automation engine that can monitor device metrics and trigger actions when configured conditions are met.

Example:

Garden Sprinkler
Temperature > 35°C
        ↓
Automation Rule
        ↓
Activate another device

This demonstrates how IoT systems can respond automatically to sensor conditions.

🔌 Future Hardware Integration

The current implementation is simulation-based, but the system is structured to make future hardware integration possible.

Potential integrations include:

* ESP32 sensors
* ESP8266 devices
* Raspberry Pi
* MQTT brokers
* HTTP/REST device APIs
* Cloud IoT services
* Physical relays and actuators

🎯 Project Purpose

This project demonstrates practical skills in:

* Full-stack web development
* Real-time communication
* IoT system architecture
* Device monitoring and control
* Event-driven systems
* Automation logic
* Sensor data simulation
* Responsive dashboard development

👨‍💻 Author

Bashkenny01

GitHub: https://github.com/Bashkenny01

⸻

⭐ If you find this project useful, consider giving it a star.
