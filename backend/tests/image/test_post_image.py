import base64
import logging
from pathlib import Path

from dependencies import get_db
from fastapi.testclient import TestClient
from main import app
from schemas.frog import FrogResponse

from tests.utils import override_get_db

logger = logging.getLogger("frog_logger")

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_post_image():
    ORG_ID = 1
    MODEL_ID = 1
    file_path = Path("tests/image/test_assets/test_frog.jpg")

    with open(file_path, "rb") as f:
        response = client.post(
            f"/image/{ORG_ID}?model_id={MODEL_ID}",
            files={"file": ("test_frog.jpg", f, "image/jpg")},
        )

    assert response.status_code == 200
    res = response.json()
    frog = FrogResponse(**res["frog"])
    assert isinstance(frog, FrogResponse)
    assert frog.organization_id == ORG_ID
    assert is_base64(res["image"])


def test_post_image_non_existing_model_id():
    ORG_ID = 1
    MODEL_ID = 999
    file_path = Path("tests/image/test_assets/test_frog.jpg")

    with open(file_path, "rb") as f:
        response = client.post(
            f"/image/{ORG_ID}?model_id={MODEL_ID}",
            files={"file": ("test_frog.jpg", f, "image/jpg")},
        )

    # Because I return None if the model index is out of range
    assert response.status_code == 422


def test_post_image_non_existing_organization_id():
    ORG_ID = 999
    MODEL_ID = 1
    file_path = Path("tests/image/test_assets/test_frog.jpg")

    with open(file_path, "rb") as f:
        response = client.post(
            f"/image/{ORG_ID}?model_id={MODEL_ID}",
            files={"file": ("test_frog.jpg", f, "image/jpg")},
        )

    assert response.status_code == 404


def test_post_image_non_existing_organization_id_and_model_id():
    ORG_ID = 999
    MODEL_ID = 999
    file_path = Path("tests/image/test_assets/test_frog.jpg")

    with open(file_path, "rb") as f:
        response = client.post(
            f"/image/{ORG_ID}?model_id={MODEL_ID}",
            files={"file": ("test_frog.jpg", f, "image/jpg")},
        )

    assert response.status_code == 404


def test_post_image_invalid_file():
    ORG_ID = 1
    MODEL_ID = 1
    file_path = Path("tests/image/test_assets/test_invalid_file.txt")

    with open(file_path, "rb") as f:
        response = client.post(
            f"/image/{ORG_ID}?model_id={MODEL_ID}",
            files={"file": ("test_invalid_file.txt", f, "text/plain")},
        )

    assert response.status_code == 400


def test_post_image_cannot_extract_pattern():
    ORG_ID = 1
    MODEL_ID = 1
    file_path = Path("tests/image/test_assets/test_cannot_extract_pattern.jpg")

    with open(file_path, "rb") as f:
        response = client.post(
            f"/image/{ORG_ID}?model_id={MODEL_ID}",
            files={"file": ("test_cannot_extract_pattern.jpg", f, "image/jpg")},
        )

    assert response.status_code == 422


def test_post_image_invalid_model_id():
    ORG_ID = 1
    MODEL_ID = "invalid"
    file_path = Path("tests/image/test_assets/test_frog.jpg")

    with open(file_path, "rb") as f:
        response = client.post(
            f"/image/{ORG_ID}?model_id={MODEL_ID}",
            files={"file": ("test_frog.jpg", f, "image/jpg")},
        )

    assert response.status_code == 422


def test_post_image_invalid_organization_id():
    ORG_ID = "invalid"
    MODEL_ID = 1
    file_path = Path("tests/image/test_assets/test_frog.jpg")

    with open(file_path, "rb") as f:
        response = client.post(
            f"/image/{ORG_ID}?model_id={MODEL_ID}",
            files={"file": ("test_frog.jpg", f, "image/jpg")},
        )

    assert response.status_code == 422


def test_post_image_invalid_organization_id_and_model_id():
    ORG_ID = "invalid"
    MODEL_ID = "invalid"
    file_path = Path("tests/image/test_assets/test_frog.jpg")

    with open(file_path, "rb") as f:
        response = client.post(
            f"/image/{ORG_ID}?model_id={MODEL_ID}",
            files={"file": ("test_frog.jpg", f, "image/jpg")},
        )

    assert response.status_code == 422


def is_base64(sb: str) -> bool:
    try:
        return base64.b64encode(base64.b64decode(sb)) == sb.encode()
    except Exception:
        return False
