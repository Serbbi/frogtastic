from fastapi import HTTPException
from CORF3D_ACF.extraction import extract_square
from util.globals import get_model
import cv2
import numpy as np
import sys
import re

def retrieve_frog(image, model_name, organization_id):
    if image is None or model_name is None or organization_id is None:
        return None

    cached = get_model(model_name, organization_id)
    if not cached:
        raise HTTPException(status_code=404, detail="Model not found")
    
    model = cached.model
    labeler = cached.labeler

    img = cv2.resize(image, (224, 224))
    y_pred = model.predict(np.array([img]))

    pred_false = []
    top_indices = np.argsort(y_pred[0])[-1:-4:-1]  # Get indices of top 3 predictions
    top_one_hot = np.zeros((len(top_indices), 160), dtype=int)
    top_one_hot[np.arange(len(top_indices)), top_indices] = 1
    top_values = np.take(y_pred[0], top_indices)
    pred_false.append(
        {"true_idx": 69, "top_predictions": top_one_hot, "top_values": top_values}
    )

    for pred_y in pred_false:
        pred_labels = labeler.inverse_transform(pred_y["top_predictions"])
        predictions = "\n".join(
            [
                f" {pred_labels[x]} {pred_y['top_values'][x]}"
                for x in range(len(pred_y["top_predictions"]))
            ]
        )
        print(f"Top three predictions:\n{predictions}")

    return predictions


def extract_image(image):
    needs_flipping = {}

    try:
        extraction_image, flip = extract_square(image=image) #, progress_path="progress")
        needs_flipping["image_name"] = (
            flip  # changed from image which was before the name of the image
        )
        return extraction_image
    except (ValueError, cv2.error) as e:
        print(
            f"Encountered an exception during extraction of previous image:\n{e}",
            file=sys.stderr,
        )

    return None


def extract_frog_and_tank(prediction_string):
    pattern = r"frog(\d+)_tank(\d+)"
    match = re.search(pattern, prediction_string)

    if match:
        frog_number = int(match.group(1))
        tank_number = int(match.group(2))
    else:
        frog_number = 0
        tank_number = 0

    return frog_number, tank_number
