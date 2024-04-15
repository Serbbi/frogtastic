from fastapi.testclient import TestClient

from .image import router

client = TestClient(router)

def test_invalid_file():
    response = client.post("/", headers={"Content-Type": "multipart/form-data"}, files={"file": ("test.txt", open("test.txt", "rb"))})
    assert response.status_code == 404