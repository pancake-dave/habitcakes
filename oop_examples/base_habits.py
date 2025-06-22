# Utworzenie własnego wyjątku dziedziczącego z Exception
class HidError(Exception):
    def __init__(self, error):
        super().__init__(error)

# Na potrzeby demonstracji:
database = {}

class GeneralHabit:
    def __init__(self, hid, title, description):
        self.__hid = None
        self.hid = hid

        self.title = title
        self.description = description

        self.category = 'general'

    # Enkapsulacja
    @property
    def hid(self):
        return self.__hid

    @hid.setter
    def hid(self, generated_hid):
        if generated_hid in database:
            # Użycie własnego wyjątku
            raise HidError('Wygenerowany hid istnieje już w basie danych')
        self.__hid = generated_hid

    def description_text(self):
        return f"Habit: {self.title} ({self.category})"

    def __str__(self):
        return f'<hid: {self.hid}, tytuł: {self.title}, opis: {self.description}, kategoria: {self.category}>'
    # Użycie dekoratora @classmethod - działa również jako alternatywny konstruktor
    @classmethod
    def from_dict(cls, data_dict):
        return cls(data_dict['hid'], data_dict['title'], data_dict['description'])


# Użycie dziedziczenia
class SpecialHabit(GeneralHabit):
    def __init__(self, hid, title, description, icon='*'):
        super().__init__(hid, title, description)
        # Nadpisanie atrybutu
        self.category = 'special'
        self.icon = icon
    # Nadpisanie metod
    def description_text(self):
        return f"{self.icon} SPECIAL Habit: {self.title}"

    def __str__(self):
        return f'(SPECIAL) <hid: {self.hid}, tytuł: {self.title}, opis: {self.description}>'

# Polimorfizm
def print_habit_info(habit):
    print(habit.description_text())