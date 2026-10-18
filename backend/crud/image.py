from storage import s3, BUCKET_NAME, S3_ENVIRONMENT
import re
import os
import zipfile
from io import BytesIO
from util.exceptions import raise_400_exception
from crud.controller import Controller
from crud.frog import FrogController

class ImageController(Controller):
    async def upload_reference_image(self, organization_id: int, frog_number, tank_number, file):
        file_extension = file.filename.split(".")[-1]
        if frog_number and tank_number:
            key = f"{S3_ENVIRONMENT}/{organization_id}/reference_images/frog{frog_number}_tank{tank_number}.{file_extension}"
        else:
            # Check for regex "frog<number>_tank<number>"
            match = re.match(r"frog(\d+)_tank(\d+)", file.filename)
            if match:
                frog_number = match.group(1)
                tank_number = match.group(2)
                key = f"{S3_ENVIRONMENT}/{organization_id}/reference_images/frog{frog_number}_tank{tank_number}.{file_extension}"
            else:
                raise_400_exception("Filename must contain frog and tank numbers in the format 'frog<number>_tank<number>'.")
            
        frog = get_frogs(organization_id, frog_number, tank_number, FrogController(self.db))
        if not frog:
            raise_400_exception(f"No frog found for frog number {frog_number} and tank number {tank_number} in organization {organization_id}.")

        content = await file.read()

        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=key,
            Body=content
        )
        return {"message": "Reference image uploaded successfully"}

    def bulk_upload_reference_images(self, organization_id: int, zip_file):
        content = zip_file.file.read()
        zip_stream = BytesIO(content)

        with zipfile.ZipFile(zip_stream) as z:
            for filename in z.namelist():
                match = re.match(r"frog(\d+)_tank(\d+)\.(jpg|png|jpeg)$", filename)
                if match:
                    frog_number = match.group(1)
                    tank_number = match.group(2)
                    file_extension = match.group(3)
                    key = f"{S3_ENVIRONMENT}/{organization_id}/reference_images/frog{frog_number}_tank{tank_number}.{file_extension}"

                    file_content = z.read(filename)

                    s3.put_object(
                        Bucket=BUCKET_NAME,
                        Key=key,
                        Body=file_content
                    )
                else:
                    raise_400_exception(f"Filename '{filename}' does not match required format 'frog<number>_tank<number>.<ext>'.")

        return {"message": "Bulk reference images uploaded successfully"}
    
    def upload_to_s3(self, local_file_path: str, organization_id: int, frog_id: int):
        s3_key = f"{S3_ENVIRONMENT}/{organization_id}/uploads/{frog_id}/{os.path.basename(local_file_path)}"
        s3.upload_file(local_file_path, BUCKET_NAME, s3_key)
        return {"message": "File uploaded successfully to S3"}
    

def get_frogs(org_q: int, frog_number_q: int, tank_number_q: int, frog_controller: FrogController):
    return frog_controller.get_frogs(org_q=org_q, frog_number_q=frog_number_q, tank_number_q=tank_number_q)