from cachetools import LRUCache
from crud.ml_model import MLModelController
import threading
from dataclasses import dataclass
import tensorflow as tf
from typing import Any
import tempfile
import pickle

@dataclass
class CachedMLModel:
    model: tf.keras.Model
    labeler: Any


cache_lock = threading.Lock()

def init():
    global model_cache
    model_cache = LRUCache(maxsize=5)


def _cache_key(model_name: str, organization_id: int) -> str:
    return f"{organization_id}:{model_name}"


def get_model(model_name: str, organization_id: int) -> CachedMLModel:
    key = _cache_key(model_name, organization_id)

    if key in model_cache:
        return model_cache[key]
    
    with cache_lock:
        if key in model_cache:
            return model_cache[key]

        controller = MLModelController()
        data = controller.get_ml_model(model_name, organization_id)

        if not data:
            return None
        
        with tempfile.NamedTemporaryFile(suffix=".h5") as tmp:
            tmp.write(data["model"])
            tmp.flush()
            model = tf.keras.models.load_model(tmp.name)

        labeler = pickle.loads(data["labeler"])

        cached = CachedMLModel(
            model=model,
            labeler=labeler,
        )

        model_cache[key] = cached
        return cached


def get_all_cached_models() -> dict:
    return model_cache