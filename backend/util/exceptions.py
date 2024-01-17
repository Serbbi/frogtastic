from fastapi import HTTPException


def raise_access_right_exception():
    raise HTTPException(status_code=400, detail="User does not have access right")