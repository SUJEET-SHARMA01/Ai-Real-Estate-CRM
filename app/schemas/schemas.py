from datetime import datetime

from pydantic import BaseModel, EmailStr

from app.models.models import InteractionType, PropertyStatus, PropertyType, Sentiment


# ---------- Agent ----------
class AgentCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class AgentOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ---------- Client ----------
class ClientCreate(BaseModel):
    name: str
    contact: str | None = None
    budget_min: float | None = None
    budget_max: float | None = None
    preferred_location: str | None = None
    preferred_type: PropertyType | None = None


class ClientOut(ClientCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Property ----------
class PropertyCreate(BaseModel):
    address: str
    property_type: PropertyType
    price: float
    status: PropertyStatus = PropertyStatus.available
    description: str | None = None


class PropertyOut(PropertyCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Interaction ----------
class InteractionCreate(BaseModel):
    client_id: int
    property_id: int | None = None
    interaction_type: InteractionType
    notes: str
    sentiment: Sentiment = Sentiment.unknown
    follow_up_date: datetime | None = None


class InteractionOut(InteractionCreate):
    id: int
    agent_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# For the AI "log interaction" endpoint — agent just sends free text
class InteractionFromText(BaseModel):
    client_id: int
    property_id: int | None = None
    raw_text: str
