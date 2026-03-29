# ai-powered-refrigerator
An AI-powered smart refrigerator system that integrates food detection, expiry prediction, and recipe recommendation using machine learning and data-driven techniques.

❄️ SmartRefi: AI-Powered Freshness Control System
SmartRefi is a high-tech, full-stack dashboard designed to modernize kitchen management and reduce food waste. By bridging a "Neon-Dark" futuristic interface with the Google Gemini AI, the system provides real-time inventory tracking, expiry analysis, and intelligent recipe generation.

🚀 Key Features
🧠 AI Culinary Intelligence: Integrated with Gemini 1.5 Flash to analyze safe-to-eat ingredients and generate creative recipe suggestions instantly.

⏲️ Live Sensor Simulation: A dynamic "Heartbeat" system using JavaScript to simulate real-time Fridge, Freezer, and Humidity sensor fluctuations.

🛡️ Automated Expiry Logic: Custom Python backend that calculates shelf-life and categorizes inventory into Fresh, Expiring, or Expired states.

💾 Local Persistence: Implements browser localStorage to ensure your fridge inventory remains intact even after closing the browser or refreshing the page.

🔐 Secure Architecture: Uses .env configuration to protect sensitive API credentials from being exposed in the source code.


🛠️ Technical Tech Stack

Layer,Technology
Frontend,"HTML5, CSS3 (Futuristic UI), JavaScript (ES6+)"
Backend,"Python 3.x, Flask"
AI Engine,Google Generative AI (Gemini API)
Communication,RESTful API / JSON
Environment,Python-Dotenv


📂 Project Structure
ai-powered-refrigerator/
├── app/
│   ├── api.py              # Main Flask Backend Server
│   ├── app.py              # Secondary App Logic
│   └── .env                # Secret API Keys (Protected)
├── data/
│   ├── recipes.json        # Cached AI Recipes
│   └── fridge.db           # SQLite Database for Inventory
├── frontend/
│   ├── index.html          # Futuristic Dashboard UI
│   ├── CSS/
│   │   └── style.css       # Neon & Glassmorphism Styling
│   └── js/
│       └── main.js         # Sensor Jitter & API Logic
├── models/                 # ML/Data Models
├── utils/                  # Helper Functions
├── requirements.txt        # List of Python Dependencies
├── test_db.py              # Database Connectivity Test
└── README.md               # Project Documentation                 # Project Documentation


⚙️ Quick Start
Clone the Repository:

Bash
git clone https://github.com/your-username/smartrefi.git
cd smartrefi

Install Dependencies:

Bash
pip install flask flask-cors google-generativeai python-dotenv

Setup Environment Variables:
Create a .env file in the backend/ folder:

Plaintext
GEMINI_API_KEY=your_actual_key_here

Run the System:

Start the backend: python backend/api.py

Open frontend/index.html in your browser.

🔮 Roadmap & Future Enhancements
Computer Vision: Camera integration to automatically scan and log items as they enter the fridge.

Mobile Push Notifications: Alerts sent to the user's phone when high-value items (meat/dairy) are 24 hours from expiring.

Voice Control: "Hey SmartRefi, what should I cook tonight?" via Web Speech API.

👤 Developer
SURBHI KUMARI