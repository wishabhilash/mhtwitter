from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from src.settings import Config

app = Flask(__name__)

app.config.from_object(Config)

db = SQLAlchemy(app)