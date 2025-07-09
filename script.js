let miliseconds = [0, 0]; 
let interval = [null, null];
let who = false;
let categories = [[],[]];
let penalty = 0;
let choosed_category = "category";
const extensions = ["jfif", "webp", "jpg", "jpeg", "png", "JPG"];
let game_ready = false;
let id = 0;
const usedNumbers = [];
const url_categories = "images/categories.txt";
let names_imgs = [];
let random_id_img = 0;
let game_started = false;
let playing = false; 
let checkbox_shownameimg = false;



function blockIfMobile() {
    if (/Mobi|Android|iPhone|iPad|iPod|Oppo|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    document.body.innerHTML = "<h2 style='text-align:center; padding-top:50px;'>Сайт недоступний на мобільних пристроях</h2>";
  }
}


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
    id = parseInt(document.getElementById("categorySelect").value);
    choosed_category = categories[0][id];
    document.getElementById("category").innerText = choosed_category;
    document.getElementById("randomImage").src = "images/icon.png"; 
    usedNumbers.length = 0;
    playing = false;
    game_started = false;
    checkbox_shownameimg = document.getElementById("cheakBox_showNameImg");
    showname(false);
    loadNamesImgsFromFile(`images/${choosed_category}/names.txt`);
    game_ready = true;
    flashSaved();
}

function play1() {
    showRandomImage();
    startTimer(1);
}
function play2() {
    showRandomImage();
    startTimer(0);
}
function stop1() {
    stopTimer(1);
}
function stop2() {
    stopTimer(0);
}


function pressed(pres) {
    if (!game_ready) {
        alert("Будь ласка, спочатку налаштуйте гру.");
        return;
    }

    if (!game_started) {
        flashGreen();
        if (who) play1();
        else play2();
        game_started = true;
        playing = true;
        return;
    }

    if (playing) {
        if (who) {
            stop1();
            if (!pres) {
                miliseconds[1] = miliseconds[1] - (penalty * 100);
                updateDisplay();
                flashRed();
            }
            else {
                flashGreen();
            }
        }
        else {
            stop2();
            if (!pres) {
                miliseconds[0] = miliseconds[0] - (penalty * 100);
                updateDisplay();
                flashRed();
            }
            else {
                flashGreen();
            }
        }
        if (checkbox_shownameimg.checked) {
           showname(true);
           cheakWinner();
        } else {
            playing = false;
        }
        who = !who;
        
    }
    if (!playing) {
        showname(false);
        if (who) {
            play1();
        } else {
            play2();
        }
    }
    playing = !playing;
}

function showname(flag) {
    if (flag) {
        document.getElementById("nameimg").innerText = names_imgs[random_id_img] || "Ім'я не знайдено";
        document.getElementById("nameimg").style.opacity = "1";
    } else {
        document.getElementById("nameimg").style.opacity = "0";
    }
}





window.addEventListener("DOMContentLoaded", () => { // Дочекаємося завантаження сторінки
    loadCategoriesFromFile(url_categories);
    document.getElementById("randomImage").src = "images/icon.png";
    
});


document.addEventListener("keyup", function (e) {
    if (e.code === "Space") {
        pressed(true);  
    } else if (e.code === "Enter") {
        pressed(false);
    }
});



function cheakWinner() {
    if (miliseconds[0] <= 0) {
        game_ready = false; 
        stopTimer(0);
        stopTimer(1);
        miliseconds[0] = 0;
        updateDisplay();
        usedNumbers.length = 0;
         setTimeout(() => {
            alert("Гравець 2 виграв!");
        }, 700);
    } else if (miliseconds[1] <= 0) {
        game_ready = false; 
        stopTimer(1);
        stopTimer(0);
        miliseconds[1] = 0;
        updateDisplay();
        usedNumbers.length = 0;
        setTimeout(() => {
            alert("Гравець 1 виграв!");
        }, 700);
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
    random_id_img = randomNumber; // Зберігаємо номер зображення для подальшого використання
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
    document.getElementById("timer1").innerText = formatTime(miliseconds[0]);
    document.getElementById("timer2").innerText = formatTime(miliseconds[1]);
}

function startTimer(w) {
  if (interval[w] !== null) return;
  interval[w] = setInterval(() => {
    miliseconds[w]--;
    updateDisplay();
    cheakWinner();
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
function flashSaved() {
    const el = document.getElementById("label_saved");
    el.classList.add("flash");
    setTimeout(() => {
        el.classList.remove("flash");
    }, 1000);
}


function loadCategoriesFromFile(url) {
    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error("Помилка завантаження файлу");
            return res.text();
        })
        .then(text => {
            const lines = text.trim().split("\n");

            const names = [];
            const values = [];

            for (let line of lines) {
                line = line.trim().replace(/\s+/g, ' ');

                const lastSpace = line.lastIndexOf(' ');
                if (lastSpace === -1) continue;

                const name = line.slice(0, lastSpace).trim();
                const value = parseInt(line.slice(lastSpace + 1), 10);

                if (name && !isNaN(value)) {
                    names.push(name);
                    values.push(value);
                    console.log(`Категорія: ${name}, Кількість: ${value}`);
                }
            }
            // Оновлюємо глобальний масив
            categories = [names, values];
            fillSelectOptions();
        })
        .catch(err => {
            console.error("Помилка:", err);
        });
}


function fillSelectOptions() {
    const select = document.getElementById("categorySelect");
    const names = categories[0];
    names.forEach((name, id) => {
        const option = document.createElement("option");
        option.value = id;         // можна також name або id
        option.textContent = name;
        select.appendChild(option);
    });
}


function loadNamesImgsFromFile(url) {
    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error("Файл не знайдено");
            return res.text();
        })
        .then(text => {
            const lines = text.trim().split("\n");

            lines.forEach(line => {
                // Прибрати зайві пробіли
                line = line.trim().replace(/\s+/g, ' ');

                // Розділити на номер і назву
                const [indexStr, ...nameParts] = line.split(' ');
                const index = parseInt(indexStr, 10);
                const name = nameParts.join(' ');

                if (!isNaN(index) && name) {
                    names_imgs[index] = name;
                }
            });
        })
        .catch(err => console.error("Помилка:", err));
}