let seconds = 0;
let interval = null;

function formatTime(sec) {
  const minutes = Math.floor(sec / 60);
  const remainingSeconds = sec % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function updateDisplay() {
  document.getElementById("timer").textContent = formatTime(seconds);
}

function startTimer() {
  if (interval !== null) return;
  interval = setInterval(() => {
    seconds++;
    updateDisplay();
  }, 1000);
  document.getElementById("startBtn").disabled = true;
  document.getElementById("stopBtn").disabled = false;
}

function stopTimer() {
  clearInterval(interval);
  interval = null;
  document.getElementById("startBtn").disabled = false;
  document.getElementById("stopBtn").disabled = true;
}

function resetTimer() {
  stopTimer();
  seconds = 0;
  updateDisplay();
}

updateDisplay();
