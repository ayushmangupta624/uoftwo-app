# UofTwo  
### An identity-first dating app for University of Toronto students

**UofTwo is the ultimate solution to every UofT student’s dating woes.**  
But more than that, it’s a technical and philosophical experiment in **identity**, compatibility, and human behavior.

UofTwo prioritizes **who people are**, how they express themselves, and how they behave over time—rather than reducing identity to photos and one-line prompts.

---

## 🌐 Hackathon Theme: Identity

Identity is not static, binary, or easily captured by a swipe. Sadly, most dating apps treat identity as a handful of photos and a short bio. Using UofTwo, you express your identity through free-response questions to begin with, but your identity evolves over time, moulded by your behaviour. 

---

## 🎯 Core Idea

UofTwo combines:
- **Self-reported identity** (descriptions, traits, hobbies)
- **Behavioral signals** (swipe patterns, latency, engagement)
- **AI interpretation** (LLM-generated summaries and compatibility explanations)

We use this data to create matches that feel more intentional, more interpretable, and more human. 

---

## ✨ Features

### 🔐 UofT-Only Authentication
- Access restricted to **University of Toronto students**
- Authentication handled via **Supabase**
- Ensures a shared institutional and cultural context
- Reduces spam, bots, and low-trust interactions

---

### 🧾 Identity-First User Profiles
Profiles are built around **expression**, not optimization.

Each user provides:
- Free-response self-description
- Personality traits
- Hobbies and interests
- Editable answers that can evolve over time

Rather than forcing users into rigid categories, UofTwo allows identity to be nuanced and personal.

---

### 🤖 AI-Generated Profile Summaries
At signup (and on edits), we:
- Feed user-written descriptions into an LLM
- Generate a **concise, readable summary**
- Preserve tone while improving clarity

This helps:
- Other users understand someone quickly
- Reduce performative writing
- Normalize diverse writing styles

---

### 💞 AI Compatibility Summaries (Pairwise)
When viewing another user, UofTwo:
- Feeds **both users’ free-response descriptions** into an LLM
- Generates a **natural-language compatibility explanation**
- Focuses on shared values, complementary traits, and potential dynamics

Example:
> “You both value curiosity and long conversations. One of you approaches problems analytically while the other leans intuitive, which could make for a thoughtful and balanced dynamic.”

This makes matching:
- Transparent
- Explainable
- Less mysterious than a raw number

---

### 📊 Compatibility Scoring System
In addition to AI summaries, UofTwo computes a **compatibility score** using multiple signal types.

#### Static Signals
- Similarity between personality traits
- Overlap in hobbies and interests
- Semantic similarity between written descriptions (via embeddings)

#### Behavioral Signals
We track anonymized interaction metrics such as:
- Swipe latency (how quickly decisions are made)
- Swipe frequency
- Like vs pass ratios
- Engagement consistency over time

These signals help infer:
- Selectiveness
- Intent
- Preference patterns

Compatibility is treated as **learned**, not assumed.

---

### 🔁 Behavioral Learning Loop
As users interact with the app:
- Their preferences become clearer
- Matching adapts over time
- Identity is refined through action, not just text

This creates a feedback loop between:
> *Who users say they are*  
> *and how they actually behave*

---

## 🛠️ Tech Stack

### Frontend
- **Next.js** (App Router)
- TypeScript

### Backend
- **Node.js**
- Next.js API routes
- Prisma ORM

### Database, Auth & Storage
- **Supabase**
  - PostgreSQL database
  - Authentication

### AI
- Large Language Models for:
  - Profile summarization
  - Pairwise compatibility summaries
- Embedding-based similarity scoring
- Behavioral analytics pipeline (in-progress / extensible)

---

## 🔮 Future Work

With more time, we would:
- Introduce FAISS-based large-scale similarity search
- Precompute embeddings and compatibility summaries
- Track identity drift over time
- Add visualizations for behavioral patterns
- Experiment with multiple matching strategies
- Conduct A/B tests on explainability vs raw scores

---

## 👥 Who This Is For

UofTwo is for UofT students who:
- Want more meaningful matches
- Care about personality and values
- Are tired of shallow dating mechanics
- Appreciate transparency and explanation

---

It's not UofT, it's UofTwo, mi amor ;)
