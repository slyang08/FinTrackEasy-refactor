# app/account.py
from typing import List, Optional
from datetime import datetime
from sqlmodel import Column, DateTime, Field, JSON, Relationship, SQLModel, String
from passlib.context import CryptContext  # type: ignore

import enum, uuid

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AccountStatus(str, enum.Enum):
    ACTIVE = "Active"
    CLOSED = "Closed"
    FROZEN = "Frozen"


class PreviousPassword(SQLModel):
    hash: str
    changed_at: datetime


class User(SQLModel, table=True):
    __tablename__ = "users"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    accounts: List["Account"] = Relationship(back_populates="user")


class Account(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    password: str = Field(sa_column=Column("password", String, nullable=False))
    status: AccountStatus = Field(default=AccountStatus.ACTIVE)
    previous_passwords: List[PreviousPassword] = Field(sa_column=Column(JSON))
    password_reset_token: Optional[str] = None
    password_reset_expires: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow),
    )

    user: Optional[User] = Relationship(back_populates="accounts")

    def verify_password(self, plain_password: str) -> bool:
        return pwd_context.verify(plain_password, self.password)

    def set_password(self, plain_password: str):
        if self.is_password_reused(plain_password):
            raise ValueError("New password cannot be the same as previous passwords.")
        hashed = pwd_context.hash(plain_password)
        self.password = hashed
        self.updated_at = datetime.utcnow()
        # Manage historical password records, with a maximum of 3 entries saved.
        self.previous_passwords.append({"hash": hashed, "changed_at": self.updated_at})
        if len(self.previous_passwords) > 3:
            self.previous_passwords.pop(0)

    def is_password_reused(self, plain_password: str) -> bool:
        return any(pwd_context.verify(plain_password, pw["hash"]) for pw in self.previous_passwords)
