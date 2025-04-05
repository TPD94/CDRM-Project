## CDRM-Project
 ![forthebadge](https://forthebadge.com/images/badges/uses-html.svg) ![forthebadge](https://forthebadge.com/images/badges/uses-css.svg) ![forthebadge](https://forthebadge.com/images/badges/uses-javascript.svg) ![forthebadge](https://forthebadge.com/images/badges/made-with-python.svg)
 ## What is this?
 
 An open source web application written in python to decrypt Widevine and PlayReady protected content.

## Prerequisites

 - [Python](https://www.python.org/downloads/) with PIP installed

   > Python 3.13 was used at the time of writing
 
 ## Installation
 
 - Open your terminal and navigate to where you'd like to store the application
 - Create a new python virtual environment using `python -m venv CDRM-Project`
 - Change directory into the new `CDRM-Project` folder
 - Activate the virtual environment

    > Windows - change directory into the `Scripts` directory then `activate.bat`
    > 
    > Linux - `source bin/activate`

 - Extract CDRM-Project 2.0 git contents into the newly created `CDRM-Project` folder
 - Install python dependencies `pip install -r requirements.txt`
 - (Optional) Place your .WVD file into `/configs/CDMs/WV`
 - (Optional) Place your .PRD file into `/configs/CDMs/PR`
 - Run the application `python main.py`

