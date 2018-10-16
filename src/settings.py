import sys, os


class Config(object):
    BASE_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    SQLALCHEMY_DATABASE_URI = "sqlite:///%s/twitter.sqlite" % BASE_PATH
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    TWEET_CHARACTER_LIMIT = 280
    ACCESS_TOKEN_EXPIRY = 7 #days
    REFRESH_TOKEN_EXPIRY = 30 #days

    JWT_SECRET_KEY = "$6$DXKKMwci96tYMW3C"


    DATETIME_FORMAT = "%Y-%m-%dT%H:%M:%S"
    DATE_FORMAT = "%Y-%m-%d"
    TIME_FORMAT = "%H:%M:%S"