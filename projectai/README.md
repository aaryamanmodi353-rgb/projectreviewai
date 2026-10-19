# ProjectReviewAI 🤖

> An intelligent, automated code review assistant powered by Spring AI, Model Context Protocol (MCP), and the Groq API.

ProjectReviewAI is a Spring Boot application designed to streamline the software development lifecycle by providing instant, AI-driven code reviews. By integrating directly with GitHub Webhooks, the application automatically listens for Pull Request events, analyzes the code diffs, and posts actionable feedback—such as catching hardcoded secrets or identifying potential `NullPointerException`s—directly to the GitHub PR timeline.

---

## ✨ Features

* **Automated Pull Request Analysis:** Instantly triggers code reviews when a new Pull Request is opened or synchronized.
* **LLM-Powered Insights:** Utilizes Groq's high-speed inference to analyze code quality, security vulnerabilities, and logic flaws.
* **Model Context Protocol (MCP) Integration:** Seamlessly bridges GitHub's context with the Spring AI agent.
* **Secure Credential Management:** Enforces local `.env` configurations to prevent API keys and Personal Access Tokens from leaking into version control.
* **Local Webhook Proxying:** Fully configured for local development and testing using Smee.io.

---
