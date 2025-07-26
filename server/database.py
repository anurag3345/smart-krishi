from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# MySQL connection URL format:
# mysql+pymysql://<username>:<password>@<host>:<port>/<database_name>
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "mysql+pymysql://root:mysql@localhost:3306/newapplication"
)


engine = create_engine(
    SQLALCHEMY_DATABASE_URL
   
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# for admin panel
