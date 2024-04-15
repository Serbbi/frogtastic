from crud.controller import Controller
from models.tank import Tank


class TankController(Controller):
    def get_tanks(self):
        return self.db.query(Tank).all()
    
    def get_tank(self, tank_id: int):
        return self.db.query(Tank).filter(Tank.id == tank_id).first()
    
    def create_tank(self, tank: Tank):
        db_tank = Tank(tank_name=tank.tank_name, organization_id=tank.organization_id, frog_ids=tank.frog_ids, dict=tank.dict)
        self.db.add(db_tank)
        self.db.commit()
        self.db.refresh(db_tank)
        return db_tank
    
    def update_tank(self, tank_id: int, tank: Tank):
        db_tank = self.db.query(Tank).filter(Tank.id == tank_id).first()
        db_tank.tank_name = tank.tank_name
        db_tank.organization_id = tank.organization_id
        db_tank.frog_ids = tank.frog_ids
        db_tank.dict = tank.dict
        self.db.commit()
        self.db.refresh(db_tank)
        return db_tank
    
    def delete_tank(self, tank_id: int):
        db_tank = self.db.query(Tank).filter(Tank.id == tank_id).first()
        self.db.delete(db_tank)
        self.db.commit()
        return db_tank