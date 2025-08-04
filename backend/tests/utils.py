from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from models.frog import Frog
from models.tank import Tank
from models.organization import Organization
from models.user import User

class TestDatabase:
    def __init__(self, session: Session):
        self.session = session
        
    def populate_test_database(self):
        frog_1 = Frog(
            frog_number=1,
            tank_id=1,
            current_tank_id=1,
            attributes={"color": "green", "size": "medium"},
            organization_id=1,
            history={"last_injection": "2024-02-16", "egg_quality": None, "is_laying_eggs": True, "last_priming": None},
            image_path="path/to/image.jpg"
        )
        
        frog_2 = Frog(
            frog_number=2,
            tank_id=4,
            current_tank_id=1,
            attributes={"color": "green", "size": "medium"},
            organization_id=1,
            history={"last_injection": "2024-02-16", "egg_quality": None, "is_laying_eggs": True, "last_priming": None},
            image_path="path/to/image.jpg"
        )
        
        frog_3 = Frog(
            frog_number=13,
            tank_id=11,
            current_tank_id=2,
            attributes={"color": "green", "size": "medium"},
            organization_id=1,
            history={"last_injection": "2024-02-16", "egg_quality": None, "is_laying_eggs": True, "last_priming": None},
            image_path="path/to/image.jpg"
        )

        frog_4 = Frog(
            frog_number=14,
            tank_id=11,
            current_tank_id=2,
            attributes={"color": "green", "size": "medium"},
            organization_id=2,
            history={"last_injection": "2024-02-16", "egg_quality": None, "is_laying_eggs": True, "last_priming": None},
            image_path="path/to/image.jpg"
        )
        tank_1 = Tank(
            tank_name="Tank 1",
            organization_id=1
        )
        tank_2 = Tank(
            tank_name="Tank 2",
            organization_id=1
        )
        organization_1 = Organization(
            name="Test Organization",
            participants = [1, 2, 3],
            admins = [1],
            table_columns=["column1", "column2"],
            system_parameter_names=["param1", "param2"],
            system_parameters={"param1": "value1", "param2": "value2"}
        )

        organization_2 = Organization(
            name="Test Organization 2",
            participants = [2],
            admins = [2],
            table_columns=["column1", "column2"],
            system_parameter_names=["param1", "param2"],
            system_parameters={"param1": "value1", "param2": "value2"}
        )

        user_1 = User(
            username="elena",
            hashed_password="$2b$12$ZOul9f4nNPGOiqk9JAIQxOuCpe5e5yxsJdyAE6FQls3tgc7DIRhla",
            email="e.tret@student.rug.nl",
            attributes={
                "general_privileges": {
                    "canCreateOrganization": True,
                    "canGetUsers": True,
                    "canEditUsers": True,
                    "canDeleteUsers": True
                },
                "1": {
                    "canCreateFrogs": True,
                    "canEditFrogs": True,
                    "canDeleteFrogs": True,
                    "canRetrainModel": True,
                    "canGetUsers": True,
                    "canEditUsers": True,
                    "canDeleteUsers": True
                }
            },
            organizations=[1]
        )
        self.session.add_all([organization_1, organization_2])
        self.session.commit()
        self.session.add(user_1)
        self.session.commit()
        self.session.add_all([tank_1, tank_2])
        self.session.commit()
        self.session.add_all([frog_1, frog_2, frog_3, frog_4])
        self.session.commit()

def override_get_db():
    test_engine = create_engine("postgresql://postgres:frog4life@localhost:5432/testing")
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()