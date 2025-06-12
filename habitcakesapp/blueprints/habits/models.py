# modules imports
from datetime import datetime
from email.policy import default

# app imports
from habitcakesapp.app import db

class Habit(db.Model):
    __tablename__ = 'habits'
    hid = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=True)
    repeat_frequency = db.Column(db.String, nullable=True)
    repeat_day = db.Column(db.String, nullable=True)
    created = db.Column(db.DateTime, default=datetime.now(), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    repeat_month_day = db.Column(db.Integer,nullable=True)
    # database relationship
    user_id = db.Column(db.Integer, db.ForeignKey('users.uid'), nullable=False, index=True)
    user = db.relationship('User', back_populates='habits')

    # overriding parent class methods
    def __repr__(self):
        return f'<Habit: {self.title}>'

    def get_id(self):
        return self.hid

class HabitCompletion(db.Model):
    __tablename__ = 'habit_completion'
    hcid = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.uid'), nullable=False)
    habit_id = db.Column(db.Integer, db.ForeignKey('habits.hid'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    completed = db.Column(db.Boolean, default=False, nullable=False)
    # unique constrains for avoiding duplicates
    __table_args__ = (
        db.UniqueConstraint('user_id', 'habit_id', 'date', name='_user_habit_date_uc'),
    )

    def get_id(self):
        return self.hcid