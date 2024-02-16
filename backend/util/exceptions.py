from fastapi import HTTPException


def raise_access_right_exception():
    raise HTTPException(status_code=403, detail="User does not have access right")

def raise_frog_not_found_exception():
    raise HTTPException(status_code=404, detail="Frog not found")