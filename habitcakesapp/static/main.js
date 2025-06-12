document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/habits')
        .then(response => response.json())
        .then(data => {
            const habits = data.habits;
            const completions = data.completions;
            const weekDates = getCurrentWeekDates();
            const habitGrid = document.getElementById('habit-grid');
            habitGrid.innerHTML = ''; // Clear existing

            // Header row
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

            // Habit rows
            habits.forEach(habit => {
                const row = document.createElement('div');
                row.className = 'habit-grid__row';

                // Habit name
                row.innerHTML = `<div class="habit-grid__cell habit-grid__cell--habit"><p>${habit.title}</p></div>`;

                // Day checkboxes/cells
                weekDates.forEach(date => {
                    const key = `${habit.hid}|${date}`;
                    const completed = completions[key];
                    // You can put a checkmark or any placeholder
                    row.innerHTML += `
                        <div class="habit-grid__cell habit-grid__cell--habit">
                            <p class="habit-grid__habit-checkbox">${completed ? '✔️' : ''}</p>
                        </div>
                    `;
                });

                // Progress (placeholder for now)
                row.innerHTML += `<div class="habit-grid__cell habit-grid__cell--habit"><p>-</p></div>`;

                habitGrid.appendChild(row);
            });
        });

    // Helper to get Polish day names from date string
    function formatPolishDay(dateStr) {
        const days = ['Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota','Niedziela'];
        const d = new Date(dateStr);
        return days[(d.getDay() + 6) % 7]; // Map JS 0=Sun,... to 0=Mon,...
    }
});

function getCurrentWeekDates() {
    const today = new Date();
    const days = [];
    // JS: 0 - Sunday, 1 - Monday, ..., 6 - Saturday
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7)); // force Monday
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        days.push(d.toISOString().slice(0, 10)); // 'YYYY-MM-DD'
    }
    return days;
}