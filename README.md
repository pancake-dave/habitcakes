# HabitCakes

**HabitCakes** is a simple web application for tracking and managing your habits. It's a project I made for my OOP course, but I'm plan to work on it in the future.
It's built with Flask and SQLAlchemy (SQLite for now). Frontend has some vanilla JS code doing its thing.

## Features

- Add new habits with a title and description
- View a list of all your habits
- Mark habits as completed
- Simple and clean user interface
- Database support (SQLite by default, will migrate to PostgreSQL in the future)

## What is not there yet

- Habit progress tracking
- Soft delete by using `is_active` column in habits table
- Viewing habit details
- Account management
- Some security stuff


## What you need to run it

- Python 3.8+ 
- Dependencies (easy installation using requirements.txt - see Usage):


## Usage

1. **Clone the repository:**

   ```bash
   git clone https://github.com/pancake-dave/habitcakes.git
   cd habitcakes
   ```
2. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

3. **Set up the database:**

   By default, the app uses SQLite. To initialize the database, run:

   ```bash
   flask db init
   flask db migrate
   flask db upgrade
   ```
It also might not be needed since for the time being I push the migrations and instance to the repo (tables filled with test values).

4. **Create .env in the root of the project:**

And put ```SECRET_KEY=your_super_secret_key``` there. (it's local only anyways)

5. **Run the app:**

    Go to /habitcakesapp and run this command:
   ```bash
   flask run
   ```

6. **Open your browser:**

   Everything's default, so visit [http://localhost:5000](http://localhost:5000)

## Development

- Code is organized using Flask blueprints and SQLAlchemy models.
- Alembic is used for database migrations (sometimes it freaks out a little, but usually works well)


## License

MIT License

---

**HabitCakes** – Build your habits, one day at a time!