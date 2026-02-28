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
        # Check if files have same base name
        model_base = model_file.filename.rsplit('.', 1)[0]
        labeler_base = labeler_file.filename.rsplit('.', 1)[0]
        if model_base != labeler_base:
            return {"error": "Model file and labeler file must have the same base name."}
        
        if model_file.filename.rsplit('.', 1)[1] != "h5":
            return {"error": "Model file must have .h5 extension."}
        
        if labeler_file.filename.rsplit('.', 1)[1] != "pkl":
            return {"error": "Labeler file must have .pkl extension."}

        s3.put_object(Bucket=BUCKET_NAME, Key=f"dev/{organization_id}/models/{model_file.filename}", Body=model_file.file)
        s3.put_object(Bucket=BUCKET_NAME, Key=f"dev/{organization_id}/models/{labeler_file.filename}", Body=labeler_file.file)
        
        return {"message": "Files uploaded successfully"}
    

    def delete_ml_model(self, model_name: str, organization_id: int):
        s3.delete_object(Bucket=BUCKET_NAME, Key=f"dev/{organization_id}/models/{model_name}.h5")
        s3.delete_object(Bucket=BUCKET_NAME, Key=f"dev/{organization_id}/models/{model_name}.pkl")
        
        return {"message": "Files deleted successfully"}
    

    def get_organization_model_names(self, organization_id: int):
        try:
            response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=f"dev/{organization_id}/models/")
            if 'Contents' not in response:
                return []
            return [obj['Key'].split('/')[-1].rsplit('.', 1)[0] for obj in response['Contents'] if obj['Key'].endswith('.h5')]
        except Exception as e:
            print(f"Error fetching model names: {e}")
            return []