# modules imports
from flask import render_template, redirect, request, Blueprint, url_for, jsonify
from flask_login import current_user, login_required
from datetime import date
# app imports
from habitcakesapp.blueprints.habits.models import Habit, HabitCompletion
from habitcakesapp.app import db

habits = Blueprint('habits', __name__, template_folder='templates')

@habits.route('/habit', methods=['POST'])
@login_required
def habit():
    title = request.form.get('title')
    description = request.form.get('description')
    repeat_frequency = request.form.get('repeat_frequency')
    repeat_day = ".".join(request.form.getlist('repeat_day'))
    user_id = int(current_user.uid)
    repeat_month_day = int(request.form.get('repeat_month_day'))
    # adding new habit to database
    habit = Habit(title=title, description=description, repeat_frequency=repeat_frequency, repeat_day=repeat_day, user_id=user_id, repeat_month_day=repeat_month_day)
    db.session.add(habit)
    db.session.commit()

    return redirect(url_for('core.dashboard'))

@habits.route('/toggle_completed', methods=['POST'])
@login_required
def toggle_completed():
    data = request.get_json()
    habit_id = data['habit_id']
    target_date = date.fromisoformat(data['date'])
    # trying to find the habit in the 'habit_completion' table
    hc = HabitCompletion.query.filter_by(
        user_id=current_user.uid,
        habit_id=habit_id,
        date=target_date
    ).first()
    # toggling the completed (or creating a new row in 'habit_completion')
    if hc:
        hc.completed = not hc.completed
    else:
        hc = HabitCompletion(
            user_id=current_user.uid,
            habit_id=habit_id,
            date=target_date,
            completed=True
        )
        db.session.add(hc)
    db.session.commit()
    return jsonify({'completed': hc.completed})

@habits.route('/habit/edit/<int:habit_id>', methods=['GET', 'POST'])
@login_required
def edit_habit(habit_id):
    habit = Habit.query.filter_by(hid=habit_id, user_id=current_user.uid).first_or_404()

    if request.method == 'POST':
        habit.title = request.form.get('title')
        habit.description = request.form.get('description')
        habit.repeat_frequency = request.form.get('repeat_frequency')
        habit.repeat_day = ".".join(request.form.getlist('repeat_day'))
        habit.is_active = 'is_active' in request.form
        habit.repeat_month_day = int(request.form.get('repeat_month_day'))
        # updating habit in database
        db.session.commit()
        return redirect(url_for('core.dashboard'))

    # for GET - rendering the edit form with current habit data
    return render_template('habits/edit_habit.html', habit=habit)

@habits.route("/habit/delete/<int:habit_id>")
@login_required
def delete(habit_id):
    habit = Habit.query.filter_by(hid=habit_id, user_id=current_user.uid).first_or_404()
    try:
        db.session.delete(habit)
        db.session.commit()
        return redirect(url_for('core.dashboard'))
    except Exception as e:
        return f"ERROR:{e}"