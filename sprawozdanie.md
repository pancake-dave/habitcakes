### Poniżej zamieszczam podsumowanie dotyczących wymaganych zagadnień z zakresu programowania obiektowego zawartych w projekcie **Habitcakes**.

### 1. Użycie klas i dziedziczenia
Przykład użycia klasy znajduje się m. in. w pliku `models.py`, w katalogu `/habitcakesapp/blueprints/habits/models.py`:<br><br>
 **class Habit(db.Model):**<br>
 **...**<br><br>
Jest ona również przykładem dziedziczenia (z klasy `Model` umożliwiając integrację z bazą danych (SQLAlchemy))
### 2. Atrybuty w klasach i ich nadpisywanie w klasach potomnych
W katalogu oop_examples, pliku `base_habits.py` klasa `SpecialHabit`, dziedzicząca z `GeneralHabit` nadpisuje atrybut `self.category`
### 3. Metody w klasach i ich nadpisywanie w klasach potomnych
W katalogu `oop_examples`, pliku `base_habits.py` metoda `description_text` klasy `GeneralHabit` jest nadpisywana w klasie `SpecialHabit`<br>
Innym przykładem nadpisywania metody jest `__repr__` w klasie `Habit` (`/habitcakesapp/blueprints/habits/models.py`), gdzie nadpisywana jest domyśla dunder metoda klasy-rodzica `Model`
### 4. Dekorator @classmethod i klasa z dodatkowym konstruktorem
W katalogu `oop_examples`, pliku `base_habits.py` klasa `GeneralHabit` zawiera metodę `from_dict` z dekoratorem `@classmethod`.<br>
Metoda ta jest również alternatywnym konstruktorem - przy jej pomocy można stworzyć instancję klasy `GeneralHabit` na podstawie słownika.
### 5. Enkapsulacja (setter i getter), custom exception
W katalogu `oop_examples`, pliku `base_habits.py` klasa `GeneralHabit` używa prywatnego atrybutu `__hid` z property setterem i getterem.<br>
W tej samej klasie, w getter został również zastosowany własny wyjątek dziedziczący z klasy `Exception` (zdefiniowany na początku skrypu `HidError`).
### 6. super()
W katalogu `oop_examples`, pliku `base_habits.py` klasa `SpecialHabit`, dziedzicząca z klasy `GeneralHabit` implementuje z klasy rodzica atrybuty `hid`, `title`, `description` przy wykorzystaniu `super()`
### 7. Polimorfizm
W katalogu `oop_examples`, pliku `base_habits.py` klasy `GeneralHabit` i `SpecialHabit` mają zaimplementowaną metodę `description_text`, natomiast funkcja `print_habit_info` demonstruje polimorfizm wywołując tę metodę na obiektach różnych klas.
### 8. Wzorce projektowe
W katalogu `oop_examples`:<br><br>
**Wzorzec Command (Polecenie)** - zaimplementowany w pliku `oop_examples_command_pattern.py` za pomocą klas `Command`, `AddHabitCommand` oraz `DeleteHabitCommand`, które enkapsulują operacje jako obiekty.<br><br>
**Wzorzec Strategy (Strategia)** - w pliku `oop_examples_strategy_pattern.py` znajduje się klasa `ReminderStrategy` oraz konkretne strategie `DailyReminder` i `WeeklyReminder`, umożliwiające elastyczną logikę przypomnień o nawykach.<br><br>
**Wzorzec Template Method (Metoda Szablonowa)** - w pliku `oop_examples_template_method_pattern.py` klasa `HabitReportTemplate` posiada metodę `generate()`, która wyznacza szkielet algorytmu, a klasa `SpecialHabitReport` nadpisuje wybrane kroki.