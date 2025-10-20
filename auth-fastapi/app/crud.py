# app/crud.py
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def is_password_reused(new_password: str, previous_passwords: List[PreviousPassword]) -> bool:
    for prev in previous_passwords:
        if verify_password(new_password, prev.hash):
            return True
    return False
