// People flight details (UAE time)
const people = [
  {
    name: "Nivin Varkey",
    lastDuty: "2025-08-29T17:00:00+04:00",
    flight: "2025-08-30T13:40:00+04:00",
    return: "2025-09-30T01:35:00+04:00",
    ids: { last: "lastDuty1", flight: "flightCountdown1", ret: "returnCountdown1" }
  },
  {
    name: "Test-01",
    lastDuty: "2025-08-29T17:00:00+04:00",
    flight: "2025-08-30T13:40:00+04:00",
    return: "2025-09-30T01:35:00+04:00",
    ids: { last: "lastDuty2", flight: "flightCountdown2", ret: "returnCountdown2" }
  },
  {
    name: "Test-02",
    lastDuty: "2025-08-29T17:00:00+04:00",
    flight: "2025-08-30T13:40:00+04:00",
    return: "2025-09-30T01:35:00+04:00",
    ids: { last: "lastDuty3", flight: "flightCountdown3", ret: "returnCountdown3" }
  }
];

function countdown(target, elementId, afterText = "") {
  let now = new Date();
  let distance = new Date(target) - now;

  if (distance <= 0) {
    document.getElementById(elementId).textContent = afterText;
    return false;
  }

  let d = Math.floor(distance / (1000 * 60 * 60 * 24));
  let h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let s = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById(elementId).textContent =
    `${d}d ${h}h ${m}m ${s}s`;
  return true;
}

function updateCountdowns() {
  people.forEach(p => {
    // Show Last Duty
    countdown(p.lastDuty, p.ids.last, "Duty Done ✅");

    // Flight countdown → switch to return countdown when done
    let flightOngoing = countdown(p.flight, p.ids.flight, "Flight Time! ✈️");
    if (!flightOngoing) {
      countdown(p.return, p.ids.ret, "Back to Duty 😢");
    }
  });
}

setInterval(updateCountdowns, 1000);
