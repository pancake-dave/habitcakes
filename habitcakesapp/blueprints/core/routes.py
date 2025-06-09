from flask import render_template, Blueprint, redirect, url_for
from flask_login import login_required, current_user

core = Blueprint('core', __name__, template_folder='templates')

@core.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('core.dashboard'))  # or your calendar route
    return render_template('core/index.html')

@core.route('/dashboard')
@login_required
def dashboard():
    return render_template('core/dashboard.html')