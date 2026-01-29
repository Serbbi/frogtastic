from storage import s3, BUCKET_NAME

from crud.controller import Controller


class MLModelController(Controller):
    def get_ml_model(self, model_name: str, organization_id: int):
        try:
            model = s3.get_object(Bucket=BUCKET_NAME, Key=f"dev/{organization_id}/models/{model_name}.h5")
            labeler = s3.get_object(Bucket=BUCKET_NAME, Key=f"dev/{organization_id}/models/{model_name}.pkl")
        except s3.exceptions.NoSuchKey:
            return None
        
        return {
            "model": model['Body'].read(),
            "labeler": labeler['Body'].read()
        }
        
    
    def upload_ml_model(self, model_file, labeler_file, organization_id: int):
        s3.put_object(Bucket=BUCKET_NAME, Key=f"dev/{organization_id}/models/{model_file.filename}", Body=model_file.file)
        s3.put_object(Bucket=BUCKET_NAME, Key=f"dev/{organization_id}/models/{labeler_file.filename}", Body=labeler_file.file)
        
        return {"message": "Files uploaded successfully"}
    

    def delete_ml_model(self, model_name: str, organization_id: int):
        s3.delete_object(Bucket=BUCKET_NAME, Key=f"dev/{organization_id}/models/{model_name}.h5")
        s3.delete_object(Bucket=BUCKET_NAME, Key=f"dev/{organization_id}/models/{model_name}.pkl")
        
        return {"message": "Files deleted successfully"}