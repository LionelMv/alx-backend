#!/usr/bin/env python3
"""Simple flask app configured with Babel"""
from flask import Flask, render_template, request
from flask_babel import Babel


class Config:
    """Configuration for languages, Babel default locale
        and Babel default timezone."""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


# Configure the flask app.
app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_locale():
    """_summary_

    Returns:
            _type_: _description_
    """
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route("/")
def hello_world():
    """Simple hello"""
    return render_template("2-index.html")


if __name__ == '__main__':
    app.run(port="5000", host="0.0.0.0", debug=True)
