# modules imports
from datetime import datetime
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
    # database relationship
    user_id = db.Column(db.Integer, db.ForeignKey('users.uid'), nullable=False, index=True)
    user = db.relationship('User', back_populates='habits')

    # overriding parent class methods
    def __repr__(self):
        return f'<Habit: {self.title}>'

    def get_id(self):
        return self.hid