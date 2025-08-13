from fastapi import Depends
from sqlalchemy.orm import Session
from dependencies import get_db


class Controller:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db
