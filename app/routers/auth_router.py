from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import create_access_token, hash_password, verify_password
from app.core.database import get_db
from app.models.models import Agent
from app.schemas.schemas import AgentCreate, AgentOut, LoginRequest, Token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=AgentOut)
def signup(agent_in: AgentCreate, db: Session = Depends(get_db)):
    existing = db.query(Agent).filter(Agent.email == agent_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    agent = Agent(
        name=agent_in.name,
        email=agent_in.email,
        hashed_password=hash_password(agent_in.password),
    )
    db.add(agent)
    db.commit()
    db.refresh(agent)
    return agent


@router.post("/login", response_model=Token)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.email == credentials.email).first()
    if not agent or not verify_password(credentials.password, agent.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    token = create_access_token(data={"sub": str(agent.id)})
    return Token(access_token=token)
