from fastapi import HTTPException


def raise_access_right_exception():
    raise HTTPException(status_code=403, detail="User does not have access right")

def raise_frog_not_found_exception():
    raise HTTPException(status_code=404, detail="Frog not found")

def raise_400_exception(error_message: str = "Bad Request"):
    raise HTTPException(status_code=400, detail=error_message)

def raise_403_exception(error_message: str = "Forbidden"):
    raise HTTPException(status_code=403, detail=error_message)

def raise_404_exception(error_message: str = "Not Found"):
    raise HTTPException(status_code=404, detail=error_message)

def raise_409_exception(error_message: str = "Conflict"):
    raise HTTPException(status_code=409, detail=error_message)