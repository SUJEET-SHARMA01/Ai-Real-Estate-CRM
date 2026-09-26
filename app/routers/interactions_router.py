from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_agent
from app.models.models import Agent, Interaction
from app.schemas.schemas import InteractionCreate, InteractionOut

router = APIRouter(prefix="/interactions", tags=["interactions"])


@router.post("/", response_model=InteractionOut)
def create_interaction(
    interaction_in: InteractionCreate,
    db: Session = Depends(get_db),
    agent: Agent = Depends(get_current_agent),
):
    """Manual (non-AI) interaction logging — plain form-based entry."""
    interaction = Interaction(**interaction_in.model_dump(), agent_id=agent.id)
    db.add(interaction)
    db.commit()
    db.refresh(interaction)
    return interaction


@router.get("/", response_model=list[InteractionOut])
def list_interactions(
    db: Session = Depends(get_db), _: Agent = Depends(get_current_agent)
):
    return db.query(Interaction).order_by(Interaction.created_at.desc()).all()


@router.get("/client/{client_id}", response_model=list[InteractionOut])
def list_interactions_for_client(
    client_id: int,
    db: Session = Depends(get_db),
    _: Agent = Depends(get_current_agent),
):
    return (
        db.query(Interaction)
        .filter(Interaction.client_id == client_id)
        .order_by(Interaction.created_at.desc())
        .all()
    )


@router.put("/{interaction_id}", response_model=InteractionOut)
def update_interaction(
    interaction_id: int,
    interaction_in: InteractionCreate,
    db: Session = Depends(get_db),
    _: Agent = Depends(get_current_agent),
):
    interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    for field, value in interaction_in.model_dump().items():
        setattr(interaction, field, value)
    db.commit()
    db.refresh(interaction)
    return interaction
