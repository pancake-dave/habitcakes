document.addEventListener('DOMContentLoaded', function() {
    // this is here because nothing works if it isn't
    const habitGrid = document.getElementById('habit-grid');
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
            <div class="habit-grid__cell habit-grid__cell--edge habit-grid__cell--edgehabit habit-grid__cell--header">
                <p class="habit-grid__cell--edgetext">Nawyk</p>
            </div>
            
            ${weekDates.map(date => {
                const d = new Date(date);
                const dayName = formatPolishDay(date);
                const month_2 = d.getMonth() + 1; // months are zero-based
                const month = formatPolishMonth(date)
                const day = d.getDate();
                return `<div class="habit-grid__cell habit-grid__cell--date habit-grid__cell--header">
                            <p class="habit-grid__cell--month">${month}</p>
                            <p class="habit-grid__cell--day">${day}</p>
                            <p class="habit-grid__cell--dayname">${dayName}</p>
                        </div>`;
                                    }).join('')}
            
            <div class="habit-grid__cell habit-grid__cell--edge habit-grid__cell--header">
                <p class="habit-grid__cell--edgetext">Progres</p>
            </div>
        `;
        habitGrid.appendChild(headerRow);

        // Empty grid
        if (!habits || habits.length === 0) {
            const emptyRow = document.createElement('div');
            emptyRow.className = 'habit-grid__row';
            emptyRow.innerHTML = `
                <div class="habit-grid__cell habit-grid__cell--empty habit-grid__cell--habit" colspan="9" style="grid-column: 1 / span 9;">
                    <span>Nie masz jeszcze żadnych nawyków do śledzenia! </span>
                    <button class="habit-grid__add-button" id="show-form-btn" type="button">Dodaj je tutaj!</button>
                </div>
            `;
            habitGrid.appendChild(emptyRow);

            emptyRow.querySelector('#show-form-btn').addEventListener('click', function() {
                const form = document.getElementById('add-habit-form')
                const formBg = document.getElementById('add-habit-background')
                form.classList.add('visible')
                formBg.classList.add('visible')
            });
            return;
        }

        // Habit rows
        habits.forEach((habit, habitIndex) => {
            const row = document.createElement('div');
            row.className = 'habit-grid__row';

            const repeatDays = habit.repeat_day ? habit.repeat_day.split('.') : [];
            const createdDate = new Date(habit.created);

            row.innerHTML = `<div class="habit-grid__cell habit-grid__cell--edge habit-grid__cell--habit">
                            <p>${habit.title}</p>
                            <i class="habit-grid__delete-button fa-regular fa-rectangle-xmark" id="delete-habit-button" data-hid="${habit.hid}"></i>
                            </div>`;

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

            row.innerHTML += `<div class="habit-grid__cell habit-grid__cell--progress habit-grid__cell--habit">
                                <p>-</p>
                              </div>`;
            habitGrid.appendChild(row);

            // Remove any previous delete listeners to avoid duplicates

habitGrid.onclick = function(e) {
    // Find the delete button or its parent
    let btn = e.target.closest('.habit-grid__delete-button[data-hid]');
    if (!btn) return;

    // Prevent double prompt
    e.stopPropagation();

    const hid = btn.getAttribute('data-hid');
    if (!hid) return;

    if (confirm('Delete this habit?')) {
        fetch(`/api/habit/delete/${hid}`, {method: 'POST'})
            .then(resp => resp.json())
            .then(data => {
                if (data.success) {
                    // Refresh the grid
                    fetch('/api/habits')
                        .then(response => response.json())
                        .then(data => renderHabitGrid(data));
                } else {
                    alert('Failed to delete habit!');
                }
            });
    }
};
        });

        // add new habit form button beneath last row
        const addHabitRow = document.createElement('div');
        addHabitRow.className = 'habit-grid__row';
        addHabitRow.innerHTML = `
                <div class="habit-grid__cell habit-grid__cell--habit" colspan="1" style="grid-column: 1 / 2; border-bottom: none">
                    <button class="habit-grid__add-button" id="show-form-btn-2" type="button">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            `;
        habitGrid.appendChild(addHabitRow)

        addHabitRow.querySelector('#show-form-btn-2').addEventListener('click', function() {
                const form = document.getElementById('add-habit-form')
                const formBg = document.getElementById('add-habit-background')
                form.classList.add('visible')
                formBg.classList.add('visible')
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

    // Add habit form behaviour handling
    const select = document.getElementById('repeat_frequency');
    const checkboxes = document.querySelectorAll('#weekday-checkboxes .habit-form__weekday');
    const checkboxesBox = document.getElementById('weekday-checkboxes')
    const monthDaySelect = document.getElementById('month-day-select')
    const monthDayInput = document.getElementById('month-day-input')

    function updateCheckboxes() {
        if (select.value === 'weekly') {
            checkboxes.forEach(cb => cb.disabled = false);
            checkboxesBox.classList.add('visible')
            monthDaySelect.classList.remove('visible')
            monthDayInput.value = ''
        } else if (select.value === 'monthly') {
            checkboxes.forEach(cb => {
                cb.disabled = true;
                cb.checked = false;
            });
            checkboxesBox.classList.remove('visible')
            monthDaySelect.classList.add('visible')
        } else if (select.value === 'daily') {
            checkboxes.forEach(cb => {
                cb.disabled = true;
                cb.checked = false;
            });
            checkboxesBox.classList.remove('visible')
            monthDaySelect.classList.remove('visible')
            monthDayInput.value = ''
        }
  }

  select.addEventListener('change', updateCheckboxes);

  // call once to initialize state
  updateCheckboxes();

    // closing add new habit form
    const addHabitForm = document.getElementById('add-habit-form')
    const addHabitBg = document.getElementById('add-habit-background')
    const cancelBtn = document.getElementById('cancel-form-button')

    function closeForm() {
      addHabitForm.classList.remove('visible')
      addHabitBg.classList.remove('visible')
        checkboxes.forEach( cb => {
            cb.checked = false
        })
        monthDayInput.value = ''
    }

    cancelBtn.addEventListener('click', closeForm)
    // call just in case
    closeForm()

    // Initial load
    fetch('/api/habits')
        .then(response => response.json())
        .then(data => {
            renderHabitGrid(data);
        });
});