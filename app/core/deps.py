from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.auth import decode_access_token
from app.core.database import get_db
from app.models.models import Agent

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_agent(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> Agent:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    agent_id = payload.get("sub")
    if agent_id is None:
        raise credentials_exception
    agent = db.query(Agent).filter(Agent.id == int(agent_id)).first()
    if agent is None:
        raise credentials_exception
    return agent
