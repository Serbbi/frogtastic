from fastapi.testclient import TestClient
from dependencies import get_db
from tests.session_fixture import create_and_delete_database
from tests.utils import override_get_db
from schemas.frog import FrogResponse
import logging
from main import app

logger = logging.getLogger("frog_logger")

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

def test_get_existing_frog():
    ID = 2
    token = prepare_token()
    logger.debug(f"Using token: {token}")
    response = client.get(f"/frogs/{ID}", headers={"Authorization": f"Bearer {token}"})
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 200
    res = response.json()
    frog = FrogResponse(**res)
    assert frog.id == ID
    assert isinstance(frog, FrogResponse)
    

def prepare_token():
    response = client.post("/token", 
                          headers={"Content-Type": "application/x-www-form-urlencoded"},
                          data='username=elena&password=Serban69')
    res = response.json()
    return res["access_token"]