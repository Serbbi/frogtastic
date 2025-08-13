from fastapi.testclient import TestClient
from dependencies import get_db
from tests.utils import override_get_db
from tests.prepare import prepare_token
import logging
from main import app

logger = logging.getLogger("frog_logger")

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_download_all_frogs():
    ORG_ID = 1
    token = prepare_token(client)
    response = client.get(
        f"/frogs/download-csv?org_q={ORG_ID}",
        headers={"Authorization": f"Bearer {token}"},
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 200
    assert response.headers["Content-Type"] == "text/csv; charset=utf-8"
    assert "attachment; filename=frogs.csv" in response.headers["Content-Disposition"]


def test_download_tank_frogs():
    ORG_ID = 1
    TANK_ID = 2
    token = prepare_token(client)
    response = client.get(
        f"/frogs/download-csv?org_q={ORG_ID}&tank_q={TANK_ID}",
        headers={"Authorization": f"Bearer {token}"},
    )
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 200
    assert response.headers["Content-Type"] == "text/csv; charset=utf-8"
    assert "attachment; filename=frogs.csv" in response.headers["Content-Disposition"]


def test_download_no_token():
    response = client.get("/frogs/download-csv")
    logger.debug(f"Response: {response.text}")
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}
