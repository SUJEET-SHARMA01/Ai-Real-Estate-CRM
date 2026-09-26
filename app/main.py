from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.routers import auth_router, clients_router, interactions_router, properties_router

# Creates tables on startup (swap for Alembic migrations once schema stabilizes)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Log Property Interaction — AI Real Estate CRM")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this before deploying
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(clients_router.router)
app.include_router(properties_router.router)
app.include_router(interactions_router.router)


@app.get("/")
def root():
    return {"status": "ok", "message": "Real Estate CRM API is running"}
