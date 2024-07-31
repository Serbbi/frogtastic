from crud.controller import Controller
from models.organization import Organization
from models.user import User
from sqlalchemy.orm.attributes import flag_modified


class OrganizationController(Controller):
    def create_organization(self, organization: Organization, user):
        db_organization = Organization(name=organization.name, participants=[user.id], admins=[user.id], table_columns=organization.table_columns)
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
        db_organization.table_columns = organization.table_columns
        self.db.commit()
        self.db.refresh(db_organization)
        return db_organization
    
    def join_organization(self, organization_name: str, user_id: int):
        db_organization = self.db.query(Organization).filter(Organization.name == organization_name).first()
        if user_id not in db_organization.participants: # maybe return a 409 status code
            db_organization.participants += (user_id,)

        db_user = self.db.query(User).filter(User.id == user_id).first()
        if db_organization.id not in db_user.organizations:
            db_user.organizations += (db_organization.id,)
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
    
    def create_table_columns(self, organization_id: int, table_columns: list):
        db_organization = self.db.query(Organization).filter(Organization.id == organization_id).first()
        db_organization.table_columns += table_columns
        flag_modified(db_organization, "table_columns")
        self.db.commit()
        self.db.refresh(db_organization)
        return db_organization

    def delete_table_columns(self, organization_id: int, table_columns: list):
        db_organization = self.db.query(Organization).filter(Organization.id == organization_id).first()
        for column in table_columns:
            if column in db_organization.table_columns:
                print('found it')
                db_organization.table_columns.remove(column)

        flag_modified(db_organization, "table_columns")
        self.db.commit()
        self.db.refresh(db_organization)
        return db_organization