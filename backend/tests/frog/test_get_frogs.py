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


def test_get_frogs():
    token = prepare_token(client)
    response = client.get("/frogs", headers={"Authorization": f"Bearer {token}"})
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 200
    res = response.json()
    assert isinstance(res, list)
    assert len(res) > 0
    for frog in res:
        frog = FrogResponse(**frog)
        assert isinstance(frog, FrogResponse)


def test_get_frogs_no_token():
    response = client.get("/frogs")
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 401


def test_get_frogs_by_tank():
    TANK_ID = 2
    token = prepare_token(client)
    response = client.get(
        f"/frogs?tank_q={TANK_ID}", headers={"Authorization": f"Bearer {token}"}
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 200
    res = response.json()
    assert isinstance(res, list)
    assert len(res) > 0
    for frog in res:
        frog = FrogResponse(**frog)
        assert isinstance(frog, FrogResponse)
        assert frog.current_tank_id == TANK_ID


def test_get_frogs_number_limit():
    NO_FROGS = 1
    token = prepare_token(client)
    response = client.get(
        f"/frogs?no_frogs_q={NO_FROGS}", headers={"Authorization": f"Bearer {token}"}
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 200
    res = response.json()
    assert isinstance(res, list)
    assert len(res) == NO_FROGS


def test_get_frogs_by_organization():
    ORG_ID = 1
    token = prepare_token(client)
    response = client.get(
        f"/frogs?org_q={ORG_ID}", headers={"Authorization": f"Bearer {token}"}
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 200
    res = response.json()
    assert isinstance(res, list)
    assert len(res) > 0
    for frog in res:
        frog = FrogResponse(**frog)
        assert isinstance(frog, FrogResponse)
        assert frog.organization_id == ORG_ID


def test_get_frogs_by_organization_and_tank():
    ORG_ID = 1
    TANK_ID = 2
    token = prepare_token(client)
    response = client.get(
        f"/frogs?org_q={ORG_ID}&tank_q={TANK_ID}",
        headers={"Authorization": f"Bearer {token}"},
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 200
    res = response.json()
    assert isinstance(res, list)
    assert len(res) > 0
    for frog in res:
        frog = FrogResponse(**frog)
        assert isinstance(frog, FrogResponse)
        assert frog.organization_id == ORG_ID
        assert frog.current_tank_id == TANK_ID


def test_get_frogs_by_organization_tank_and_number_limit():
    ORG_ID = 1
    TANK_ID = 2
    NO_FROGS = 1
    token = prepare_token(client)
    response = client.get(
        f"/frogs?org_q={ORG_ID}&tank_q={TANK_ID}&no_frogs_q={NO_FROGS}",
        headers={"Authorization": f"Bearer {token}"},
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 200
    res = response.json()
    assert isinstance(res, list)
    assert len(res) == NO_FROGS
    for frog in res:
        frog = FrogResponse(**frog)
        assert isinstance(frog, FrogResponse)
        assert frog.organization_id == ORG_ID
        assert frog.current_tank_id == TANK_ID


def test_get_frogs_by_tank_and_number_limit():
    TANK_ID = 2
    NO_FROGS = 1
    token = prepare_token(client)
    response = client.get(
        f"/frogs?tank_q={TANK_ID}&no_frogs_q={NO_FROGS}",
        headers={"Authorization": f"Bearer {token}"},
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 200
    res = response.json()
    assert isinstance(res, list)
    assert len(res) == NO_FROGS
    for frog in res:
        frog = FrogResponse(**frog)
        assert isinstance(frog, FrogResponse)
        assert frog.current_tank_id == TANK_ID


def test_get_frogs_by_non_existing_organization():
    ORG_ID = 999
    token = prepare_token(client)
    response = client.get(
        f"/frogs?org_q={ORG_ID}", headers={"Authorization": f"Bearer {token}"}
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 200
    res = response.json()
    assert isinstance(res, list)
    assert len(res) == 0


def test_get_frogs_by_non_existing_tank():
    TANK_ID = 999
    token = prepare_token(client)
    response = client.get(
        f"/frogs?tank_q={TANK_ID}", headers={"Authorization": f"Bearer {token}"}
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 200
    res = response.json()
    assert isinstance(res, list)
    assert len(res) == 0


def test_get_frogs_by_organization_and_non_existing_tank():
    ORG_ID = 1
    TANK_ID = 999
    token = prepare_token(client)
    response = client.get(
        f"/frogs?org_q={ORG_ID}&tank_q={TANK_ID}",
        headers={"Authorization": f"Bearer {token}"},
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 200
    res = response.json()
    assert isinstance(res, list)
    assert len(res) == 0


def test_get_frogs_by_non_existing_organziation_and_tank():
    ORG_ID = 999
    TANK_ID = 2
    token = prepare_token(client)
    response = client.get(
        f"/frogs?org_q={ORG_ID}&tank_q={TANK_ID}",
        headers={"Authorization": f"Bearer {token}"},
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 200
    res = response.json()
    assert isinstance(res, list)
    assert len(res) == 0


def test_get_frogs_by_non_existing_organization_and_non_existing_tank():
    ORG_ID = 999
    TANK_ID = 999
    token = prepare_token(client)
    response = client.get(
        f"/frogs?org_q={ORG_ID}&tank_q={TANK_ID}",
        headers={"Authorization": f"Bearer {token}"},
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 200
    res = response.json()
    assert isinstance(res, list)
    assert len(res) == 0


def test_get_frogs_by_negative_number_limit():
    NO_FROGS = -2
    token = prepare_token(client)
    response = client.get(
        f"/frogs?no_frogs_q={NO_FROGS}", headers={"Authorization": f"Bearer {token}"}
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 200
    res = response.json()
    assert isinstance(res, list)
    assert len(res) == 0


def test_get_frogs_by_invalid_number_limit():
    NO_FROGS = "invalid"
    token = prepare_token(client)
    response = client.get(
        f"/frogs?no_frogs_q={NO_FROGS}", headers={"Authorization": f"Bearer {token}"}
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 422


def test_get_frogs_by_invalid_organization():
    ORG_ID = "invalid"
    token = prepare_token(client)
    response = client.get(
        f"/frogs?org_q={ORG_ID}", headers={"Authorization": f"Bearer {token}"}
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 422


def test_get_frogs_by_invalid_tank():
    TANK_ID = "invalid"
    token = prepare_token(client)
    response = client.get(
        f"/frogs?tank_q={TANK_ID}", headers={"Authorization": f"Bearer {token}"}
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 422
