from fastapi.testclient import TestClient
import jose.exceptions
import fastapi.exceptions

from .frogs import router

client = TestClient(router)


def test_get_existing_frog():
    response = client.get("/frogs/2")
    assert response.status_code == 200
    assert response.json() == {
    "notes": None,
    "id": 2,
    "last_injection": "2024-02-16",
    "egg_quality": None,
    "actual_tank_id": "Egg box",
    "is_laying_eggs": True,
    "last_priming": None,
    "frog_number": 2,
    "sex": None,
    "tank_id": 1,
    "is_sick": False
}
    
def test_get_non_existent_frog():
    response = client.get("/frogs/1000")
    assert response.status_code == 200
    assert response.json() == None

def test_get_frogs():
    response = client.get("/frogs")
    assert response.status_code == 200
    assert response.json() != None

def test_create_frog_invalid_credentials():
    try:
        response = client.post("/frogs", headers={"Content-Type": "application/json", 'Authorization': 'Bearer invalid_token'}, json={})
        assert response.status_code == 401
        assert response.json() == {"detail": "Could not validate credentials"}
        # We need to ignore the following exceptions, as they are expected
    except jose.exceptions.JWSSignatureError:
        pass
    except ValueError:
        pass
    except jose.exceptions.JWTError:
        pass
    except fastapi.exceptions.HTTPException:
        pass

def test_create_frog_valid_credentials():
    auth_details = client.post("/token", headers={"Content-Type": "application/x-www-form-urlencoded"}, data='username=serban&password=parola')
    token = auth_details.json()["access_token"]
    response = client.post("/frogs", headers={"Content-Type": "application/json", 'Authorization': f'Bearer {token}'}, json={
        "frog_number": 0,
        "last_injection": "2024-03-27",
        "last_priming": "2024-03-27",
        "notes": "string",
        "sex": "string",
        "egg_quality": 0,
        "tank_id": 0,
        "actual_tank_id": "string",
        "is_sick": False,
        "is_laying_eggs": False
    })
    assert response.status_code == 200
    assert response.json() == {
   "frog_number": 0,
        "last_injection": "2024-03-27",
        "last_priming": "2024-03-27",
        "notes": "string",
        "sex": "string",
        "egg_quality": 0,
        "tank_id": 0,
        "actual_tank_id": "string",
        "is_sick": False,
        "is_laying_eggs": False
    }

    