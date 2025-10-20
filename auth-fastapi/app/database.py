from sqlmodel import create_engine, Session  # type: ignore
from sqlalchemy import event  # type: ignore
from sqlalchemy.engine import Engine  # type: ignore

import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL, echo=True)


# Database Connection Success Event
@event.listens_for(Engine, "connect")
def on_connect(dbapi_connection, connection_record):
    print("The Supabase database connection was successful.")


def get_session():
    with Session(engine) as session:
        yield session
