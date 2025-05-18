🧠 AI-Powered Code Review Tool
This repository contains a Local AI-Powered Code Review Tool that leverages Ollama (with Mistral) and a simple React-based frontend to perform automated, multi-perspective code reviews directly from your Git changes.

📁 Project Structure
.
├── backend/         # Python Flask backend (Ollama + Git diff parser)
└── frontend/        # React frontend (code review runner UI)
🎯 Purpose
This tool provides automated multi-perspective code reviews with the following personas:

🏗️ Architecture Review: Evaluate structural design and separation of concerns.

🔐 Security Review: Identify potential security vulnerabilities.

📈 Product Owner Review: Assess feature alignment with business requirements.

The review is triggered based on staged Git changes from a specific folder.

🔧 Technologies Used
Backend (Python)
Flask – Lightweight backend server

Ollama – Local LLM interface (e.g., mistral)

LangChain – Prompt orchestration

Git CLI – Git diff parsing for local repositories

Frontend (React)
React – SPA for user interaction

fetch API – For backend communication

CSS – Basic styling and loading indicator

🚀 How It Works
User enters a folder path to scan.

Backend runs git diff --cached for that folder.

The code diff is passed to a local LLM (mistral via Ollama) using LangChain.

Reviews are returned under three distinct roles.

Frontend displays results with loading indicator and categorized feedback.

🛠️ Setup Instructions
Backend

cd backend/
pip install -r requirements.txt
ollama run mistral  # ensure Mistral is running locally
python app.py       # runs Flask on localhost:5000
Frontend

cd frontend/
npm install
npm start           # runs React app on localhost:3000
✅ Features
 Folder-specific staged Git diff scanning

 Multi-role code review via local LLM

 Clean, minimal UI with loading indicator

 Cross-origin (CORS) handled for dev setup

🧩 Planned Additions
🔁 Review history tracking

📂 File selector for easier input

🧠 Prompt tuning using past GitLab review comments

🔒 Role-based access for different personas

📊 Review scoring & suggestions

📝 Example Prompt Flow

"Analyze the following diff for architecture concerns: [...]"
=> LLM Response as Architect

"Check the following diff for potential security issues: [...]"
=> LLM Response as Security Analyst

"Evaluate the feature’s alignment with the product goals: [...]"
=> LLM Response as Product Owner
📄 License
MIT – Free to use, modify and extend.