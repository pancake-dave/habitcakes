# Wzorzec projektowy: Metoda szablonowa (Template Method)

class HabitReportTemplate:
    def generate(self, habit):
        report = self.header(habit)
        report += self.body(habit)
        report += self.footer(habit)
        return report

    def header(self, habit):
        return f"=== Raport dla: {habit.title} ===\n"

    def body(self, habit):
        return f"Opis: {habit.description}\n"

    def footer(self, habit):
        return "=== KONIEC RAPORTU ===\n"

class SpecialHabitReport(HabitReportTemplate):
    def footer(self, habit):
        return f"!!! Specjalny raport dla habitów kategorii: {habit.category} !!!\n"

# Example usage:
if __name__ == "__main__":
    from base_habits import GeneralHabit, SpecialHabit
    g = GeneralHabit(1, "Czytanie", "Czytaj codziennie 10 stron")
    s = SpecialHabit(2, "Joga", "Ćwicz jogę rano")
    report = HabitReportTemplate().generate(g)
    special_report = SpecialHabitReport().generate(s)
    print(report)
    print(special_report)