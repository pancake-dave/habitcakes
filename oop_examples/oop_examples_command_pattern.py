# Wzorzec projektowy: Polecenie (Command)

class Command:
    def execute(self):
        pass

class AddHabitCommand(Command):
    def __init__(self, habit, database):
        self.habit = habit
        self.database = database

    def execute(self):
        self.database[self.habit.hid] = self.habit
        print(f"Habit dodany: {self.habit}")

class DeleteHabitCommand(Command):
    def __init__(self, hid, database):
        self.hid = hid
        self.database = database

    def execute(self):
        if self.hid in self.database:
            del self.database[self.hid]
            print(f'Habit o hid={self.hid} usunięty')
        else:
            print("Nie ma takiego habita!")