from CORF3D_ACF.extraction import extract_square
from keras.models import load_model
import cv2
import numpy as np
import pickle
import sys
import re


def retrieve_frog(image):
    if image is None:
        return None
    model = load_model('./CORF3D_ACF/output/models_clean/RGB_2.h5')
    img = cv2.resize(image, (224, 224))
    y_pred = model.predict(np.array([img]))

    pred_false = []
    top_indices = np.argsort(y_pred[0])[-1:-4:-1]  # Get indices of top 3 predictions
    top_one_hot = np.zeros((len(top_indices), 160), dtype=int)
    top_one_hot[np.arange(len(top_indices)), top_indices] = 1
    top_values = np.take(y_pred[0], top_indices)
    pred_false.append({'true_idx': 69,
                        'top_predictions': top_one_hot,
                        'top_values': top_values})

    with open('./CORF3D_ACF/output/models_clean/labeler_new.pkl', 'rb') as file:
        label_binarizer = pickle.load(file)
    for pred_y in pred_false:
                pred_labels = label_binarizer.inverse_transform(pred_y['top_predictions'])
                predictions = '\n'.join([f' {pred_labels[x]}'
                                         f' {pred_y["top_values"][x]}'
                                         for x in range(len(pred_y['top_predictions']))])
                print(f'Top three predictions:\n{predictions}')
    
    return predictions


def extract_image(image):
    needs_flipping = {}

    try:
        extraction_image, flip = extract_square(image=image)
        needs_flipping["image_name"] = flip # changed from image which was before the name of the image
        return extraction_image
    except (ValueError, cv2.error) as e:
        print(f'Encountered an exception during extraction of previous image:\n{e}', file=sys.stderr)

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
            