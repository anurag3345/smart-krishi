from fastapi import FastAPI
from router import auth,users, machinery
from database import Base, engine
from router import vegetables , disease



# Create tables in MySQL
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SMART KRISHI", version="1.0.0")

app.include_router(auth.router, prefix="/auth", tags=["auth"])

# app.include_router(crops.router)
# app.include_router(disease.router)
app.include_router(machinery.router)
app.include_router(users.router)
app.include_router(vegetables.router)
app.include_router(disease.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to SMART KRISHI - AI-Powered Platform for Smarter Farming"}




