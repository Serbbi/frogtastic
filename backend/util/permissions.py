from enum import Enum

class Permission(str, Enum):
    CREATE_FROGS = "canCreateFrogs"
    EDIT_FROGS = "canEditFrogs"
    DELETE_FROGS = "canDeleteFrogs"
    GET_USERS = "canGetUsers"
    EDIT_USERS = "canEditUsers"
    DELETE_USERS = "canDeleteUsers"
    CREATE_ORGANIZATION = "canCreateOrganization"
    DELETE_ORGANIZATION = "canDeleteOrganization"
    ADD_ML_MODELS = "canAddMLModels"
    REMOVE_ML_MODELS = "canRemoveMLModels"
