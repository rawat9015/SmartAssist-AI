# SmartAssist AI

**Your AI Assistant That Works Everywhere.**

SmartAssist AI is an AI-powered Chrome extension that helps users work with text on webpages using a floating assistant and a collection of AI writing tools.

## Features

- Rewrite text in different tones
- Summarize selected text
- Generate professional replies
- Fix grammar and spelling
- Translate text
- Explain code
- Extract action items
- Generate meeting notes
- Generate SQL queries and regular expressions
- Create Jira tickets

## Tech Stack

**Frontend:** React, TypeScript, Vite  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**Authentication:** JWT  
**AI Integration:** Gemini API  
**Extension:** Chrome Extension Manifest V3

## Project Structure

```text
SmartAssist-AI/
├── backend/       # Express API, authentication and AI services
├── frontend/      # React UI and Chrome extension files
├── docs/          # Project documentation
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB
- A Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/rawat9015/SmartAssist-AI.git
cd SmartAssist-AI
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Configure your environment variables according to the backend configuration. Keep API keys, database credentials, and JWT secrets in your local `.env` file. Never commit real secrets.

Start the backend using the command configured in `backend/package.json`.

### 3. Set up the frontend

Open a separate terminal:

```bash
cd frontend
npm install
npm run build
```

### 4. Load the Chrome extension

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the `frontend/dist` folder.
5. Ensure the backend is running and configure the API URL for your environment.

## Security

- Do not commit `.env` files or API keys.
- Use environment variables for sensitive configuration.
- Configure production API URLs and security settings before deployment.

## Future Improvements

- Improve the extension's user experience.
- Add more AI-powered productivity tools.
- Prepare production deployment and configuration.

## Author

Developed as a full-stack AI project to explore Chrome extension development, Node.js APIs, authentication, and AI integration.

## Feedback

Suggestions and feedback are welcome!
