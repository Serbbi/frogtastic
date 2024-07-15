import argparse
import os
import pathlib

import matplotlib.pyplot as plt
import numpy as np
import scipy.io

from src.feature_maps import corf_feature_maps, feature_stack, feature_normalization


def get_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("input_directory", type=str,
                        help="Path to directory containing all images (no subdirectories)")
    parser.add_argument("output_directory", type=str,
                        help="Path to directory to save all extraction images")
    parser.add_argument("-s", "--sigma", type=float, default=2.2, help="Sigma value for contour mapping")
    return parser.parse_args()


def extraction_to_corf():
    corf_path = os.path.join("data", "Frogs", "Corfed")
    # corf_path = os.path.join("extractions", "line-centre-corf")
    out_path = os.path.join("..", "plots", "misclassifications")
    image = "220729_frog15_tank1_DT_MiMix2_tripod(2).png"
    filenames = np.load(os.path.join(corf_path, "labels.npz"))['data']
    idx = np.nonzero(filenames == image)[0][0]

    # for inh, corf_file in zip(["00"], ["corf_0.0.npz"]):
    #     data = np.load(os.path.join(corf_path, corf_file), allow_pickle=True)['data']
    #     plt.imsave(os.path.join(out_path, f"{os.path.splitext(image)[0]}_{inh}.png"), data[idx])
    for inh, corf_file in zip(["00", "18", "36"], ["corf_0.0.npz", "corf_1.8.npz", "corf_3.6.npz"]):
        data = np.load(os.path.join(corf_path, corf_file), allow_pickle=True)['data']
        plt.imsave(os.path.join(out_path, f"{os.path.splitext(image)[0]}_{inh}.png"), data[idx])


def plot_corf():
    true = []
    out_path = "../plots/misclassifications/corf-xception/"
    for img in os.listdir(out_path):
        true.append(img[7:])
    corf_path = os.path.join("extractions", "line-centre-corf")
    corf_00 = os.path.join(corf_path, "corf_0.0.npz")
    corf_18 = os.path.join(corf_path, "corf_1.8.npz")
    corf_36 = os.path.join(corf_path, "corf_3.6.npz")
    # true = ["220729_frog15_tank1_DT_OnePlusX_trip.png", "221207_frog7_tank10_DT_OnePlusX_trip(2).png",
    #         "221205_frog9_tank9_DT_OnePlusX_trip(2).png", "221125_frog12_tank6_DT_OnePlusX_trip(2).png",
    #         "221207_frog10_tank10_DT_OnePlusX_trip.png"]
    # pred = ["220802_frog2_tank2_DT_MiMix2_trip(3).png", "221206_frog15_tank9_EV_Samsung_trip.png",
    #         "221201_frog16_tank8_EV_Samsung_trip.png", "221205_frog9_tank9_EV_Samsung_trip.png",
    #         "220729_frog17_tank1_JLK_iPhoneSE_trip.png"]
    true_rgb = ["220801_frog2_tank2_DT_OnePlusX_trip.png", "221125_frog11_tank6_DT_OnePlusX_trip.png",
                "220804_frog13_tank3_DT_OnePlusX_trip.png", "221207_frog7_tank10_DT_OnePlusX_trip(2).png"]
    pred_rgb = ["frog10_tank4", "frog6_tank6", "frog1_tank9", "frog7_tank8"]
    in_file = os.path.join(corf_path, "labels.npz")
    filenames = np.load(in_file)['data']

    true_indices = []
    pred_indices = []

    for t in true:
        pred_indices.append(np.nonzero(filenames == t)[0][0])
    for inh, folder in zip(["36"], [corf_36]):
        data = np.load(folder)['data']
        for i, t in enumerate(true):
            # plt.imsave(f"../plots/misclassifications/corf-densenet/{i+1}-true-{os.path.splitext(t)[0]}_{inh}.png",
            #            data[true_indices[i]])
            plt.imsave(os.path.join(out_path, f"{i+1}-true-{os.path.splitext(t)[0]}_{inh}.png"),
                       data[pred_indices[i]])
    # plt.title(filenames[0] + " (IF=0.0)")
    # plt.imsave(f"../plots/corf/{os.path.splitext(filenames[0])[0]}_00.png", data[0])
    # plt.close()
    # data = np.load(corf_18)['data']
    # plt.imsave(f"../plots/corf/{os.path.splitext(filenames[0])[0]}_18.png", data[0])
    # plt.title(filenames[0] + " (IF=1.8)")
    # plt.close()
    # data = np.load(corf_36)['data']
    # plt.imsave(f"../plots/corf/{os.path.splitext(filenames[0])[0]}_36.png", data[0])
    # plt.title(filenames[0] + " (IF=3.6)")
    # plt.close()


def plot_corf_examples():
    filenames_mat = scipy.io.loadmat(os.path.join("/scratch/s3460509/extractions/assisted-corf-sigma-5-00/",
                                                  "labels.mat"))
    if "d" in filenames_mat:
        filenames = [x[0][0][0] for x in filenames_mat['d']]
    else:
        filenames = [x[0] for x in filenames_mat['files'][0]]
    for i, filename_ext in enumerate(filenames):
        if filename_ext in ["221207_frog7_tank10_DT_OnePlusX_trip(2).png", "221207_frog7_tank10_EV_Samsung_trip.png"]:
            data = scipy.io.loadmat("/scratch/s3460509/extractions/assisted-corf-sigma-5-00/corf_0.0.mat")['arrout']
            filename = os.path.splitext(filename_ext)[0]
            plt.imsave(filename + "-5.0-0.0.png", data[i])
            plt.close()
            data = scipy.io.loadmat("/scratch/s3460509/extractions/assisted-corf-sigma-5-00/corf_1.8.mat")['arrout']
            plt.imsave(filename + "-5.0-1.8.png", data[i])
            plt.close()
            data = scipy.io.loadmat("/scratch/s3460509/extractions/assisted-corf-sigma-5-00/corf_3.6.mat")['arrout']
            plt.imsave(filename + "-5.0-3.6.png", data[i])
            plt.close()


def main():
    args = get_args()

    pathlib.Path(args.output_directory).mkdir(parents=True, exist_ok=True)

    # [0.0, 1.8, 3.6]
    for inhibition_factor in [0.0, 1.8, 3.6]:
        print(f'Calculating CORF feature maps for inhibition factor {inhibition_factor} and sigma {args.sigma:.1f}...')
        corf_feature_set = corf_feature_maps(args.input_directory, args.sigma, 4, inhibition_factor, 0.005)
        print(corf_feature_set.shape)
        corf_feature_set_norm = feature_normalization(corf_feature_set)
        print(corf_feature_set_norm.shape)
        out_file = os.path.join(args.output_directory, f'corf_{inhibition_factor:.1f}')
        np.savez_compressed(out_file, data=corf_feature_set_norm)
        print(f'Saved in \"{out_file}.npz\"')
        

    labels = [x for x in os.listdir(args.input_directory) if os.path.splitext(x)[1] == ".png"]
    np.savez_compressed(os.path.join(args.output_directory, "labels"), data=np.asarray(labels))


if __name__ == '__main__':
    main()
