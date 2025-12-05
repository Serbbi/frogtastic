from CORF3D_ACF.extraction import extract_square
from keras.models import load_model
import cv2
import numpy as np
import pickle
import sys
import re
import os

def retrieve_frog(image, model_id, organization_id):
    if image is None or model_id is None or organization_id is None:
        return None
    
    # Check for directory matching organization_id
    if not os.path.isdir(f"./CORF3D_ACF/output/org_{organization_id}"):
        print(f"Organization ID {organization_id} not found.", file=sys.stderr)
        return None
    
    model_folders = [
        "models/RGB_5.h5",
        "models_clean/RGB_2.h5",
        "models_new/RGB_5.h5",
        "models_oneshot/RGB_4.h5",
        "models_notri_oneshot/RGB_1.h5",
        "models_notri_oneshot_new/RGB_1.h5",
        "models_oneshot_v2/RGB_5.h5",
        "models_clean_half/clean_half.h5",
        "models_clean_half_short/clean_half_short.h5",
    ]
    model = load_model(f"./CORF3D_ACF/output/org_{organization_id}/{model_folders[model_id]}")
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

    with open(
        f"./CORF3D_ACF/output/org_{organization_id}/{model_folders[model_id].split('/')[0]}/labeler.pkl", "rb"
    ) as file:
        label_binarizer = pickle.load(file)
    for pred_y in pred_false:
        pred_labels = label_binarizer.inverse_transform(pred_y["top_predictions"])
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
        extraction_image, flip = extract_square(image=image, progress_path="progress")
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
