# modules imports
from flask_login import UserMixin
# app imports
from habitcakesapp.app import db

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    uid = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    role = db.Column(db.String,default='user', nullable=False)
    # database relationship
    habits = db.relationship('Habit', back_populates='user')
    # unique constrains for avoiding duplicates
    __table_args__ = (
        db.UniqueConstraint('email', name='_email_uc'),
    )
    # overriding parent classes methods
    def __repr__(self):
        return f'<User: {self.username}, Email: {self.email}>'

    def get_id(self):
        return self.uid