let miliseconds = [0, 0]; 
let interval = [null, null];
let who = false;
let categories = ["food", "transport", "animal", "clothing", "profession"];
let penalty = 0;

function choose_category(id) {
    
    localStorage.setItem("category", categories[id]);
    window.location.href = "game.html";
}


function go_to_index() {
    window.location.href = "index.html";
}

function save(btn) {
    btn.blur();
    const inputValue = document.getElementById("seconds").value;
    who = document.getElementById("mySwitch").checked;
    penalty = parseInt(document.getElementById("penalty").value);
    const sec = Number(inputValue);
    miliseconds[0] = parseInt(sec)*100; 
    miliseconds[1] = parseInt(sec) * 100; 
    stopTimer(0);
    stopTimer(1);
    updateDisplay();
}


function pressed(s) {
    /*const text = document.getElementById("category");*/

    
    if (who) {
        miliseconds[0] = miliseconds[0] - (s * 100);
        startTimer(1);
        stopTimer(0);
        
    } else {
        miliseconds[1] = miliseconds[1] - (s * 100);
        startTimer(0);
        stopTimer(1);
        
    }
    who = !who; 
}




window.addEventListener("DOMContentLoaded", () => { // Дочекаємося завантаження сторінки
    const text = document.getElementById("category");
    const savedText = localStorage.getItem("category");
    if (text && savedText) {
        text.innerText = savedText;
    }
});


document.addEventListener("keyup", function (e) {
    if (e.code === "Space") {
        pressed(0);
        flashGreen();
    } else if (e.code === "Enter") {
        pressed(penalty)
        flashRed();
    }
});



function cheakWinner() {
    if (miliseconds[0] < 0) {
        stopTimer(0);
        stopTimer(1);
        alert("Гравець 2 виграв!");
    } else if (miliseconds[1] < 0) {
        stopTimer(1);
        stopTimer(0);
        alert("Гравець 1 виграв!");
    }
}














function formatTime(milisec) {
  const secon = Math.floor(milisec / 100);
  return `${String(secon).padStart(2, '0')}:${String(milisec%100).padStart(2, '0')}`;
}

function updateDisplay() {
    document.getElementById("timer1").innerText = formatTime(miliseconds[0]);
    document.getElementById("timer2").innerText = formatTime(miliseconds[1]);
    cheakWinner();
}

function startTimer(w) {
  if (interval[w] !== null) return;
  interval[w] = setInterval(() => {
    miliseconds[w]--;
    updateDisplay();
  }, 10);
}

function stopTimer(w) {
  clearInterval(interval[w]);
  interval[w] = null;
}

function resetTimer() {
  stopTimer();
  miliseconds = 0;
  updateDisplay();
}


function flashGreen() {
    const body = document.body;
    body.classList.add("flash-green");
    setTimeout(() => {
        body.classList.remove("flash-green");
    }, 300);
}
function flashRed() {
    const body = document.body;
    body.classList.add("flash-red");
    setTimeout(() => {
        body.classList.remove("flash-red");
    }, 300);
}