This **Product Requirements Document (PRD)** outlines the transformation of "Grand Central Station" from a simple project launcher into an **AI-Powered Project Intelligence Hub**.

---

# PRD: Grand Central Station (V2 - "The Brain")

## 1. Executive Summary

**Grand Central Station V2** will transition from a project directory into a "Context Engine." By leveraging the OpenAI API and local semantic indexing, the system will provide a unified, "cohesive thought" across all 40+ disparate projects, allowing the user to query their entire body of work as a single knowledge base.

## 2. Target Objectives

* **Unified Context:** Create a single source of truth for all local coding projects.
* **AI-Driven Analysis:** Use OpenAI to audit project progress, tech stacks, and "lost" ideas.
* **Zero-Friction Management:** Automate the "What was I doing here?" recovery process when opening old folders.

---

## 3. Functional Requirements

### 3.1. The "Scanner" (Context Acquisition)

* **Automated Indexing:** The system must crawl local directories while ignoring "junk" (e.g., `node_modules`, `.venv`, `.git`).
* **Project "Bio" Generation:** For every folder, the system uses OpenAI to generate a `project_fingerprint.json` containing:
* **Core Purpose:** (A 2-sentence summary of the project's goal).
* **Tech Stack:** (Detected languages, frameworks, and APIs).
* **Current State:** (Draft, MVP, Maintenance, or Abandoned).


* **Vector Embeddings:** Convert these "Bios" into mathematical vectors stored in a local SQLite database for instant semantic search.

### 3.2. "Global Intelligence" Dashboard

* **Cross-Project Querying:** A chat interface where the user can ask questions like:
* *"Which projects use the OpenAI API but haven't been touched in 3 months?"*
* *"I want to build a new dashboard; find me the best React table component I've written previously."*


* **Executive Summary:** A weekly AI-generated report summarizing the "state of the hard drive."

### 3.3. Project-Specific "Flight Deck"

* **Pre-Flight Briefing:** When a project is selected (before opening VS Code), display:
* The last 3 tasks completed.
* The "Next Logical Step" (suggested by AI based on `TODO.md` or recent commits).
* A "Quick Notes" pad that saves to the project folder.



### 3.4. AI Management & API Control

* **Token Optimization:** To save costs, the system should only send summaries to OpenAI, not raw code, unless the user explicitly requests a "Deep Audit."
* **Key Management:** Secure storage for the User's OpenAI API Key.

---

## 4. Technical Architecture

| Layer | Technology |
| --- | --- |
| **Frontend** | Existing Vibe-coded Interface (updated with AI Chat sidebar). |
| **Orchestration** | Node.js or Python (handling file system I/O and API calls). |
| **Database** | **SQLite** (for metadata) + **ChromaDB** (for vector search). |
| **LLM Integration** | OpenAI `gpt-4o-mini` (for cheap/fast indexing) and `gpt-4o` (for complex analysis). |

---

## 5. User Experience (The "Grand Central" Flow)

1. **Sync:** User hits "Rescan Hard Drive." Grand Central identifies new folders.
2. **Analyze:** AI runs in the background, reading Readmes and package files to update the "Knowledge Graph."
3. **Consult:** User types: *"I feel like I'm repeating myself. Do I have any existing logic for user authentication?"*
4. **Action:** Grand Central shows 3 projects, gives the file paths, and provides a "Launch in VS Code" button for the most relevant one.

---

## 6. Success Metrics

* **Time to Context:** Reduce the time it takes to understand an old project from 15 minutes to < 30 seconds.
* **Code Reuse:** Increase the frequency of using snippets from old projects rather than rewriting them.

---

### What would you like to do next?
