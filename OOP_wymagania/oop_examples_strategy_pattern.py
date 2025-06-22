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

# Example usage:
if __name__ == "__main__":
    from base_habits import GeneralHabit
    g = GeneralHabit(1, "Czytanie", "Czytaj codziennie 10 stron")
    daily = DailyReminder()
    weekly = WeeklyReminder()
    print(daily.remind(g))
    print(weekly.remind(g))