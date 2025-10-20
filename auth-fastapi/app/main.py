from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import SQLModel, select, Session  # type: ignore
from app.database import engine, get_session
from app.account import Account

app = FastAPI()


@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/test-db")
def test_db(session: Session = Depends(get_session)):
    result = session.exec(select(Account)).first()
    return {"test_account": result}
