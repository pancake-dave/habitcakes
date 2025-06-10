# modules imports
from flask import render_template, redirect, request, Blueprint, url_for
from flask_login import login_user, logout_user, current_user, login_required
# app imports
from habitcakesapp.blueprints.userbase.models import User
from habitcakesapp.app import db, bcrypt

userbase = Blueprint('userbase', __name__, template_folder='templates')

@userbase.route('/create', methods=['GET', 'POST'])
def create():
    if request.method == 'GET':
        return render_template('userbase/create.html')
    elif request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')
        # masking the password to store in the database
        h_password = bcrypt.generate_password_hash(password)
        # adding the user to database
        user = User(username=name, password=h_password, email=email)
        db.session.add(user)
        db.session.commit()

        return render_template('userbase/success.html')

@userbase.route('/login', methods=['GET','POST'])
def login():
    if request.method == 'GET':
        return render_template('userbase/login.html')
    elif request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        # verifying login data
        user = User.query.filter(User.email == email).first()
        if bcrypt.check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('core.dashboard'))
        else:
            return render_template('userbase/login.html', fail_message='Błędny adres email lub hasło, spróbuj jeszcze raz')

@userbase.route('/logout')
def logout():
    logout_user()
    return render_template('core/index.html', message='Poprawne wylogowanie')