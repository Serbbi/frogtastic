import json
import re

RE_FROG_TANK = re.compile(r'(?P<frog>frog\d+)_(?P<tank>tank\d+)')


def merge_coords():
    with open("head_tail_coords/coords.json", "r") as f:
        data = json.load(f)
    for i, frog in enumerate(data):
        frog['head'] = [frog['x'][0], frog['y'][0]]
        frog['tail'] = [frog['x'][1], frog['y'][1]]
        del frog['x']
        del frog['y']
        data[i] = frog
    with open("head_tail_coords/coords2.json", "r") as f:
        data.extend(json.load(f))
    with open("head_tail_coords/coords3.json", "r") as f:
        data.extend(json.load(f))
    with open("head_tail_coords/coords_merge.json", "w") as f:
        json.dump(data, f)


def filename_to_label(filename: str):
    match = RE_FROG_TANK.search(filename)
    return f'{match["frog"]}_{match["tank"]}'  # frogX_tankX


def fix_tank10(file):
    if "frog1_tank10" in file:
        return file.replace("frog1_tank10", "frog19_tank3")
    elif "frog3_tank10" in file:
        return file.replace("frog3_tank10", "frog9_tank3")
    elif "frog8_tank10" in file:
        return file.replace("frog8_tank10", "frog7_tank3")
    elif "frog9_tank10" in file:
        return file.replace("frog9_tank10", "frog20_tank3")
    return file
