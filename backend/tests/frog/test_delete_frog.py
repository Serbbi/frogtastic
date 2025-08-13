from fastapi.testclient import TestClient
from dependencies import get_db
from tests.session_fixture import create_and_delete_database
from tests.utils import override_get_db
from tests.prepare import prepare_token
from schemas.frog import FrogResponse
import logging
from main import app

logger = logging.getLogger("frog_logger")

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

def test_delete_existing_frog():
    FROG_ID = 3
    ORG_ID = 1
    token = prepare_token(client)
    response = client.delete(f"/frogs/{FROG_ID}?org_q={ORG_ID}", headers={"Authorization": f"Bearer {token}"})
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 200
    res = response.json()
    frog = FrogResponse(**res)
    assert frog.id == FROG_ID
    assert isinstance(frog, FrogResponse)

def test_delete_non_existing_frog():
    FROG_ID = 999
    ORG_ID = 1
    token = prepare_token(client)
    response = client.delete(f"/frogs/{FROG_ID}?org_q={ORG_ID}", headers={"Authorization": f"Bearer {token}"})
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 404

def test_delete_frog_different_organization():
    #User has access right in org 1, but frog is in org 2
    FROG_ID = 4
    ORG_ID = 1 
    token = prepare_token(client)
    response = client.delete(f"/frogs/{FROG_ID}?org_q={ORG_ID}", headers={"Authorization": f"Bearer {token}"})
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 403

def test_delete_frog_no_token():
    FROG_ID = 3
    ORG_ID = 1
    response = client.delete(f"/frogs/{FROG_ID}?org_q={ORG_ID}")
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 401

def test_delete_frog_no_privilege():
    FROG_ID = 4
    ORG_ID = 2 
    token = prepare_token(client)
    response = client.delete(f"/frogs/{FROG_ID}?org_q={ORG_ID}", headers={"Authorization": f"Bearer {token}"})
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 403
