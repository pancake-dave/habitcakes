# Wzorzec projektowy: Strategia (Strategy)

class ReminderStrategy:
    def remind(self, habit):
        raise NotImplementedError

class DailyReminder(ReminderStrategy):
    def remind(self, habit):
        return f"Przypomnienie: wykonaj '{habit.title}' DZISIAJ!"

class WeeklyReminder(ReminderStrategy):
    def remind(self, habit):
        return f"Przypomnienie: wykonaj '{habit.title}' w tym tygodniu!"