from src import app, db
import click
from src.models import *

@app.cli.command()
def createdb():
	db.create_all()
