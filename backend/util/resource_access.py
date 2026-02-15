from typing import Iterable

def get_resource_org_ids(resource) -> Iterable[int]:
    """
    Extract organization ownership from any model.
    """

    if isinstance(resource, list):
        org_ids = set()
        for item in resource:
            org_ids.update(get_resource_org_ids(item))
        return org_ids

    # Resource belongs to many orgs
    if hasattr(resource, "organizations"):
        return resource.organizations

    # Resource belongs to one org
    if hasattr(resource, "organization_id"):
        return [resource.organization_id]

    raise ValueError(f"Resource {type(resource)} has no organization ownership defined")
