from crud.controller import Controller
from models.organization import Organization

class OrganizationController(Controller):
    def create_organization(self, organization: Organization, user):
        db_organization = Organization(name=organization.name, participants=[user.id], admins=[user.id])
        self.db.add(db_organization)
        self.db.commit()
        self.db.refresh(db_organization)
        return db_organization
    
    def get_organizations(self):
        return self.db.query(Organization).all()
    
    def get_organization(self, organization_id: int):
        return self.db.query(Organization).filter(Organization.id == organization_id).first()
    
    def update_organization(self, organization_id: int, organization: Organization):
        db_organization = self.db.query(Organization).filter(Organization.id == organization_id).first()
        db_organization.name = organization.name
        db_organization.participants = organization.participants
        self.db.commit()
        self.db.refresh(db_organization)
        return db_organization
    
    def join_organization(self, organization_name: str, user_id: int):
        db_organization = self.db.query(Organization).filter(Organization.name == organization_name).first()
        if user_id not in db_organization.participants: # maybe return a 409 status code
            db_organization.participants += (user_id,)
        self.db.commit()
        self.db.refresh(db_organization)
        return db_organization
    
    def delete_organization(self, organization_id: int):
        db_organization = self.db.query(Organization).filter(Organization.id == organization_id).first()
        self.db.delete(db_organization)
        self.db.commit()
        return db_organization
