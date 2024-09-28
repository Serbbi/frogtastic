from crud.controller import Controller
from models.organization import Organization
from models.user import User
from sqlalchemy.orm.attributes import flag_modified

class OrganizationController(Controller):
    def create_organization(self, organization: Organization, user):
        db_organization = Organization(name=organization.name, participants=[user.id], admins=[user.id], table_columns=organization.table_columns, system_parameters={}, system_parameter_names=organization.system_parameter_names)
        self.db.add(db_organization)
        self.db.commit()
        self.db.refresh(db_organization)

        db_user = self.db.query(User).filter(User.id == user.id).first()
        if(db_user.organizations == None):
            db_user.organizations = []
        db_user.organizations += (db_organization.id,)
        db_user.attributes[db_organization.id] = privileges_config(is_admin=True)
        flag_modified(db_user, "organizations")
        flag_modified(db_user, "attributes")
        self.db.commit()
        self.db.refresh(db_user)
        return db_organization
    
    def get_organizations(self):
        return self.db.query(Organization).all()
    
    def get_organization(self, organization_id: int):
        return self.db.query(Organization).filter(Organization.id == organization_id).first()
    
    def update_organization(self, organization_id: int, organization: Organization):
        db_organization = self.db.query(Organization).filter(Organization.id == organization_id).first()
        db_organization.name = organization.name
        db_organization.participants = organization.participants
        db_organization.table_columns = organization.table_columns
        db_organization.admins = organization.admins
        db_organization.system_parameters = organization.system_parameters
        db_organization.system_parameter_names = organization.system_parameter_names
        self.db.commit()
        self.db.refresh(db_organization)
        return db_organization
    
    def join_organization(self, organization_id: int, user_id: int):
        db_organization = self.db.query(Organization).filter(Organization.id == organization_id).first()
        if user_id not in db_organization.participants: # maybe return a 409 status code
            db_organization.participants += (user_id,)

        db_user = self.db.query(User).filter(User.id == user_id).first()
        if db_organization.id not in db_user.organizations:
            db_user.organizations += (db_organization.id,)
        db_user.attributes[db_organization.id] = privileges_config()
        flag_modified(db_user, "attributes")
        flag_modified(db_user, "organizations")
        
        self.db.commit()
        self.db.refresh(db_organization)
        self.db.refresh(db_user)
        return db_organization
    
    def delete_organization(self, organization_id: int):
        db_organization = self.db.query(Organization).filter(Organization.id == organization_id).first()
        self.db.delete(db_organization)
        self.db.commit()
        return db_organization
    

def privileges_config(is_admin: bool = False):
    return {
    "canCreateFrogs": is_admin,
    "canEditFrogs": is_admin,
    "canDeleteFrogs": is_admin,
    "canRetrainModel": is_admin,
    "canGetUsers": is_admin,
    "canEditUsers": is_admin,
    "canDeleteUsers": is_admin,
}