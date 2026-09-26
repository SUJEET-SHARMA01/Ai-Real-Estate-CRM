import enum
from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from app.core.database import Base


class PropertyStatus(str, enum.Enum):
    available = "available"
    under_negotiation = "under_negotiation"
    sold = "sold"


class PropertyType(str, enum.Enum):
    residential = "residential"
    commercial = "commercial"


class InteractionType(str, enum.Enum):
    call = "call"
    visit = "visit"
    email = "email"
    message = "message"


class Sentiment(str, enum.Enum):
    positive = "positive"
    neutral = "neutral"
    negative = "negative"
    unknown = "unknown"


class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="agent")  # agent | admin
    created_at = Column(DateTime, default=datetime.utcnow)

    interactions = relationship("Interaction", back_populates="agent")


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    contact = Column(String, nullable=True)
    budget_min = Column(Float, nullable=True)
    budget_max = Column(Float, nullable=True)
    preferred_location = Column(String, nullable=True)
    preferred_type = Column(Enum(PropertyType), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    interactions = relationship("Interaction", back_populates="client")


class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    address = Column(String, nullable=False)
    property_type = Column(Enum(PropertyType), nullable=False)
    price = Column(Float, nullable=False)
    status = Column(Enum(PropertyStatus), default=PropertyStatus.available)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    interactions = relationship("Interaction", back_populates="property")


class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=True)
    agent_id = Column(Integer, ForeignKey("agents.id"), nullable=False)

    interaction_type = Column(Enum(InteractionType), nullable=False)
    notes = Column(Text, nullable=False)
    sentiment = Column(Enum(Sentiment), default=Sentiment.unknown)
    follow_up_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    client = relationship("Client", back_populates="interactions")
    property = relationship("Property", back_populates="interactions")
    agent = relationship("Agent", back_populates="interactions")
