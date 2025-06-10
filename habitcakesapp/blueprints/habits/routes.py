# modules imports
from flask import render_template, redirect, request, Blueprint, url_for
from flask_login import login_user, logout_user, current_user, login_required
# app imports
from habitcakesapp.blueprints.habits.models import Habit
from habitcakesapp.app import db, bcrypt

habits = Blueprint('habits', __name__, template_folder='templates')

@habits.route('/habit', methods=['POST'])
@login_required
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

@habits.route('/habit/edit/<int:habit_id>', methods=['GET', 'POST'])
@login_required
def edit_habit(habit_id):
    habit = Habit.query.filter_by(hid=habit_id, user_id=current_user.uid).first_or_404()

    if request.method == 'POST':
        habit.title = request.form.get('title')
        habit.description = request.form.get('description')
        habit.repeat_frequency = request.form.get('repeat_frequency')
        habit.repeat_day = ".".join(request.form.getlist('repeat_day'))
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