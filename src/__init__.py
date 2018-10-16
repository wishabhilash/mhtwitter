from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from src.settings import Config
from flask_jwt_extended import JWTManager

app = Flask(__name__)

app.config.from_object(Config)

db = SQLAlchemy(app)
jwt = JWTManager(app)