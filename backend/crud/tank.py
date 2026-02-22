from crud.controller import Controller
from models.tank import Tank
from sqlalchemy.orm.attributes import flag_modified


class TankController(Controller):
    def get_tanks(self, org_q: int = None):
        if org_q:
            return self.db.query(Tank).filter(Tank.organization_id == org_q).all()
        return self.db.query(Tank).all()
    
    
    def get_tank(self, tank_id: int):
        return self.db.query(Tank).filter(Tank.id == tank_id).first()
    
    
    def create_tank(self, tank: Tank):
        db_tank = Tank(tank_name=tank.tank_name, organization_id=tank.organization_id)
        self.db.add(db_tank)
        self.db.commit()
        self.db.refresh(db_tank)
        return db_tank
    
    
    def update_tank(self, tank_id: int, tank: Tank):
        print(f"Updating tank with ID: {tank_id} with data: {tank}")
        db_tank = self.db.query(Tank).filter(Tank.id == tank_id).first()
        if db_tank is None:
            return None
        db_tank.tank_name = tank.tank_name
        self.db.commit()
        self.db.refresh(db_tank)
        return db_tank
    
    
    def delete_tank(self, tank_id: int):
        db_tank = self.db.query(Tank).filter(Tank.id == tank_id).first()
        if db_tank is None:
            return None
        self.db.delete(db_tank)
        self.db.commit()
        return db_tank
    

    def delete_tanks_by_organization(self, organization_id: int):
        tanks = self.db.query(Tank).filter(Tank.organization_id == organization_id).all()
        for tank in tanks:
            self.db.delete(tank)
        
        self.db.commit()
        return {"message": "Tanks deleted successfully"}
