from keras.models import load_model
import cv2
import numpy as np
import pickle
import os
import sys
from CORF3D_ACF.extraction import extract_square


def retrieve_frog(image_path):
    model = load_model('./CORF3D_ACF/output/models/RGB_5.h5')
    img = cv2.imread(image_path, 3)
    img = cv2.resize(img, (224, 224))
    y_pred = model.predict(np.array([img]))

    pred_false = []
    top_indices = np.argsort(y_pred[0])[-1:-4:-1]  # Get indices of top 3 predictions
    top_one_hot = np.zeros((len(top_indices), 160), dtype=int)
    top_one_hot[np.arange(len(top_indices)), top_indices] = 1
    top_values = np.take(y_pred[0], top_indices)
    pred_false.append({'true_idx': 69,
                        'top_predictions': top_one_hot,
                        'top_values': top_values})

    with open('./CORF3D_ACF/labeler.pkl', 'rb') as file:
        label_binarizer = pickle.load(file)
    for pred_y in pred_false:
                pred_labels = label_binarizer.inverse_transform(pred_y['top_predictions'])
                predictions = '\n'.join([f' {pred_labels[x]}'
                                         f' {pred_y["top_values"][x]}'
                                         for x in range(len(pred_y['top_predictions']))])
                print(f'Top three predictions for "{image_path}":\n{predictions}')
    
    return predictions


def extract_image(image):
    needs_flipping = {}
    folder = "./uploaded images"

    full_path = os.path.join(folder, image)
    try:
        extraction_image, flip = extract_square(full_path, progress_path='./progress')
        needs_flipping[image] = flip
        cv2.imwrite(os.path.join(folder, "extraction.png"), extraction_image)
    except (ValueError, cv2.error) as e:
        print(f'Encountered an exception during extraction of \"{full_path}\":\n{e}', file=sys.stderr)
        