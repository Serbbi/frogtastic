from collections import Counter
import json
import os
import re

import cv2
import matplotlib.pyplot as plt
import numpy as np

from extraction import extract_from_line
from util import filename_to_label, fix_tank10


RE_FILENAME = re.compile(
    r"(?P<date>\d{6})_frog(?P<frog>\d\d?)_tank(?P<tank>\d\d?)"
    r"_[A-Z]+_(?P<phone>[^_]+)_trip(od)?(\(\d+\))*\.png"
)


def sample_dist():
    path = os.path.join("..", "extractions", "automated-rgb")
    counter = {}
    for file in os.listdir(path):
        if os.path.splitext(file)[1] != ".png":
            continue
        label = fix_tank10(filename_to_label(file))
        if label in counter:
            counter[label] += 1
        else:
            counter[label] = 1
    total_groups = {}
    min_files = None
    max_files = None
    for label, n_files in counter.items():
        if (not min_files) or n_files < min_files:
            min_files = n_files
        if (not max_files) or n_files > max_files:
            max_files = n_files
        if n_files in total_groups:
            total_groups[n_files] += 1
            # if total_groups[n_files] > 10:
            #     print(label)
        else:
            total_groups[n_files] = 1
    # print(total_groups)
    bar_coords = np.arange(min_files, max_files + 1)
    heights = np.zeros(max_files + 1 - min_files, dtype=np.uint8)
    for group, total in total_groups.items():
        heights[group - min_files] = total
    plt.bar(bar_coords, heights, width=1.0, edgecolor="black")
    plt.xlabel("Number of Samples")
    plt.ylabel("Number of Frogs")
    plt.tight_layout()
    plt.savefig("../../plots/Sample Distribution Unsupervised.png")
    plt.close()


def phone_dist():
    path = os.path.join("..", "extractions", "automated-rgb")
    phones = []
    for file in os.listdir(path):
        match = RE_FILENAME.match(file)
        if not match:
            continue
        phones.append(match["phone"])
    phone_totals = sorted(Counter(phones).items(), key=lambda x: x[1], reverse=True)
    plt.bar(range(len(phone_totals)), [x[1] for x in phone_totals])
    plt.xticks(
        range(len(phone_totals)), [x[0] for x in phone_totals], rotation=30, ha="right"
    )
    plt.ylabel("Number of Images")
    plt.tight_layout()
    plt.savefig("../../plots/Phone Distribution Unsupervised.png")
    plt.close()


def phones_per_frog():
    frog_phones = {}
    path = os.path.join("..", "extractions", "automated-rgb")
    for file in os.listdir(path):
        match = RE_FILENAME.match(file)
        if not match:
            print(file)
            continue
        lbl = fix_tank10(f"frog{match['frog']}_tank{match['tank']}")
        if lbl in frog_phones:
            frog_phones[lbl].add(match["phone"])
        else:
            frog_phones[lbl] = {match["phone"]}
    phones_frogs = {}  # type: typing.Dict
    for frog, phones in frog_phones.items():
        n_phones = len(phones)
        if n_phones in phones_frogs:
            phones_frogs[n_phones] += 1
        else:
            phones_frogs[n_phones] = 1

    phones_frogs = sorted(phones_frogs.items(), key=lambda x: x[0])  # type: typing.List[typing.Tuple[int,int]]
    bar_coords = np.arange(phones_frogs[0][0], phones_frogs[-1][0] + 1)
    plt.bar(bar_coords, [x[1] for x in phones_frogs])
    plt.xticks(bar_coords)
    plt.xlabel("Number of Phones")
    plt.ylabel("Number of Frogs")
    plt.tight_layout()
    plt.savefig("../../plots/Phones Per Frog Unsupervised.png")
    plt.close()


def n_frogs():
    frogs = set()
    path = os.path.join("..", "extractions", "automated-rgb")
    tanks = [None] * 10
    for file in os.listdir(path):
        match = RE_FILENAME.match(file)
        if not match:
            print(file)
            continue
        frogs.add(f"{match['frog']}_{match['tank']}")
        tank = int(match["tank"]) - 1
        if tanks[tank] is None:
            tanks[tank] = {match["frog"]}
        else:
            tanks[tank].add(match["frog"])
    print(len(frogs))
    for i, f in enumerate(tanks):
        print(f"Tank {i+1} has {len(f)} frogs.")


def find_missing():
    files_done = []
    with open("../head_tail_coords/coords.json", "r") as f:
        data = json.load(f)
    files_done.extend(x["name"] for x in data)
    with open("../head_tail_coords/coords2.json", "r") as f:
        data = json.load(f)
    files_done.extend(x["name"] for x in data)
    files_missing = []
    for file in os.listdir("../data/Tripod/"):
        if os.path.splitext(file)[1].lower() != ".heic" and file not in files_done:
            files_missing.append(file)
    with open("../head_tail_coords/missing.json", "w") as f:
        json.dump(files_missing, f)


def progress_images():
    with open("../head_tail_coords/coords_merge.json", "r") as f:
        data = json.load(f)
    frog = data[100]
    print(frog["name"])
    in_path = "../data/Tripod/"
    out_path = "../../plots/"
    im_eq = extract_from_line(
        os.path.join(in_path, frog["name"]),
        frog["head"],
        frog["tail"],
        progress_path=out_path,
    )
    cv2.imwrite(
        os.path.join(out_path, os.path.splitext(frog["name"])[0] + "_eq.png"), im_eq
    )


def main():
    plt.rcParams.update({"font.size": 22})
    sample_dist()
    # phone_dist()
    phones_per_frog()


if __name__ == "__main__":
    main()
