from cachetools import LRUCache
from crud.ml_model import MLModelController
# import threading
from dataclasses import dataclass

@dataclass
class CachedMLModel:
    model_bytes: bytes
    labeler_bytes: bytes

def init():
    global model_cache
    model_cache = LRUCache(maxsize=5)


def _cache_key(model_name: str, organization_id: int) -> str:
    return f"{organization_id}:{model_name}"


def get_model(model_name: str, organization_id: int) -> CachedMLModel:
    key = _cache_key(model_name, organization_id)

    if key in model_cache:
        return model_cache[key]

    controller = MLModelController()
    data = controller.get_ml_model(model_name, organization_id)

    if not data:
        return None

    cached = CachedMLModel(
        model_bytes=data["model"],
        labeler_bytes=data["labeler"],
    )

    model_cache[key] = cached
    return cached


def get_all_cached_models() -> dict:
    return model_cache