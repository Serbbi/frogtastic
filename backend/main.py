from fastapi import FastAPI, File, UploadFile

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/image")
async def upload_image(file: UploadFile = File(...)):
    # Check if the uploaded file is an image (optional)
    if not file.content_type.endswith(("jpg", "jpeg", "png")):
        return {"error": "Only images are allowed"}

    # Process the uploaded image here (example: save it to disk)
    # with open(f"{file.filename}", "wb") as image:
        # image.write(file.file.read())

    return {"filename": file.filename, "message": "Image uploaded successfully"}