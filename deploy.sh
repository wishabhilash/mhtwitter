#!/bin/bash

# Create python virtual environment
virtualenv --python=python3 .venv
. .venv/bin/activate
# END

# Install requirements.txt
pip install -r requirements.txt
# END