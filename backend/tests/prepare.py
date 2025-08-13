def prepare_token(client):
    response = client.post("/token", data={"username": "elena", "password": "Serban69"})
    res = response.json()
    return res["access_token"]
