import datetime as dt

from sqlalchemy.orm import (
    declarative_base,
    relationship,
)
from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
)

EntityBase = declarative_base()


class User(EntityBase):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, nullable=False, default=dt.datetime.now)
    deleted_at = Column(DateTime)
    email = Column(String, nullable=False)
    name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)

    wallets = relationship("Wallet",
                           foreign_keys="[Wallet.owner_id]", 
                           back_populates="owner")

    categories = relationship("Category",
                           foreign_keys="[Category.owner_id]",
                           back_populates="owner")

    def __repr__(self) -> str:
        return f"User(id={self.id!r})"


class Wallet(EntityBase):
    __tablename__ = "wallet"

    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, nullable=False, default=dt.datetime.now)
    creator_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    deleted_at = Column(DateTime)
    deleter_id = Column(Integer, ForeignKey("user.id"))
    owner_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    name = Column(String, nullable=False)

    owner = relationship("User", foreign_keys=[owner_id], back_populates="wallets")
    creator = relationship("User", foreign_keys=[creator_id])
    deleter = relationship("User", foreign_keys=[deleter_id])

    def __repr__(self) -> str:
        return f"Wallet(id={self.id!r}, name={self.name!r})"


class Transaction(EntityBase):
    __tablename__ = "transaction"

    id = Column(Integer, primary_key=True)
    notes = Column(String)
    amount = Column(Numeric(128,3), nullable=False)
    time = Column(DateTime, nullable=False)
    category_id = Column(Integer, ForeignKey("category.id"))
    created_at = Column(DateTime, nullable=False, default=dt.datetime.now)
    creator_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    deleted_at = Column(DateTime)
    deleter_id = Column(Integer, ForeignKey("user.id"))
    src_wallet_id = Column(Integer, ForeignKey("wallet.id"))
    dst_wallet_id = Column(Integer, ForeignKey("wallet.id"))

    category = relationship("Category")
    src_wallet = relationship("Wallet", foreign_keys=[src_wallet_id])
    dst_wallet = relationship("Wallet", foreign_keys=[dst_wallet_id])
    creator = relationship("User", foreign_keys=[creator_id])
    deleter = relationship("User", foreign_keys=[deleter_id])

    def __repr__(self) -> str:
        return f"Transaction(id={self.id!r}, amount={self.amount!r}, src={self.src_wallet_id!r}, dst={self.dst_wallet_id!r})"


class Category(EntityBase):
    __tablename__ = "category"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    owner_id = Column(Integer, ForeignKey("user.id"))
    created_at = Column(DateTime, nullable=False, default=dt.datetime.now)
    creator_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    deleted_at = Column(DateTime)
    deleter_id = Column(Integer, ForeignKey("user.id"))

    icon_id = Column(Integer, ForeignKey("icon.id"))
    icon_color = Column(String)

    owner = relationship("User", foreign_keys=[owner_id], back_populates="categories")
    creator = relationship("User", foreign_keys=[creator_id])
    deleter = relationship("User", foreign_keys=[deleter_id])
    icon = relationship("Icon")

    def __repr__(self) -> str:
        return f"Category(id={self.id!r}, amount={self.name!r})"

class Icon(EntityBase):
    __tablename__ = "icon"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    image_url = Column(String)
    created_at = Column(DateTime, nullable=False, default=dt.datetime.now)
    deleted_at = Column(DateTime)