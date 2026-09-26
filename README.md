# Log Property Interaction — AI-First Real Estate CRM (Backend)

Backend foundation for the project, matching your HCP CRM's stack pattern:
**FastAPI + SQLAlchemy + JWT auth**, ready for a LangGraph + Groq AI layer on top.

## What's built (Steps 1–4 of the roadmap)

- Project structure with clean separation: `models/`, `schemas/`, `routers/`, `core/`
- SQLAlchemy models: `Agent`, `Client`, `Property`, `Interaction`
- Full CRUD REST APIs for clients, properties, and interactions
- JWT-based authentication (signup + login), all data routes protected
- Auto-generated interactive API docs at `/docs`

## Setup

```bash
# 1. Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate        # on Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Copy the env template and fill in a real secret key
cp .env.example .env
# edit .env — set SECRET_KEY to any random string
# GROQ_API_KEY isn't used yet (that's for Step 6 — the AI agent)

# 4. Run the server
uvicorn app.main:app --reload
```

Server runs at `http://127.0.0.1:8000`. Open `http://127.0.0.1:8000/docs` for the
interactive Swagger UI — you can test every endpoint from the browser, no
Postman needed.

## Try it out

1. `POST /auth/signup` — create an agent account
2. `POST /auth/login` — get a JWT `access_token`
3. Click "Authorize" in `/docs` (top right), paste the token
4. Now `POST /clients/`, `POST /properties/`, `POST /interactions/` all work

## Project structure

```
app/
├── core/
│   ├── database.py    # SQLAlchemy engine/session setup
│   ├── auth.py         # password hashing (bcrypt) + JWT creation/decoding
│   └── deps.py         # get_current_agent dependency for protected routes
├── models/
│   └── models.py       # Agent, Client, Property, Interaction tables
├── schemas/
│   └── schemas.py      # Pydantic request/response schemas
├── routers/
│   ├── auth_router.py
│   ├── clients_router.py
│   ├── properties_router.py
│   └── interactions_router.py
└── main.py              # app entrypoint, wires everything together
```

## Frontend (Step 5 — done)

A React + Redux Toolkit app lives in `frontend/`. It talks to this backend
over REST and handles login/signup, and CRUD for clients, properties, and
interactions, plus a dashboard summary.

```bash
cd frontend
npm install
cp .env.example .env    # VITE_API_BASE_URL defaults to http://127.0.0.1:8000
npm run dev
```

Opens at `http://localhost:5173`. Make sure the backend (`uvicorn app.main:app
--reload`) is running at the same time — sign up for an account, then log in.

Frontend structure:
```
frontend/src/
├── api/client.js        # axios instance, attaches JWT to every request
├── store/                # Redux Toolkit slices (auth, clients, properties, interactions)
├── pages/                # Login, Signup, Dashboard, Clients, Properties, Interactions
├── layout/AppLayout.jsx  # sidebar nav shell for authenticated pages
└── components/ProtectedRoute.jsx
```

## AI agent — Step 6 (done: "Log Interaction" tool)

Agents can now type a free-text note and the LLM extracts the structured
fields (interaction type, sentiment, a clean summary, and an optional
follow-up date) instead of filling every field by hand.

**To use it, you need a free Groq API key:**
1. Sign up at https://console.groq.com/keys and copy a key
2. Add it to your backend `.env`: `GROQ_API_KEY=your-key-here`
3. Restart the backend

In the Interactions page, use the "AI quick log" toggle, pick a client, type
what happened in plain English, and submit — no manual field-by-field entry.
If `GROQ_API_KEY` isn't set, the endpoint returns a clear error telling you
so (rather than crashing), and manual entry still works as a fallback.

How it's built: `app/agent/graph.py` uses LangGraph with a single node today
("extract"), calling Groq via `langchain-groq` with structured output
(`app/agent/schemas.py` defines exactly what fields get extracted). It's
deliberately built as a graph, not a plain function, so the remaining four
tools — search, edit, sentiment analysis, follow-up suggestions — can be
added as sibling nodes later without restructuring this one.

## What's next (Steps 7–8, not built yet)

- **Step 7**: Add remaining AI tools — search, sentiment analysis, follow-up
  suggestions, edit
- **Step 8**: Hot-leads view, overdue follow-ups, sentiment trend graphs on
  the dashboard

## Notes

- Using SQLite for now (`real_estate_crm.db`, auto-created on first run) —
  swap `SQLALCHEMY_DATABASE_URL` in `core/database.py` for PostgreSQL when
  you're ready to deploy.
- Tables are created via `Base.metadata.create_all()` on startup. Once the
  schema stabilizes, switch to Alembic migrations for real schema versioning.
- `CORSMiddleware` currently allows all origins (`*`) — tighten this before
  deploying anywhere public.
