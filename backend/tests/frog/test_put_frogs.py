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


def test_update_frogs_add_attribute():
    ORG_ID = 1
    new_attributes = ["is_hungry"]
    token = prepare_token(client)
    response = client.put(
        f"/frogs?org_q={ORG_ID}",
        headers={"Authorization": f"Bearer {token}"},
        json=new_attributes,
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 200
    res = response.json()
    assert isinstance(res, list)
    for frog in res:
        frog = FrogResponse(**frog)
        assert isinstance(frog, FrogResponse)
        assert "is_hungry" in frog.attributes


def test_update_frogs_remove_attribute():
    ORG_ID = 1
    new_attributes = ["color"]
    token = prepare_token(client)
    response = client.put(
        f"/frogs?org_q={ORG_ID}",
        headers={"Authorization": f"Bearer {token}"},
        json=new_attributes,
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 200
    res = response.json()
    assert isinstance(res, list)
    for frog in res:
        frog = FrogResponse(**frog)
        assert isinstance(frog, FrogResponse)
        assert "color" not in frog.attributes


def test_update_frogs_add_and_remove_attribute():
    ORG_ID = 1
    new_attributes = ["is_hungry", "color"]
    token = prepare_token(client)
    response = client.put(
        f"/frogs?org_q={ORG_ID}",
        headers={"Authorization": f"Bearer {token}"},
        json=new_attributes,
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 200
    res = response.json()
    assert isinstance(res, list)
    for frog in res:
        frog = FrogResponse(**frog)
        assert isinstance(frog, FrogResponse)
        assert "is_hungry" in frog.attributes
        assert "color" not in frog.attributes


def test_update_frogs_no_token():
    ORG_ID = 1
    new_attributes = ["is_hungry"]
    response = client.put(
        f"/frogs?org_q={ORG_ID}",
        json=new_attributes,
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 401


def test_update_frogs_no_privilege():
    ORG_ID = 2
    new_attributes = ["is_hungry"]
    token = prepare_token(client)
    response = client.put(
        f"/frogs?org_q={ORG_ID}",
        headers={"Authorization": f"Bearer {token}"},
        json=new_attributes,
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 403


def test_update_frogs_empty_attribute_list():
    ORG_ID = 1
    new_attributes = []
    token = prepare_token(client)
    response = client.put(
        f"/frogs?org_q={ORG_ID}",
        headers={"Authorization": f"Bearer {token}"},
        json=new_attributes,
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 200
    res = response.json()
    assert isinstance(res, list)
    for frog in res:
        frog = FrogResponse(**frog)
        assert isinstance(frog, FrogResponse)
        assert len(list(frog.attributes.keys())) == 2  # Color and size


def test_update_frogs_non_existing_organization():
    ORG_ID = 999
    new_attributes = ["color"]
    token = prepare_token(client)
    response = client.put(
        f"/frogs?org_q={ORG_ID}",
        headers={"Authorization": f"Bearer {token}"},
        json=new_attributes,
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 403


def test_update_frogs_invalid_organization_id():
    ORG_ID = "invalid"
    new_attributes = ["color"]
    token = prepare_token(client)
    response = client.put(
        f"/frogs?org_q={ORG_ID}",
        headers={"Authorization": f"Bearer {token}"},
        json=new_attributes,
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 422


def test_update_frogs_no_body():
    ORG_ID = 1
    token = prepare_token(client)
    response = client.put(
        f"/frogs?org_q={ORG_ID}",
        headers={"Authorization": f"Bearer {token}"},
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 422
