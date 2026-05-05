# AI-Assistant-Chat-Bot

<div align="center">

## AI Assistant Chat Bot

A simple and modern AI-powered chatbot built with Next.js and OpenRouter API.
It provides real-time conversations with multiple AI models, streaming responses, markdown rendering, and a clean interactive chat interface.

<kbd>Environment Variables Needed: OPENROUTER_API_KEY, NEXT_PUBLIC_SITE_URL</kbd>

<img width="900" alt="App Interface" src="https://github.com/muaazx/AI-Assistant-Chat-Bot-/blob/main/App%20Interface%20Image.PNG" />

</div>

---

## Features

* Multiple Free AI Models (Llama, DeepSeek, Mimo, GLM, Devstral)
* Real-Time Streaming Responses
* Clean and Responsive Chat Interface
* Markdown Rendering with Syntax Highlighting
* Mermaid Diagram Support
* Code Block Copy Functionality
* Persistent Chat Sessions
* Export Chat as Markdown
* Custom System Prompts
* Temperature Control for AI Creativity

---

## Why This Project?

This project is designed as a simple AI chatbot that allows users to interact with powerful AI models without complex setup.

Unlike advanced AI systems that require:

* Vector Databases
* Embedding Models
* RAG Pipelines
* Complex Backend Infrastructure

This chatbot keeps things simple:

* Direct AI Conversations
* Fast Response Streaming
* Multiple Free Models via OpenRouter
* Lightweight and Easy to Deploy
* Clean User Experience

Perfect for:

* Personal AI Assistants
* Learning Projects
* Productivity Tools
* Customer Support Bots
* Business Chat Systems

---

## Quick Start

### Prerequisites

* Node.js 18+
* OpenRouter API Key

Get your free API key from OpenRouter.

---

## Installation

```bash
git clone your-repository-link
cd AI-Assistant-Chat-Bot
npm install
cp .env.example .env.local
```

---

## Setup Environment Variables

Edit `.env.local`

```env
OPENROUTER_API_KEY=your_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Run the Project

```bash
npm run dev
```

For production:

```bash
npm run build
npm start
```

Open in browser:

```bash
http://localhost:3000
```

---

## Project Structure

```bash
AI-Assistant-Chat-Bot/
│
├── app/
│   ├── api/
│   │   ├── chat/
│   │   └── stream/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── chat.tsx
│   ├── mermaid.tsx
│   └── ui/
│
├── lib/
│   └── utils.ts
│
└── README.md
```

---

## API Endpoints

### POST `/api/chat/stream`

Streaming AI response endpoint for real-time conversations.

### POST `/api/chat`

Non-streaming AI response endpoint.

---

## Tech Stack

* Next.js
* React
* TypeScript
* OpenRouter API
* Tailwind CSS
* Shadcn UI
* Mermaid.js

---

## Author

Developed by Muaaz Ahmed

Passionate about AI, Web Development, and Building Smart Solutions.
