# ForgeAI: Automated GitHub Code Review Platform

ForgeAI is a full-stack, AI-powered developer tool designed to autonomously review GitHub Pull Requests, detect code vulnerabilities, verify state transitions, and post dynamic review reports directly to GitHub. It features a real-time telemetry dashboard that streams live PR events, bridging the gap between automated continuous integration and intelligent code analysis.

## 🚀 Key Features

* **Autonomous PR Analysis:** Fetches raw Git diffs and utilizes Large Language Models (LLMs) to identify logical flaws, verify state transitions, and score code quality.
* **Direct GitHub Integration:** Leverages the Model Context Protocol (MCP) to automatically publish structured Markdown review comments directly to the active pull request.
* **Real-Time Telemetry Dashboard:** Streams live repository events (issue comments, PR reviews, state changes) to the frontend using Server-Sent Events (SSE).
* **Safe UI Test Mode:** Includes a deterministic development environment bypass to prevent API rate limits (HTTP 429) and allow frontend UI/UX testing without consuming live AI tokens.
* **Secure Credential Management:** Architecture strictly segregates sensitive API keys (`application.yml`, `mcp-servers-config.json`) from version control.

## 💻 Tech Stack

**Backend**
* Java 21
* Spring Boot 3
* Google Gemini API & Groq SDK
* Model Context Protocol (MCP) Server for GitHub

**Frontend**
* Next.js 14 (App Router)
* React.js
* Tailwind CSS
* Server-Sent Events (EventSource API)

## 📁 Repository Structure

This project is structured as a monorepo containing both the backend and frontend services:

```text
projectreviewai/
├── forgeai-frontend/       # Next.js React Dashboard
│   ├── app/                # Application router and UI components
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── projectai/              # Spring Boot API & AI Agent
│   ├── src/main/java/      # Controllers (Review, Dashboard, Webhook)
│   ├── src/main/resources/ # Configuration (application.yml, mcp-servers-config.json)
│   └── pom.xml             # Maven dependencies
└── README.md
