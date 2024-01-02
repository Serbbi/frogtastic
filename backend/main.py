import os
from fastapi import FastAPI, File, UploadFile
from frogRetreiver import retrieveFrog


app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/image")
async def upload_image(file: UploadFile = File(...)):
    # Check if the uploaded file is an image (optional)
    if not file.content_type.endswith(("jpg", "jpeg", "png")):
        return {"error": "Only images are allowed"}

    # Process the uploaded image
    with open(f"uploaded images/{file.filename}", "wb") as image:
        image.write(file.file.read())
    result = retrieveFrog(f"uploaded images/{file.filename}")


    # Delete image after processing
    os.remove(f"uploaded images/{file.filename}")

    return {"filename": file.filename, "message": "Image uploaded successfully", "predictions": result}