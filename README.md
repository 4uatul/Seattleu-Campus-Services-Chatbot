# SeattleU Campus Services RAG Chatbot

A serverless AI chatbot that answers Seattle University students' questions about campus services — parking, printing, mailing, ID cards, transit, and more — using Retrieval-Augmented Generation (RAG) over official campus documentation.


![Architecture diagram](./SeattleU%20RAG%20chatbot%20architecture%20diagram.png)

---

## Table of Contents

- [Overview](#overview)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Knowledge Base](#knowledge-base)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Configuration](#configuration)

---

## Overview

Students often struggle to find quick answers buried in SharePoint intranet pages spread across Campus Services departments. This project fixes that with a chat interface backed by a RAG pipeline: user questions are matched against a vector store of campus service documentation, and Claude generates a grounded answer with citations back to the source pages.

The whole system is **fully serverless** — no servers to manage, and it scales to zero when idle.

## How It Works

1. A student opens the chat UI and asks a question.
2. **Amazon CloudFront** serves the React frontend (hosted on S3) over HTTPS on a custom domain.
3. The frontend sends the question via `POST /chat` to **Amazon API Gateway**.
4. API Gateway triggers an **AWS Lambda** function (Python 3.12).
5. Lambda calls **Amazon Bedrock Knowledge Bases** using `RetrieveAndGenerate`:
   - The question is embedded with **Titan Embeddings V2** and matched against document chunks stored in **S3 Vectors** (300-token chunks, 20% overlap, top 5 results).
   - The retrieved chunks are passed to **Claude Haiku 4.5**, which generates a grounded answer with citations.
6. The answer is returned to the frontend and rendered in the chat window.
7. Source documents live in an S3 bucket, organized by department, and are synced into the Bedrock Knowledge Base.

## Tech Stack

| Layer                | Technology                                              |
| --------------------- | -------------------------------------------------------- |
| Frontend               | React 19 + Vite                                          |
| CDN / Hosting          | Amazon CloudFront + Amazon S3                             |
| API                    | Amazon API Gateway (HTTP API)                             |
| Compute                | AWS Lambda (Python 3.12)                                  |
| Retrieval              | Amazon Bedrock Knowledge Bases + S3 Vectors + Titan Embeddings V2 |
| Generation             | Claude Haiku 4.5 (Amazon Bedrock)                          |
| CI/CD                  | GitHub Actions                                             |

## Repository Structure

```
.
├── campus-chat/                          # React + Vite frontend (chat UI)
│   ├── src/
│   │   ├── App.jsx                       # Main app shell, chat state, API calls
│   │   ├── ChatInput.jsx                 # Message input box
│   │   ├── ChatMessage.jsx               # Renders a single chat bubble
│   │   └── SuggestedQuestions.jsx        # Welcome screen with example prompts
│   └── package.json
│
├── rag_s3_docs/                          # Knowledge base source documents (Markdown)
│   ├── transportation-and-parking/
│   ├── managed-print-services/
│   ├── mailing-services/
│   ├── supercopy/
│   ├── reprographic-services/
│   ├── merch-hub/
│   ├── academic-safety/
│   ├── faqs/
│   └── home/
│
├── campus_services_data.md               # Consolidated source content (53 pages, 73 Q&A pairs)
│
├── .github/workflows/dedploy.yml         # CI/CD: builds frontend and deploys to S3 + CloudFront
│
└── SeattleU RAG chatbot architecture diagram.png
```

> **Note:** This repository contains the frontend and the knowledge base documents. The backend infrastructure (Lambda function, API Gateway, Bedrock Knowledge Base) is provisioned directly in AWS and is not defined as code in this repo.

## Knowledge Base

The `rag_s3_docs/` folder holds the content that powers the chatbot's answers, formatted for direct ingestion into an **Amazon Bedrock Knowledge Base** via S3.

- One Markdown file per Campus Services content page, plus one FAQ file per department
- Each file has an optional `.metadata.json` sidecar for section/title/source metadata
- Covers **53 pages across 7+ departments**: Transportation & Parking, Managed Print Services, Mailing Services, Supercopy, Reprographic Services, Merch Hub, and Academic Safety

To (re-)upload the documents to S3:

```bash
aws s3 sync ./rag_s3_docs s3://YOUR_BUCKET_NAME/campus-services-kb/ --delete
```

Then, in the Amazon Bedrock console, open your Knowledge Base's S3 data source and click **Sync** to re-index the content.

## Getting Started

### Prerequisites

- Node.js 22+
- npm

### Run the frontend locally

```bash
cd campus-chat
npm install
npm run dev
```

The app starts on the local Vite dev server (default `http://localhost:5173`) and talks to the backend API defined in `VITE_API_URL` (see [Configuration](#configuration)).

### Run tests

```bash
cd campus-chat
npm test
```

## Deployment

Deployment is automated with **GitHub Actions** (`.github/workflows/dedploy.yml`). On every push to `main`:

1. The workflow checks out the code and installs dependencies.
2. It builds the React app with Vite (`npx vite build`).
3. It syncs the build output to the S3 bucket that serves the frontend.
4. It invalidates the CloudFront cache so users immediately see the new version.

This requires the following GitHub Actions secrets to be configured in the repository settings:

| Secret                  | Purpose                                |
| ------------------------ | --------------------------------------- |
| `AWS_ACCESS_KEY_ID`      | AWS credentials for the deploy step      |
| `AWS_SECRET_ACCESS_KEY`  | AWS credentials for the deploy step      |

## Configuration

The frontend reads the backend API endpoint from an environment variable:

```
VITE_API_URL=https://<your-api-gateway-id>.execute-api.<region>.amazonaws.com/chat
```

Set this in a `.env.production` file inside `campus-chat/` before building, or export it in your shell for local development. If unset, the app falls back to the deployed API endpoint hardcoded in `App.jsx`.
