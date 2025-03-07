import argparse
import os
import pathlib
import pickle

from keras.models import load_model
from keras import Model
from sklearn import svm
from sklearn import metrics
import numpy as np
import cv2

from src.data_load import load_images, binarize_labels, load_corf_arrays
from src.feature_maps import feature_fusion
from src.models import Models
from src.train import five_cross_validation, train_model, leave_one_day_out
from src.visualizations import plot_data_graph


# Code Width Limit #####################################################################################################


def get_args():
    # For boolean input from the command line
    def str2bool(v):
        if v.lower() in ['yes', 'true', 't', 'y', '1']:
            return True
        elif v.lower() in ['no', 'false', 'f', 'n', '0']:
            return False
        else:
            raise argparse.ArgumentTypeError('Boolean value expected.')

    # Command line args
    parser = argparse.ArgumentParser()
    parser.add_argument('--dataset-rgb', type=str, default='',
                        help='Path to RGB dataset')
    parser.add_argument('--dataset-corf', type=str, default='',
                        help='Path to CORF dataset')
    parser.add_argument('--resize', type=int, default=128, choices=[128, 160, 192, 224],
                        help='Height of cropped input image to network')
    parser.add_argument('--num-epochs', type=int, default=20,
                        help='Number of epochs to train')
    parser.add_argument('--early-stopping', type=str2bool, default=True,
                        help="Enable/disable early stopping to force set number of epochs")
    parser.add_argument('--batch-size', type=int, default=32,
                        help='Number of images in each batch')
    parser.add_argument('--classes', type=int, default=383,
                        help='Number of images in each batch')
    parser.add_argument('--trainable', type=str2bool, default=True,
                        help='Whether to train all the layers')
    parser.add_argument('--pretrained-dataset', type=str, default='imagenet',
                        help='specify which pre-trained dataset to use')
    parser.add_argument('--include-top', type=str2bool, default=False,
                        help='specify if to use the top layer of pre-trained model')
    parser.add_argument('--learning-rate', type=float, default=0.0005,
                        help='Learning rate for the optimizer')
    parser.add_argument('--model', type=str, choices=['densenet121', 'mobilenet', 'xception'], default='densenet121',
                        help='Your pre-trained classification model of choice')
    parser.add_argument('--output-directory', type=str, required=True,
                        help='Directory for saving generated files')
    return parser.parse_args()


def single_training(dataset, fold: int, train_index, test_index, binarizelabels, compiled_model, batch_size, num_epochs,
                    model_name, model_path, feature_map, out_dir, early_stopping):
    """
    Plots data graph and returns accuracy and loss for a single model
    """
    X_train, X_test = dataset[train_index[fold]], dataset[test_index[fold]]
    y_train, y_test = binarizelabels[train_index[fold]], binarizelabels[test_index[fold]]

    model, hist, loss, accuracy, y_pred = train_model(compiled_model, X_train, y_train, batch_size, num_epochs, X_test,
                                                      y_test, model_path, early_stopping)

    pred_correct = []
    pred_false = []
    for i in range(len(y_test)):
        if y_test[i].argmax(0) == y_pred[i].argmax(0):
            pred_correct.append(test_index[fold][i])
        else:
            top_indices = np.argsort(y_pred[i])[-1:-4:-1]  # Get indices of top 3 predictions
            top_one_hot = np.zeros((len(top_indices), len(y_pred)), dtype=int)
            top_one_hot[np.arange(len(top_indices)), top_indices] = 1
            top_values = np.take(y_pred[i], top_indices)
            pred_false.append({'true_idx': test_index[fold][i],
                               'top_predictions': top_one_hot,
                               'top_values': top_values})

    plot_data_graph(hist, fold + 1, model_name, feature_map, out_dir=out_dir)
    return accuracy * 100, loss, pred_correct, pred_false


def fusion_training(dataset_rgb, dataset_corf, fold: int, train_index, test_index, binarizelabels, batch_size,
                    num_epochs, model_name, trainable, n_classes, pretrained_dataset, include_top, learning_rate,
                    input_shape, out_dir, early_stopping):
    """
    Plots data graphs and returns accuracies and losses for two models,
    as well as SVM accuracy for a fusion model
    """
    print(f'[INFO] Starting fold {fold+1}/{len(train_index)} for RGB')
    compiled_model = get_compiled_model(trainable, n_classes, pretrained_dataset,
                                        include_top, learning_rate, model_name, input_shape)
    model_rgb_path = os.path.join(out_dir, 'models', f'RGB_{fold+1}.h5')
    model_corf_path = os.path.join(out_dir, 'models', f'CORF3D_{fold+1}.h5')
    fold_accuracy_1, fold_loss_1, pred_correct, pred_false = single_training(dataset_rgb, fold, train_index, test_index,
                                                                             binarizelabels, compiled_model, batch_size,
                                                                             num_epochs, model_name, model_rgb_path,
                                                                             "RGB", out_dir, early_stopping)
    print(f'[INFO] Starting fold {fold+1}/{len(train_index)} for CORF3D')
    compiled_model = get_compiled_model(trainable, n_classes, pretrained_dataset,
                                        include_top, learning_rate, model_name, input_shape)
    fold_accuracy_2, fold_loss_2, pred_correct, pred_false = single_training(dataset_corf, fold, train_index,
                                                                             test_index, binarizelabels, compiled_model,
                                                                             batch_size, num_epochs, model_name,
                                                                             model_corf_path, "CORF3D",
                                                                             out_dir, early_stopping)

    # Convert to single column
    y_train = np.argmax(binarizelabels[train_index[fold]], axis=1)
    y_test = np.argmax(binarizelabels[test_index[fold]], axis=1)

    # trained_model_1 = get_compiled_model(trainable, n_classes, pretrained_dataset,
    #                                      include_top, learning_rate, model_name, input_shape)
    # trained_model_1.load_weights(filepath_1)
    # trained_model_2 = get_compiled_model(trainable, n_classes, pretrained_dataset,
    #                                      include_top, learning_rate, model_name, input_shape)
    # trained_model_2.load_weights(filepath_2)
    trained_model_rgb = load_model(model_rgb_path)
    trained_model_corf = load_model(model_corf_path)

    # Extract features
    model_1_feature_map = Model(trained_model_rgb.input, trained_model_rgb.layers[-2].output)
    model_2_feature_map = Model(trained_model_corf.input, trained_model_corf.layers[-2].output)

    features_train_1 = model_1_feature_map.predict(dataset_rgb[train_index[fold]])
    features_test_1 = model_1_feature_map.predict(dataset_rgb[test_index[fold]])

    features_train_2 = model_2_feature_map.predict(dataset_corf[train_index[fold]])
    features_test_2 = model_2_feature_map.predict(dataset_corf[test_index[fold]])

    combined_feature_train = feature_fusion(features_train_1, features_train_2)
    combined_feature_test = feature_fusion(features_test_1, features_test_2)

    clf = svm.SVC(kernel='linear')

    clf.fit(combined_feature_train, y_train)

    # Test the model
    y_pred = clf.predict(combined_feature_test)

    svm_accuracy = metrics.accuracy_score(y_test, y_pred)

    return {'acc': fold_accuracy_1, 'loss': fold_loss_1}, {'acc': fold_accuracy_2, 'loss': fold_loss_2}, svm_accuracy


def get_compiled_model(trainable, n_classes, pretrained_dataset, include_top, learning_rate, model_name, input_shape):
    model = Models(trainable, n_classes, pretrained_dataset, include_top, learning_rate)

    if model_name == 'densenet121':
        model.densenet121()
    elif model_name == 'mobilenet':
        model.mobilenet(input_shape)
    elif model_name == 'xception':
        model.xception()

    model.model_trainable()
    compiled_model = model.model_compile(learning_rate)
    return compiled_model


def main():
    args = get_args()

    datasets = []
    feature_map = None

    if args.dataset_rgb and args.dataset_corf:
        dataset, labels_rgb, labels_list, filenames = load_images(args.dataset_rgb, args.resize)
        datasets.append(dataset)
        binarizelabels, label_binarizer = binarize_labels(labels_rgb)
        dataset, labels_corf, labels_list, filenames = load_corf_arrays(args.dataset_corf, args.resize)
        if labels_rgb != labels_corf:
            print(labels_rgb[:10])
            print(labels_corf[:10])
            raise ValueError('RGB and CORF3D dataset labels are unequal (i.e. different order and/or length).')
        if len(datasets[0]) != len(dataset):
            raise ValueError(f'RGB ({np.shape(datasets[0])}) and CORF3D ({np.shape(dataset)}) '
                             'datasets are not the same size.')
        datasets.append(dataset)
    elif args.dataset_rgb:
        dataset, labels, labels_list, filenames = load_images(args.dataset_rgb, args.resize)
        datasets.append(dataset)
        binarizelabels, label_binarizer = binarize_labels(labels)        
        feature_map = 'RGB'
    elif args.dataset_corf:
        dataset, labels, labels_list, filenames = load_corf_arrays(args.dataset_corf, args.resize)
        datasets.append(dataset)
        binarizelabels, label_binarizer = binarize_labels(labels)
        feature_map = 'CORF'
    else:
        raise ValueError('A dataset_rgb and/or dataset_corf argument is required.')

    all_fold_accuracy = []
    all_fold_loss = []

    train_index, test_index = five_cross_validation(datasets[0], binarizelabels)

    pathlib.Path(os.path.join(args.output_directory, 'plots')).mkdir(exist_ok=True, parents=True)
    # pathlib.Path(os.path.join(args.output_directory, 'models')).mkdir(exist_ok=True, parents=True)
    pathlib.Path(os.path.join(args.output_directory, 'models_new')).mkdir(exist_ok=True, parents=True)###Change this

    input_shape = (args.resize, args.resize, 3)

    if len(datasets) == 1:
        for fold in range(len(train_index)):
            print(f'[INFO] Starting fold {fold+1}/{len(train_index)}')
            # model_path = os.path.join(args.output_directory, 'models', f'RGB_{fold+1}.h5')
            model_path = os.path.join(args.output_directory, 'models_new', f'RGB_{fold+1}.h5')
            compiled_model = get_compiled_model(args.trainable, len(labels_list), args.pretrained_dataset,
                                                args.include_top, args.learning_rate, args.model, input_shape)
            packed_tuple = single_training(datasets[0], fold, train_index, test_index, binarizelabels, compiled_model,
                                           args.batch_size, args.num_epochs, args.model, model_path, feature_map,
                                           args.output_directory, args.early_stopping)
            fold_accuracy, fold_loss, pred_correct, pred_false = packed_tuple

            # for i in pred_correct:
            #     shutil.copy2(os.path.join(os.path.dirname(__file__), "data", "Tripod", filenames[i][:-3] + "jpg"),
            #                  pred_correct_path)
            for pred_y in pred_false:
                true_filename = filenames[pred_y['true_idx']]
                pred_labels = label_binarizer.inverse_transform(pred_y['top_predictions'])
                predictions = '\n'.join([f' {pred_labels[x]}'
                                         f' {pred_y["top_values"][x]}'
                                         for x in range(len(pred_y['top_predictions']))])
                print(f'Top three predictions for "{true_filename}":\n{predictions}')
                # shutil.copy2(os.path.join(os.path.dirname(__file__), "data", "Tripod", filenames[i][:-3] + "jpg"),
                #              pred_incorrect_path)

            all_fold_accuracy.append(fold_accuracy)
            all_fold_loss.append(fold_loss)

        print('Average accuracy of Model', np.mean(all_fold_accuracy))
        print('Std accuracy of Model', np.std(all_fold_accuracy))

    else:  # mode == fusion
        all_fold_accuracy_2 = []
        all_fold_loss_2 = []
        all_fold_svm_accuracy = []
        for fold in range(len(train_index)):
            results_1, results_2, svm_accuracy = fusion_training(datasets[0], datasets[1], fold, train_index,
                                                                 test_index, binarizelabels, args.batch_size,
                                                                 args.num_epochs, args.model, args.trainable,
                                                                 len(labels_list), args.pretrained_dataset,
                                                                 args.include_top, args.learning_rate, input_shape,
                                                                 args.output_directory, args.early_stopping)

            all_fold_accuracy.append(results_1['acc'])
            all_fold_loss.append(results_1['loss'])
            all_fold_accuracy_2.append(results_2['acc'])
            all_fold_loss_2.append(results_2['loss'])

            print('Model + SVM accuracy:', svm_accuracy)

            all_fold_svm_accuracy.append(svm_accuracy * 100)

        print('Average accuracy of Model + SVM:', np.mean(all_fold_svm_accuracy))
        print('Std accuracy of Model + SVM:', np.std(all_fold_svm_accuracy))


if __name__ == '__main__':
    main()

"""
python main.py --dataset-rgb "./data/Frogs/RGB" --num-epochs 2 --resize 224 --batch-size 10 --classes 160 --learning-rate 0.0005 --model mobilenet --output-directory output
"""
