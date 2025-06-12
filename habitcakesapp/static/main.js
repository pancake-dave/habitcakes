document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/habits')
        .then(response => response.json())
        .then(data => {
            const habits = data.habits;
            const completions = data.completions;
            const weekDates = getCurrentWeekDates();
            const habitGrid = document.getElementById('habit-grid');
            habitGrid.innerHTML = '';

            // Generating Header row
            const headerRow = document.createElement('div');
            headerRow.className = 'habit-grid__row';
            headerRow.innerHTML = `
                <div class="habit-grid__cell habit-grid__cell--day habit-grid__cell--header"><p>Zadanie</p></div>
                ${weekDates.map(date =>
                    `<div class="habit-grid__cell habit-grid__cell--day habit-grid__cell--header"><p>${formatPolishDay(date)}</p></div>`
                ).join('')}
                <div class="habit-grid__cell habit-grid__cell--day habit-grid__cell--header"><p>Progres</p></div>
            `;
            habitGrid.appendChild(headerRow);

            // Handling case of no habits to display
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

                // Add a click event for modal (to be implemented later)
                emptyRow.querySelector('#add-habit-btn').addEventListener('click', function() {
                    // Placeholder for modal logic
                    alert('Tu pojawi się modal z formularzem!');
                });
                return;
            }

            // Generating Habit rows
            habits.forEach(habit => {
                const row = document.createElement('div');
                row.className = 'habit-grid__row';

                const repeatDays = habit.repeat_day ? habit.repeat_day.split('.') : [];
                const createdDate = new Date(habit.created); // For monthly fallback

                row.innerHTML = `<div class="habit-grid__cell habit-grid__cell--habit"><p>${habit.title}</p></div>`;

                weekDates.forEach(date => {
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
            // Use repeat_month_day if present, otherwise default to created date
            const desiredDay = habit.repeat_month_day || createdDate.getDate();
            const dayInMonth = new Date(date).getDate();
            const lastDay = new Date(new Date(date).getFullYear(), new Date(date).getMonth() + 1, 0).getDate();
            const dueDay = Math.min(desiredDay, lastDay);
            canComplete = (dayInMonth === dueDay);
        }

        row.innerHTML += `
            <div class="habit-grid__cell habit-grid__cell--habit ${canComplete ? 'can-complete' : ''}">
                <p class="habit-grid__habit-checkbox">${completed ? '✔️' : ''}</p>
            </div>
        `;
    });

        row.innerHTML += `<div class="habit-grid__cell habit-grid__cell--habit"><p>-</p></div>`;
        habitGrid.appendChild(row);
    });
        });
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
});