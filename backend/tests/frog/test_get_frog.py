import logging

from dependencies import get_db
from fastapi.testclient import TestClient
from main import app
from schemas.frog import FrogResponse

from tests.prepare import prepare_token
from tests.utils import override_get_db

logger = logging.getLogger("frog_logger")

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_get_existing_frog():
    ID = 2
    token = prepare_token(client)
    logger.debug(f"Using token: {token}")
    response = client.get(f"/frogs/{ID}", headers={"Authorization": f"Bearer {token}"})
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 200
    res = response.json()
    frog = FrogResponse(**res)
    assert frog.id == ID
    assert isinstance(frog, FrogResponse)


def test_get_non_existing_frog():
    ID = 999
    token = prepare_token(client)
    response = client.get(f"/frogs/{ID}", headers={"Authorization": f"Bearer {token}"})
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 404


def test_get_frog_non_valid_id():
    ID = "NOT VALID"
    token = prepare_token(client)
    response = client.get(f"/frogs/{ID}", headers={"Authorization": f"Bearer {token}"})
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 422


def test_get_frog_no_token():
    ID = 2
    response = client.get(f"/frogs/{ID}")
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 401
