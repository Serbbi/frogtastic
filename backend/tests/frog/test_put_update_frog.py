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

new_frog = {
    "id": 1,
    "frog_number": 1,
    "tank_id": 1,
    "current_tank_id": 2,  # Updated from 1 to 2
    "attributes": {"color": "red", "size": "big"},  # Updated attributes
    "organization_id": 1,
    "history": {},
    "image_path": "path/to/image.jpg",
}


def test_update_frog():
    FROG_ID = 1
    ORG_ID = 1
    new_frog["id"] = FROG_ID
    token = prepare_token(client)
    response = client.put(
        f"/frogs/{FROG_ID}?org_q={ORG_ID}",
        headers={"Authorization": f"Bearer {token}"},
        json=new_frog,
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 200
    res = response.json()
    frog = FrogResponse(**res)
    assert isinstance(frog, FrogResponse)
    assert frog.attributes == new_frog["attributes"]
    assert frog.current_tank_id == new_frog["current_tank_id"]
    last_key = list(frog.history.keys())[-1]
    assert frog.history[last_key] == {
        "author": "elena",
        "color": "red",
        "size": "big",
        "current_tank_id": 2,
    }


def test_update_frog_no_token():
    FROG_ID = 1
    ORG_ID = 1
    new_frog["id"] = FROG_ID
    response = client.put(f"/frogs/{FROG_ID}?org_q={ORG_ID}", json=new_frog)
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}


def test_update_frog_from_different_organization():
    FROG_ID = 4
    ORG_ID = 1
    new_frog["id"] = FROG_ID
    token = prepare_token(client)
    response = client.put(
        f"/frogs/{FROG_ID}?org_q={ORG_ID}",
        headers={"Authorization": f"Bearer {token}"},
        json=new_frog,
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 403
    assert response.json() == {"detail": "You cannot edit this frog"}


def test_update_frog_no_privilege():
    FROG_ID = 4
    ORG_ID = 2
    new_frog["id"] = FROG_ID
    token = prepare_token(client)
    response = client.put(
        f"/frogs/{FROG_ID}?org_q={ORG_ID}",
        headers={"Authorization": f"Bearer {token}"},
        json=new_frog,
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 403
    assert response.json() == {"detail": "You cannot edit this frog"}


def test_update_frog_wrong_schema():
    FROG_ID = 1
    ORG_ID = 1
    wrong_frog = {
        "frog_number": 1,
        "tank_id": 1,
        "history": {},
        "image_path": "path/to/image.jpg",
    }

    token = prepare_token(client)
    response = client.put(
        f"/frogs/{FROG_ID}?org_q={ORG_ID}",
        headers={"Authorization": f"Bearer {token}"},
        json=wrong_frog,
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 422


def test_update_frog_non_existing_tank():
    FROG_ID = 1
    ORG_ID = 1
    new_frog["id"] = FROG_ID
    new_frog["current_tank_id"] = 999
    token = prepare_token(client)
    response = client.put(
        f"/frogs/{FROG_ID}?org_q={ORG_ID}",
        headers={"Authorization": f"Bearer {token}"},
        json=new_frog,
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 404


def test_update_frog_different_organization_tank():
    FROG_ID = 1
    ORG_ID = 1
    new_frog["id"] = FROG_ID
    new_frog["current_tank_id"] = 3
    token = prepare_token(client)
    response = client.put(
        f"/frogs/{FROG_ID}?org_q={ORG_ID}",
        headers={"Authorization": f"Bearer {token}"},
        json=new_frog,
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 404


def test_update_frog_history_manipulation():
    FROG_ID = 1
    ORG_ID = 1
    new_frog["id"] = FROG_ID
    new_frog["current_tank_id"] = 2
    new_frog["history"] = {"bla bla": "bla"}
    token = prepare_token(client)
    response = client.put(
        f"/frogs/{FROG_ID}?org_q={ORG_ID}",
        headers={"Authorization": f"Bearer {token}"},
        json=new_frog,
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 200
    res = response.json()
    frog = FrogResponse(**res)
    assert isinstance(frog, FrogResponse)
    assert "bla bla" not in list(frog.history.keys())
