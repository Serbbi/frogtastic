from enum import Enum

class Permission(str, Enum):
    CREATE_FROGS = "canCreateFrogs"
    EDIT_FROGS = "canEditFrogs"
    DELETE_FROGS = "canDeleteFrogs"
    GET_USERS = "canGetUsers"
    EDIT_USERS = "canEditUsers"
    DELETE_USERS = "canDeleteUsers"
