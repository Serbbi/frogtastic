import logging

from dependencies import get_db
from fastapi.testclient import TestClient
from main import app
from tests.utils import override_get_db

logger = logging.getLogger("frog_logger")

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_get_organization():
    pass


def test_get_non_existing_organization():
    pass


def test_get_organization_non_valid_id():
    pass


def test_get_organization_no_token():
    pass
