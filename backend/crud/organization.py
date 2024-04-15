from crud.controller import Controller
from models.organization import Organization

class OrganizationController(Controller):
    def create_organization(self, organization: Organization):
        db_organization = Organization(name=organization.name, participants=organization.participants)
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
    
    def delete_organization(self, organization_id: int):
        db_organization = self.db.query(Organization).filter(Organization.id == organization_id).first()
        self.db.delete(db_organization)
        self.db.commit()
        return db_organization
