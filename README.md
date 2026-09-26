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

## What's next (Steps 5–8, not built yet)

- **Step 5**: React + Redux Toolkit frontend consuming these APIs
- **Step 6**: LangGraph agent + Groq — start with ONE tool: parse free-text
  interaction notes into structured fields (`InteractionFromText` schema is
  already stubbed in `schemas.py` for this)
- **Step 7**: Add remaining AI tools — search, sentiment analysis, follow-up
  suggestions
- **Step 8**: Dashboard — hot leads, overdue follow-ups, sentiment trends

## Notes

- Using SQLite for now (`real_estate_crm.db`, auto-created on first run) —
  swap `SQLALCHEMY_DATABASE_URL` in `core/database.py` for PostgreSQL when
  you're ready to deploy.
- Tables are created via `Base.metadata.create_all()` on startup. Once the
  schema stabilizes, switch to Alembic migrations for real schema versioning.
- `CORSMiddleware` currently allows all origins (`*`) — tighten this before
  deploying anywhere public.
