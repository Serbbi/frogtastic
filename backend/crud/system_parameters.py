from crud.controller import Controller
from models.system_parameters import SystemParameters
from schemas.system_parameters import SystemParametersRequest
from typing import Union, List
from fastapi.responses import StreamingResponse
import io
import csv as csv_lib
import pandas as pd


class SystemParametersController(Controller):
    def create_system_parameters_for_organization(self, organization_id: int, system_parameters: dict):
        system_params_db = SystemParameters(organization_id=organization_id, values=system_parameters)
        self.db.add(system_params_db)
        self.db.commit()
        self.db.refresh(system_params_db)

        return system_params_db
    
    def get_system_parameters(self, org_id: int = None):
        query = self.db.query(SystemParameters)

        if org_id:
            query = query.filter(SystemParameters.organization_id == org_id)

        system_params = query.all()

        return system_params
    
    def update_system_parameters(self, new_system_parameters: List[SystemParametersRequest]):
        for new_param in new_system_parameters:
            existing_param = (
                self.db.query(SystemParameters)
                .filter(SystemParameters.id == new_param.id)
                .first()
            )

            if existing_param:
                if new_param.values is not None:
                    existing_param.values = new_param.values

                if new_param.recorded_at is not None:
                    existing_param.recorded_at = new_param.recorded_at

        self.db.commit()
        return {"message": "System parameters updated successfully."}
    
    def delete_system_parameter(self, system_params_id: int):
        db_system_param = self.db.query(SystemParameters).filter(SystemParameters.id == system_params_id).first()

        if not db_system_param:
            return None
        
        self.db.delete(db_system_param)
        self.db.commit()
        return db_system_param
    
    def delete_system_parameters(self, system_params_ids: List[int]):
        db_system_params = self.db.query(SystemParameters).filter(SystemParameters.id.in_(system_params_ids)).all()

        if not db_system_params:
            return None
        
        for param in db_system_params:
            self.db.delete(param)
        
        self.db.commit()
        return db_system_params
    
    def download_system_parameters(self, organization_id: int):
        rows = (
            self.db.query(SystemParameters)
            .filter(SystemParameters.organization_id == organization_id)
            .all()
        )

        data = []
        for row in rows:
            entry = {
                "recorded_at": row.recorded_at,
                **(row.values or {})
            }
            data.append(entry)

        df = pd.DataFrame(data)
        df = df.sort_values("recorded_at")

        csv = df.to_csv(
            index=False,
            sep=";",
            quoting=csv_lib.QUOTE_MINIMAL
        )

        return StreamingResponse(
            io.BytesIO(csv.encode()),
            media_type="text/csv",
            headers={
                "Content-Disposition": "attachment; filename=system_parameters.csv"
            },
        )
    
    def update_list_values_existing(self, organization_id: int, new_parameters: list):
        existing_params = (
            self.db.query(SystemParameters)
            .filter(SystemParameters.organization_id == organization_id)
            .all()
        )

        new_keys = set(new_parameters)

        for row in existing_params:
            current_values = row.values or {}

            # Keep only keys that are still valid
            updated_values = {
                key: current_values.get(key, "")
                for key in new_keys
            }

            row.values = updated_values
            print(updated_values)

        self.db.commit()
        return {"message": "List values updated successfully."}