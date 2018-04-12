const prevCalendarParent = document.getElementById('prevCalendar');
const currCalendarParent = document.getElementById('currCalendar');
const nextCalendarParent = document.getElementById('nextCalendar');
const dataPiker = document.getElementById('selectDateInput');
const selectedDateInput = document.getElementById('selectedDate');
const controls = document.querySelectorAll('#controls .control');

let now = new Date();
let year = now.getFullYear();
let currentMonth = now.getMonth();

window.addEventListener('keydown', keyDownListener);
controls.forEach(control => control.addEventListener('click', clickHandler));
dataPiker.addEventListener('change', dataPickHandler);

renderCalendars(now);
makeValueForInput(now);


function clickHandler(e) {
    const id = e.target.id;

    id === 'leftArrow' ? upgradeCalendar() : upgradeCalendar(true);
}

function renderCalendars(date) {
    let year = date.getFullYear();
    let prev = date.getMonth() - 1;
    let newCur = date.getMonth();
    let next = date.getMonth() +1;

    prev = prev === -1 ? 11 : prev;
    next = next === 12 ? 0 : next;

    createCalendar(year, prev, prevCalendarParent);
    createCalendar(year, newCur, currCalendarParent);
    createCalendar(year, next, nextCalendarParent);
}

function dataPickHandler(e) {
    if(!this.value) return;

    let [year, month] = this.value.split('-');
    year = Number(year);
    month = parseInt(month) - 1;

    const now = new Date(year, month);

    renderCalendars(now);
}

function createCalendar(year, month, parentElement) {
    let html = '<table><tr>';
    let firsDay = new Date(year, month);

    for (let i = 0; i < getDay(firsDay); i++) {
        html += '<td></td>';
    }

    while (firsDay.getMonth() === month) {
        html += `<td>${firsDay.getDate()}</td>`;

        if (getDay(firsDay) % 7 === 6) {
            html += '</tr><tr>';
        }

        firsDay.setDate(firsDay.getDate() + 1);
    }

    if (getDay(firsDay) !== 0) {
        for (let i = getDay(firsDay); i < 7; i++) {
            html += '<td></td>';
        }
    }

    html += '</tr></table>';
    parentElement.innerHTML = html;
}

function getDay(date) {
    const day = date.getDay();

    return (day === 0) ? 6 : day - 1;
}

function keyDownListener(e) {
    if (e.keyCode === 37) upgradeCalendar();
    if (e.keyCode === 39) upgradeCalendar(true);
}

function upgradeCalendar(bool) {
    let i = bool ? 1 : -1;

    now = new Date(year, currentMonth + i);
    currentMonth = now.getMonth();
    year = now.getFullYear();
    makeValueForInput(now);
    updateClasses(i);
}

// Updating active calendar by adding/romoving class
function updateClasses(i) {
    const calendars = document.querySelectorAll('.calendar');

    let currentIndex = 0;
    let indexToShift = 0;

    calendars.forEach((element, index) => {
        if (element.classList.contains('calendar-active')) {
            currentIndex = index;
            indexToShift = index + i;
        }
    });

    // re-render calendar and return mount to center position
    if(indexToShift < 0 || indexToShift > 2) {
        renderCalendars(now);
        indexToShift = 1;
    }

    calendars[currentIndex].classList.remove('calendar-active');
    calendars[indexToShift].classList.add('calendar-active');

    shiftMount(indexToShift);
}

// move mount
function shiftMount(index) {
    const mount = document.getElementById('mount');

    switch (index) {
        case 0: mount.style.transform = 'translate(-7vw)';
            break;
        case 2: mount.style.transform = 'translate(8vw)';
            break;
        default: mount.style.transform = 'translate(0vw)';
    }
}

// For getting date
function getSelectedDate() {
    selectedDateInput.value = now;

    return selectedDateInput.value;
}

function makeValueForInput(date) {
    const year = date.getFullYear();

    let month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;

    dataPiker.value = `${year}-${month}`;
}
