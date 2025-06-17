document.addEventListener('DOMContentLoaded', function() {
    // Store habits and weekDates for event handler closure access
    let habits = [];
    let weekDates = [];

    // Helper functions
    function getCurrentWeekDates() {
        const today = new Date();
        const days = [];
        const monday = new Date(today);
        monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            days.push(d.toISOString().slice(0, 10));
        }
        return days;
    }
    function formatPolishDay(dateStr) {
        const days = ['Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota','Niedziela'];
        const d = new Date(dateStr);
        return days[(d.getDay() + 6) % 7];
    }

    function formatPolishMonth(dateStr) {
        const months = ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'];
        const d = new Date(dateStr);
        return months[d.getMonth()];
    }

    // Render habit grid
    function renderHabitGrid(data) {
        habits = data.habits;
        const completions = data.completions;
        weekDates = getCurrentWeekDates();
        const habitGrid = document.getElementById('habit-grid');
        habitGrid.innerHTML = '';

        // Header row
        const headerRow = document.createElement('div');
        headerRow.className = 'habit-grid__row';
        headerRow.innerHTML = `
            <div class="habit-grid__cell habit-grid__cell--edge habit-grid__cell--header"><p>Nawyk</p></div>
            
            ${weekDates.map(date => {
                const d = new Date(date);
                const dayName = formatPolishDay(date);
                const month_2 = d.getMonth() + 1; // months are zero-based
                const month = formatPolishMonth(date)
                const day = d.getDate();
                return `<div class="habit-grid__cell habit-grid__cell--header"><p class="habit-grid__cell--month">${month}</p><p class="habit-grid__cell--day">${day}</p><p class="habit-grid__cell--dayname">${dayName}</p></div>`;
                                    }).join('')}
            
            <div class="habit-grid__cell habit-grid__cell--edge habit-grid__cell--header"><p>Progres</p></div>
        `;
        habitGrid.appendChild(headerRow);

        // Empty grid
        if (!habits || habits.length === 0) {
            const emptyRow = document.createElement('div');
            emptyRow.className = 'habit-grid__row';
            emptyRow.innerHTML = `
                <div class="habit-grid__cell habit-grid__cell--habit" colspan="9" style="grid-column: 1 / span 9;">
                    <span>Nie masz jeszcze żadnych zadań! Dodaj je tutaj: </span>
                    <button id="add-habit-btn" type="button">Dodaj zadanie</button>
                </div>
            `;
            habitGrid.appendChild(emptyRow);

            emptyRow.querySelector('#add-habit-btn').addEventListener('click', function() {
                alert('Tu pojawi się modal z formularzem!');
            });
            return;
        }

        // Habit rows
        habits.forEach((habit, habitIndex) => {
            const row = document.createElement('div');
            row.className = 'habit-grid__row';

            const repeatDays = habit.repeat_day ? habit.repeat_day.split('.') : [];
            const createdDate = new Date(habit.created);

            row.innerHTML = `<div class="habit-grid__cell habit-grid__cell--edge habit-grid__cell--habit"><p>${habit.title}</p></div>`;

            weekDates.forEach((date, dateIndex) => {
                const key = `${habit.hid}|${date}`;
                const completed = completions[key];
                const jsDay = new Date(date).getDay();
                const dayCodes = ['sun','mon','tue','wed','thu','fri','sat'];
                const dayCode = dayCodes[jsDay];

                // Enhanced logic for repeat_frequency with monthly fallback
                let canComplete = false;
                if (habit.repeat_frequency === "daily") {
                    canComplete = true;
                } else if (habit.repeat_frequency === "weekly") {
                    canComplete = repeatDays.includes(dayCode);
                } else if (habit.repeat_frequency === "monthly") {
                    const desiredDay = habit.repeat_month_day || createdDate.getDate();
                    const dayInMonth = new Date(date).getDate();
                    const lastDay = new Date(new Date(date).getFullYear(), new Date(date).getMonth() + 1, 0).getDate();
                    const dueDay = Math.min(desiredDay, lastDay);
                    canComplete = (dayInMonth === dueDay);
                }

                // Add data attributes for easy access in event handler
                row.innerHTML += `
                    <div 
                        class="habit-grid__cell habit-grid__cell--cell habit-grid__cell--habit${canComplete ? ' can-complete' : ''} ${completed ? 'completed-bg' : ''}" 
                        data-habit-index="${habitIndex}" 
                        data-date-index="${dateIndex}">
                        <i class="habit-grid__habit-checkbox ${completed ? 'fa-solid fa-check' : ''}"></i>
                    </div>
                `;
            });

            row.innerHTML += `<div class="habit-grid__cell habit-grid__cell--habit"><p>-</p></div>`;
            habitGrid.appendChild(row);
        });
    }

    // Attach event listener ONCE using event delegation
    document.getElementById('habit-grid').addEventListener('click', function(e) {
        const cell = e.target.closest('.habit-grid__cell.can-complete');
        if (!cell) return;

        const habitIndex = cell.getAttribute('data-habit-index');
        const dateIndex = cell.getAttribute('data-date-index');
        if (habitIndex === null || dateIndex === null) return;

        const habit = habits[parseInt(habitIndex, 10)];
        const date = weekDates[parseInt(dateIndex, 10)];

        // Optionally: disable cell or show loading...

        fetch('/habit/habit/toggle_completed', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ habit_id: habit.hid, date })
        })
        .then(response => response.json())
        .then(data => {
            if (data.completed) {
                cell.querySelector('.habit-grid__habit-checkbox').classList.add('fa-solid')
                cell.querySelector('.habit-grid__habit-checkbox').classList.add('fa-check')
                cell.classList.add('completed-bg')
            } else {
                cell.querySelector('.habit-grid__habit-checkbox').classList.remove('fa-solid')
                cell.querySelector('.habit-grid__habit-checkbox').classList.remove('fa-check')
                cell.classList.remove('completed-bg')
            }
        });
    });

    // Initial load
    fetch('/api/habits')
        .then(response => response.json())
        .then(data => {
            renderHabitGrid(data);
        });
});