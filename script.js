const eventForm = document.getElementById('eventForm');
const countdownList = document.getElementById('countdownList');

const pad2 = (n) => String(n).padStart(2, '0');

// Load events from localStorage
let events = JSON.parse(localStorage.getItem('countdownEvents') || '[]');

// Add event
function addEvent(name, date) {
  events.push({ name, date: new Date(date) });
  saveEvents();
  renderEvents();
}

// Save events to localStorage
function saveEvents() {
  localStorage.setItem('countdownEvents', JSON.stringify(events));
}

// Render events in the list
function renderEvents() {
  countdownList.innerHTML = '';
  events.forEach((event, index) => {
    const div = document.createElement('div');
    div.className = 'countdown-item';
    div.id = `event-${index}`;
    div.innerHTML = `
      <h2>${event.name}</h2>
      <div class="time" id="time-${index}">Calculating...</div>
      <div class="time" id="totalDays-${index}"></div>
      <div class="time" id="workDays-${index}"></div>
    `;
    countdownList.appendChild(div);
  });
}

// Helper functions for days
function startOfLocalDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function inclusiveDaysBetween(start, end) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((startOfLocalDay(end) - startOfLocalDay(start)) / msPerDay) + 1;
}

function workingDaysInclusive(start, end) {
  const tz = 'Asia/Dubai';

  const parts = (d) => {
    const p = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false
    }).formatToParts(d);
    const map = Object.fromEntries(p.map(o => [o.type, o.value]));
    return {
      y: map.year, m: map.month, d: map.day,
      hh: parseInt(map.hour, 10), mm: parseInt(map.minute, 10)
    };
  };

  const dubaiMidnight = (d) => {
    const { y, m, d: dd } = parts(d);
    return new Date(`${y}-${m}-${dd}T00:00:00+04:00`);
  };

  const nowParts = parts(start);
  let countStart = dubaiMidnight(start);

  if (nowParts.hh > 9 || (nowParts.hh === 9 && nowParts.mm >= 30)) {
    countStart = new Date(countStart.getTime() + 24*60*60*1000);
  }

  const countEnd = dubaiMidnight(end);
  let count = 0;
  for (let d = new Date(countStart); d <= countEnd; d = new Date(d.getTime() + 24*60*60*1000)) {
    const dubaiDOW = new Date(d.getTime() + 4*60*60*1000).getUTCDay();
    if (dubaiDOW !== 6) count++; // Saturday excluded
  }
  return count;
}

// Update all countdowns
function updateCountdowns() {
  const now = new Date();
  events.forEach((event, index) => {
    const diff = event.date - now;
    const timeEl = document.getElementById(`time-${index}`);
    const totalEl = document.getElementById(`totalDays-${index}`);
    const workEl = document.getElementById(`workDays-${index}`);

    if (diff <= 0) {
      timeEl.textContent = '🎉 Event Started!';
      totalEl.textContent = '';
      workEl.textContent = '';
      return;
    }

    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
    const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
    const seconds = Math.floor((diff % (1000*60)) / 1000);

    timeEl.textContent = `${days}d ${pad2(hours)}h ${pad2(minutes)}m ${pad2(seconds)}s`;

    // Calculate total and working days
    const today = new Date();
    const totalDays = inclusiveDaysBetween(today, event.date);
    const workDays = workingDaysInclusive(today, event.date);

    totalEl.textContent = `📆 Total Days (incl. event day): ${totalDays}`;
    workEl.textContent = `📅 Working Days (Sun–Fri, excl. Sat): ${workDays}`;
  });
}

// Form submission
eventForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('eventName').value;
  const date = document.getElementById('eventDate').value;
  addEvent(name, date);
  eventForm.reset();
});

// Initialize
renderEvents();
updateCountdowns();
setInterval(updateCountdowns, 1000);
