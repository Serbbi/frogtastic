from dependencies import get_db
from fastapi import Depends
from sqlalchemy.orm import Session


class Controller:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db
