# modules imports
from flask import render_template, redirect, request, Blueprint, url_for
from flask_login import login_user, logout_user, current_user, login_required
# app imports
from habitcakesapp.blueprints.habits.models import Habit
from habitcakesapp.app import db, bcrypt

habits = Blueprint('habits', __name__, template_folder='templates')

@habits.route('/habit', methods=['POST'])
def habit():
    title = request.form.get('title')
    description = request.form.get('description')
    repeat_frequency = request.form.get('repeat_frequency')
    repeat_day = ".".join(request.form.getlist('repeat_day'))
    user_id = int(current_user.uid)
    # adding new habit to database
    habit = Habit(title=title, description=description, repeat_frequency=repeat_frequency, repeat_day=repeat_day, user_id=user_id)
    db.session.add(habit)
    db.session.commit()

    return redirect(url_for('core.dashboard'))