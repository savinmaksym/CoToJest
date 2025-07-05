let miliseconds = [0, 0]; 
let interval = [null, null];
let who = false;
let categories = [["продукти", "фрукти-овочі", "транспорт", "одяг", "тварини", "професії"],
                   [31,           35,             31,         31,       34,          17]];
let penalty = 0;
let choosed_category = "category";
const extensions = ["jfif", "webp", "jpg", "jpeg", "png", "JPG"];
//const maxImageNumber = 31;
let game_ready = false;
let id = 0;
const usedNumbers = [];

function save(btn) {
    btn.blur();
    const inputValue = document.getElementById("seconds").value;
    if (inputValue === "" || isNaN(inputValue) || parseInt(inputValue) <= 0) {
        alert("Будь ласка, введіть коректне значення секунд.");
        return;
    }
    who = document.getElementById("mySwitch").checked;
    penalty = parseInt(document.getElementById("penalty").value);
    if (penalty < 0 || isNaN(penalty)) {
        alert("Будь ласка, введіть коректне значення штрафу.");
        return;
    }
    const sec = Number(inputValue);
    miliseconds[0] = parseInt(sec)*100; 
    miliseconds[1] = parseInt(sec) * 100; 
    stopTimer(0);
    stopTimer(1);
    updateDisplay();
    id = parseInt(document.getElementById("mySelect").value);
    choosed_category = categories[0][id];
    document.getElementById("category").innerText = choosed_category;
    document.getElementById("randomImage").src = "images/icon.png"; 
    usedNumbers.length = 0;
    game_ready = true;
}


function pressed(s) {
    if (!game_ready) {
        alert("Будь ласка, спочатку налаштуйте гру.");
        return;
    }
    showRandomImage();

    if (who == true) {
        miliseconds[0] = miliseconds[0] - (s * 100);
        startTimer(1);
        stopTimer(0);
        
    } else {
        miliseconds[1] = miliseconds[1] - (s * 100);
        startTimer(0);
        stopTimer(1);
        
    }
    if (s == 0) flashGreen();
    else flashRed();
    who = !who; 
}




window.addEventListener("DOMContentLoaded", () => { // Дочекаємося завантаження сторінки
    document.getElementById("randomImage").src = "images/icon.png";
});


document.addEventListener("keyup", function (e) {
    if (e.code === "Space") {
        pressed(0);  
    } else if (e.code === "Enter") {
        pressed(penalty)
    }
});



function cheakWinner() {
    if (miliseconds[0] <= 0) {
        stopTimer(0);
        stopTimer(1);
        alert("Гравець 2 виграв!");
        game_ready = false; 
        usedNumbers.length = 0; 
    } else if (miliseconds[1] <= 0) {
        stopTimer(1);
        stopTimer(0);
        alert("Гравець 1 виграв!");
        game_ready = false;
        usedNumbers.length = 0;
    }
}


function showRandomImage() {
    if (usedNumbers.length >= categories[1][id]) {
        console.log("Усі картинки вже були показані!");
        usedNumbers.length = 0;
        return;
    }
    let randomNumber;
    do {
        randomNumber = Math.floor(Math.random() * categories[1][id]) + 1;
    } while (usedNumbers.includes(randomNumber));
    usedNumbers.push(randomNumber); 
    tryNextExtension(randomNumber, 0);
}

function tryNextExtension(imageNumber, extIndex) {
    if (extIndex >= extensions.length) {
        console.log("Не знайдено зображення");
        return;
    }

    const fileName = `${imageNumber}.${extensions[extIndex]}`;
    const filePath = `images/${choosed_category}/${fileName}`;
    const img = new Image();

    img.onload = function () {
        document.getElementById("randomImage").src = filePath;
    };

    img.onerror = function () {
        tryNextExtension(imageNumber, extIndex + 1); // спробувати наступне розширення
    };

    img.src = filePath;
}


















function formatTime(milisec) {
  const secon = Math.floor(milisec / 100);
  return `${String(secon).padStart(2, '0')}:${String(milisec%100).padStart(2, '0')}`;
}

function updateDisplay() {
    cheakWinner();
    document.getElementById("timer1").innerText = formatTime(miliseconds[0]);
    document.getElementById("timer2").innerText = formatTime(miliseconds[1]);
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