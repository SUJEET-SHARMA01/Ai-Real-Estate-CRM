from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_agent
from app.models.models import Agent, Property
from app.schemas.schemas import PropertyCreate, PropertyOut

router = APIRouter(prefix="/properties", tags=["properties"])


@router.post("/", response_model=PropertyOut)
def create_property(
    property_in: PropertyCreate,
    db: Session = Depends(get_db),
    _: Agent = Depends(get_current_agent),
):
    prop = Property(**property_in.model_dump())
    db.add(prop)
    db.commit()
    db.refresh(prop)
    return prop


@router.get("/", response_model=list[PropertyOut])
def list_properties(
    db: Session = Depends(get_db), _: Agent = Depends(get_current_agent)
):
    return db.query(Property).all()


@router.get("/{property_id}", response_model=PropertyOut)
def get_property(
    property_id: int,
    db: Session = Depends(get_db),
    _: Agent = Depends(get_current_agent),
):
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    return prop


@router.put("/{property_id}", response_model=PropertyOut)
def update_property(
    property_id: int,
    property_in: PropertyCreate,
    db: Session = Depends(get_db),
    _: Agent = Depends(get_current_agent),
):
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    for field, value in property_in.model_dump().items():
        setattr(prop, field, value)
    db.commit()
    db.refresh(prop)
    return prop


@router.delete("/{property_id}")
def delete_property(
    property_id: int,
    db: Session = Depends(get_db),
    _: Agent = Depends(get_current_agent),
):
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    db.delete(prop)
    db.commit()
    return {"detail": "Property deleted"}
