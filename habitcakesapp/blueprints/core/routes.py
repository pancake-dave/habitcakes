from flask import render_template, Blueprint, redirect, url_for
from flask_login import login_required, current_user

core = Blueprint('core', __name__, template_folder='templates')

@core.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('core.dashboard'))
    return render_template('core/index.html')

@core.route('/dashboard')
@login_required
def dashboard():
    user_habits = current_user.habits
    processed_habits = []
    for habit in user_habits:
        habit_dict = {
            'hid': habit.hid,
            'title': habit.title,
            'description': habit.description,
            'repeat_frequency': habit.repeat_frequency,
            'created': habit.created,
            'user_id': habit.user_id,
            'repeat_days_list': habit.repeat_day.split('.') if habit.repeat_day else [],
            'is_active': habit.is_active
        }
        processed_habits.append(habit_dict)

    return render_template('core/dashboard.html', habits=processed_habits)