import os
from dotenv import load_dotenv

# modules imports
from flask import Flask, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate, migrate
from flask_login import LoginManager
from flask_bcrypt import Bcrypt

load_dotenv()

db = SQLAlchemy()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__, template_folder='templates')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./habitcakes.db'
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

    db.init_app(app)
    bcrypt.init_app(app)

    login_manager = LoginManager()
    login_manager.init_app(app)

    from habitcakesapp.blueprints.userbase.models import User
    from habitcakesapp.blueprints.habits.models import Habit

    @login_manager.user_loader
    def load_user(uid):
        return User.query.get(uid)

    @login_manager.unauthorized_handler
    def unauthorized_callback():
        return redirect(url_for('userbase.login'))

    # blueprints imports
    from habitcakesapp.blueprints.core.routes import core
    from habitcakesapp.blueprints.userbase.routes import userbase
    from habitcakesapp.blueprints.habits.routes import habits
    # blueprints registers
    app.register_blueprint(core, url_prefix='/')
    app.register_blueprint(userbase, url_prefix='/userbase')
    app.register_blueprint(habits, url_prefix='/habit')

    migrate = Migrate(app, db, render_as_batch=True) # render_as_batch=True mitigates ALEMBIK freaking out

    return app