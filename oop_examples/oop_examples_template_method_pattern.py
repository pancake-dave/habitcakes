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