from fastapi import HTTPException


def raise_400_exception(error_message: str = "Bad Request"):
    raise HTTPException(status_code=400, detail=error_message)


def raise_403_exception(error_message: str = "Forbidden"):
    raise HTTPException(status_code=403, detail=error_message)


def raise_404_exception(error_message: str = "Not Found"):
    raise HTTPException(status_code=404, detail=error_message)


def raise_409_exception(error_message: str = "Conflict"):
    raise HTTPException(status_code=409, detail=error_message)


def raise_422_exception(error_message: str = "Unprocessable Entity"):
    raise HTTPException(status_code=422, detail=error_message)
