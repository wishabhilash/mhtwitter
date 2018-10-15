import sys, os
# Load project into system path
# so that all the modules can be called
# from the root of the project.
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.urls import *
from src.commands import *