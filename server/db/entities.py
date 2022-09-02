from sqlalchemy.orm import (
    declarative_base,
    relationship,
)
from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
)

EntityBase = declarative_base()


class User(EntityBase):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, nullable=False)
    deleted_at = Column(DateTime)
    email = Column(String, nullable=False)
    name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)

    wallets = relationship("Wallet",
                           foreign_keys="[Wallet.owner_id]", 
                           back_populates="owner")

    def __repr__(self) -> str:
        return f"User(id={self.id!r})"


class Wallet(EntityBase):
    __tablename__ = "wallet"

    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, nullable=False)
    created_by = Column(Integer, ForeignKey("user.id"), nullable=False)
    deleted_at = Column(DateTime)
    deleted_by = Column(Integer, ForeignKey("user.id"))
    owner_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    name = Column(String, nullable=False)

    owner = relationship("User", foreign_keys=[owner_id], back_populates="wallets")

    def __repr__(self) -> str:
        return f"Wallet(id={self.id!r}, name={self.name!r})"