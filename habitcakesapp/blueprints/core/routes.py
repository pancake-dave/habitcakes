from flask import render_template, Blueprint, redirect, url_for, jsonify
from flask_login import login_required, current_user
from datetime import date, timedelta

from habitcakesapp.blueprints.habits.models import HabitCompletion

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

# API endpoint for JS
@core.route('/api/habits')
@login_required
def api_habits():
    # sending habit data
    user_habits = current_user.habits
    habits_list = []
    for habit in user_habits:
        habits_list.append({
            'hid': habit.hid,
            'title': habit.title,
            'description': habit.description,
            'repeat_frequency': habit.repeat_frequency,
            'repeat_day': habit.repeat_day,
            'created': habit.created.isoformat(),
            'is_active': habit.is_active,
        })
    #sending completion data
    today = date.today()
    days_range = 7
    completions = HabitCompletion.query.filter(
        HabitCompletion.user_id == current_user.uid,
        HabitCompletion.date >= today - timedelta(days=days_range),
        HabitCompletion.date <= today + timedelta(days=days_range)
    ).all()
    completions_dict = {}
    for item in completions:
        key = f"{item.habit_id}|{item.date.isoformat()}"
        completions_dict[key] = item.completed

    return jsonify(habits=habits_list, completions=completions_dict)