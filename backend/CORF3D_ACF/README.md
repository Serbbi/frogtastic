# CORF3D contour maps with application to African clawed frog recognition using RGB and thermal images

This is a modified README of the one from the CORF3D HCR project: https://github.com/ameybhole/CORF3D_HCR

#### Summary

* [Getting Started](#Getting-started)
* [Repository Structure](#Repository-Structure)
* [Running Experiments](#Running-Experiments)

## Getting started

In order to run this repository, we advise you to install python 3.6.

Create a new environment and install requirements on it:

```bash
$ pip install -r requirements.txt
```

Install MATLAB Engine API for Python:

```bash
$ cd "matlabroot\extern\engines\python"
$ python setup.py install
```
For more information regarding MATLAB Engine installation please visit [here](https://www.mathworks.com/help/matlab/matlab_external/install-the-matlab-engine-for-python.html)

## Repository Structure

```
.
├── data                       # Folder with all the datasets
├── src                        # source code of the project 
|   ├── CORFpushpull           # source code for CORFpushpull model
|   ├── Preprocessing          # scripts for segmentation
|   ├── Temp_extraction        # source code for temperature extraction 
|   ├── data_load.py           # script for data loading
|   ├── data_preprocessing.py  # script for batch data preprocesing
|   ├── evaluation.py          # script for model evaluation 
|   ├── feature_maps.py        # script for feature map generation   
|   ├── models.py              # script for compiling model
|   ├── train.py               # script to train model
|   └──visualizations.py       # script for visualization
├── corf.py                    # script for generating CORF3D datasets from an RGB dataset
├── extraction.py              $ script to pre-process the raw images to make an RGB dataset
└── main.py                    # script to run exepriments with different parameters settings
```

## Running Experiments

```Bash
python3 ./main.py --model mobilenet --dataset_corf './data/extractions/semi-supervised-corf-sigma-3-75/' --resize 224 --plot-title 'semi-supervised-corf-sigma-3-75'
```


## Changed for new subset of frogs:
[] in main.py, changed the models folder
[] in data_load.py, changed the labeler