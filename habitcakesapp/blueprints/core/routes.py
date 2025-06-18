from flask import render_template, Blueprint, redirect, url_for, jsonify, request
from flask_login import login_required, current_user
from datetime import date, timedelta

from habitcakesapp.blueprints.habits.models import HabitCompletion, Habit
from habitcakesapp.app import db

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
            'is_active': habit.is_active,
            'repeat_month_day': habit.repeat_month_day
        }
        processed_habits.append(habit_dict)

    return render_template('core/dashboard.html', habits=processed_habits)

@core.route('/debug')
@login_required
def debug():
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
            'is_active': habit.is_active,
            'repeat_month_day': habit.repeat_month_day
        }
        processed_habits.append(habit_dict)

    return render_template('core/debug.html', habits=processed_habits)


# API endpoints for JS
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
            'repeat_month_day': habit.repeat_month_day
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

@core.route('/api/habit/delete/<int:hid>', methods=['POST'])
@login_required
def delete_habit(hid):
    habit = Habit.query.filter_by(hid=hid, user_id=current_user.uid).first()
    if habit:
        db.session.delete(habit)
        db.session.commit()
        return jsonify({'success': True})

    return jsonify({'success': False, 'error': 'Not found or unauthorized'}), 404