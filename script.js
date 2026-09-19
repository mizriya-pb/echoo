// // console.log("Project Started");
// console.log("Scientific Voice Calculator Started");
let buttonSoundEnabled = true;

const clickSound = new Audio("sounds/click.mp3");

function playButtonSound() {

    if (buttonSoundEnabled) {

        clickSound.currentTime = 0;
        clickSound.play();
    }
}


let expression = "";
let historyList = [];
let angleMode = "degree";
let decimalPlaces = 2;
function saveHistory() {

    localStorage.setItem(
        "echoHistory",
        JSON.stringify(historyList)
    );
}

function loadHistory() {

    let savedHistory =
        localStorage.getItem("echoHistory");

    if (savedHistory) {

        historyList =
            JSON.parse(savedHistory);
    }
}

loadHistory();

function appendValue(value) {
    playButtonSound();
    expression += value;

    document.getElementById("expression").innerText = expression;
}


   async function calculateResult() {

    if (!expression.trim()) {
        document.getElementById("result").innerText = "Enter a calculation";
        return;
    }

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/api/calculate/?expression=" +
            encodeURIComponent(expression)
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Calculation failed");
        }

        document.getElementById("result").innerText = data.result;

        historyList.push(expression + " = " + data.result);
        saveHistory();

    } catch (error) {
        document.getElementById("result").innerText = error.message;
    }
}


function clearDisplay() {
    playButtonSound();
    expression = "";

    document.getElementById("expression").innerText = "";

    document.getElementById("result").innerText = "0";

    //  Reset Everthing

    document.getElementById("formulaSelect").selectedIndex = 0;
    let shapeContainer = document.getElementById("shapeContainer");
    if (shapeContainer) {
        shapeContainer.style.display = "none";
    }
    document.getElementById("shapeSelect").selectedIndex = 0;
    let value1 = document.getElementById("value1");
    if (value1)
        value1.value = "";
    let value2 = document.getElementById("value2");
    if (value2) {
        value2.value = "";
        value2.style.display = "none";
    }
    let value3 = document.getElementById("value3");
    if (value3) {
        value3.value = "";
        value3.style.display = "none";
    }

    document.getElementById("currencySelect").selectedIndex = 0;
    let currencyInputs = document.getElementById("currencyInputs");
    if (currencyInputs) {
        currencyInputs.style.display = "none";
    }
    let currencyAmount = document.getElementById("currencyAmount");
    if (currencyAmount) {
        currencyAmount.value = "";
    }

    document.getElementById("binarySelect").selectedIndex = 0;
    let binaryInputs = document.getElementById("binaryInputs");
    if (binaryInputs) {
        binaryInputs.style.display = "none";
    }
    let binaryValue = document.getElementById("binaryValue");
    if (binaryValue) {
        binaryValue.value = "";
    }
}


function calculateScientific(type) {

    playButtonSound();

    let num = parseFloat(expression);

    if (isNaN(num)) {
        document.getElementById("result").innerText = "Enter Number";
        return;
    }

    let result;

    switch (type) {

        case "sin":

            result =
                angleMode === "degree"
                    ? Math.sin(num * Math.PI / 180)
                    : Math.sin(num);

            break;

        case "cos":

            result =
                angleMode === "degree"
                    ? Math.cos(num * Math.PI / 180)
                    : Math.cos(num);

            break;

        case "tan":

            result =
                angleMode === "degree"
                    ? Math.tan(num * Math.PI / 180)
                    : Math.tan(num);

            break;

        case "log":
            result = Math.log10(num);
            break;

        case "ln":
            result = Math.log(num);
            break;

        case "sqrt":
            result = Math.sqrt(num);
            break;
    }

    document.getElementById("result").innerText =
        Number(result).toFixed(decimalPlaces);

    historyList.push(
        type +
        "(" +
        num +
        ") = " +
        Number(result).toFixed(decimalPlaces)
    );

    saveHistory();
}
function insertConstant(type) {
    playButtonSound();
    if (type === "pi") {
        expression = Math.PI.toString();
    }

    else if (type === "e") {
        expression = Math.E.toString();
    }

    document.getElementById("expression").innerText = expression;
}

function squareValue() {
    playButtonSound();
    let num = parseFloat(expression);

    if (isNaN(num)) {
        document.getElementById("result").innerText = "Enter Number";
        return;
    }

    let result = num * num;

    document.getElementById("result").innerText = result;
    historyList.push(num + "² = " + result);
    saveHistory();
}

function backspace() {
    playButtonSound();
    expression = expression.slice(0, -1);

    document.getElementById("expression").innerText = expression;
}

function showFormulaSection() {

    document.getElementById("formulaSection").style.display = "block";
    document.getElementById("currencySection").style.display = "none";
    document.getElementById("binarySection").style.display = "none";
}

function showCurrencySection() {

    document.getElementById("formulaSection").style.display = "none";
    document.getElementById("currencySection").style.display = "block";
    document.getElementById("binarySection").style.display = "none";
}

function showBinarySection() {

    document.getElementById("formulaSection").style.display = "none";
    document.getElementById("currencySection").style.display = "none";
    document.getElementById("binarySection").style.display = "block";
}

function toggleMenu() {

    const menu =
        document.getElementById("sideMenu");

    if (menu.style.display === "block") {
        menu.style.display = "none";
    }
    else {
        menu.style.display = "block";
    }

}


const formulaSelect =
    document.getElementById("formulaSelect");

const shapeContainer =
    document.getElementById("shapeContainer");

const shapeSelect =
    document.getElementById("shapeSelect");

formulaSelect.addEventListener("change", function () {
    showFormulaSection();

    let formula = this.value;

    shapeSelect.style.display = "block";
    document.getElementById("formulaInputs").style.display = "none";

    shapeSelect.innerHTML = "";

    if (formula === "Area") {

        shapeContainer.style.display = "block";
        document.getElementById("shapeLabel").style.display = "block";
        shapeSelect.style.display = "block";


        shapeSelect.innerHTML = `
        <option selected disabled>Select Shape</option>
        <option>Circle</option>
        <option>Rectangle</option>
        <option>Square</option>
        <option>Triangle</option>
        <option>Parallelogram</option>
        `;

    }

    else if (formula === "Volume") {

        shapeContainer.style.display = "block";
        document.getElementById("shapeLabel").style.display = "block";
        shapeSelect.style.display = "block";

        shapeSelect.innerHTML = `
    <option selected disabled>Select Shape</option>
    <option>Cube</option>
    <option>Cuboid</option>
    <option>Cylinder</option>
    <option>Cone</option>
    <option>Sphere</option>
    `;
    }



    else if (formula === "Perimeter") {

        shapeContainer.style.display = "block";
        document.getElementById("shapeLabel").style.display = "block";
        shapeSelect.style.display = "block";

        shapeSelect.innerHTML = `
        <option selected disabled>Select Shape</option>
        <option>Circle</option>
        <option>Rectangle</option>
        <option>Square</option>
        <option>Triangle</option>
        <option>Parallelogram</option>
        `;

    }
    else if (formula === "Speed") {

        shapeContainer.style.display = "block";
        shapeSelect.style.display = "none";
        document.getElementById("shapeLabel").style.display = "none";

        document.getElementById("formulaInputs").style.display = "block";

        document.getElementById("value2").style.display = "block";

        document.getElementById("value3").style.display = "none";

        document.getElementById("value1").placeholder = "Distance";

        document.getElementById("value2").placeholder = "Time";
    }
    else if (formula === "Simple Interest") {
        shapeContainer.style.display = "block"
        shapeSelect.style.display = "none";
        document.getElementById("shapeLabel").style.display = "none";

        document.getElementById("formulaInputs").style.display = "block";

        document.getElementById("value2").style.display = "block";

        document.getElementById("value3").style.display = "block";

        document.getElementById("value1").placeholder = "Principal Amount";

        document.getElementById("value2").placeholder = "Rate (%)";

        document.getElementById("value3").placeholder = "Time (Years)";
    }
    else if (formula === "BMI") {

        shapeContainer.style.display = "block";
        shapeSelect.style.display = "none";
        document.getElementById("shapeLabel").style.display = "none";

        document.getElementById("formulaInputs").style.display = "block";

        document.getElementById("value2").style.display = "block";
        document.getElementById("value3").style.display = "none";

        document.getElementById("value1").placeholder = "Weight (kg)";
        document.getElementById("value2").placeholder = "Height (m)";
    }
    else if (formula === "Percentage") {

        shapeContainer.style.display = "block";
        shapeSelect.style.display = "none";
        document.getElementById("shapeLabel").style.display = "none";

        document.getElementById("formulaInputs").style.display = "block";

        document.getElementById("value2").style.display = "block";

        document.getElementById("value3").style.display = "none";

        document.getElementById("value1").placeholder = "Obtained Marks";

        document.getElementById("value2").placeholder = "Total Marks";
    }

    else if (
        formula === "Mean" ||
        formula === "Median" ||
        formula === "Mode"
    ) {

        shapeContainer.style.display = "block";
        shapeSelect.style.display = "none";
        document.getElementById("shapeLabel").style.display = "none";

        document.getElementById("formulaInputs").style.display = "block";

        document.getElementById("value2").style.display = "none";

        document.getElementById("value3").style.display = "none";

        document.getElementById("value1").placeholder =
            "Enter numbers";
    }
    else if (formula === "Variance") {

        shapeContainer.style.display = "block";
        shapeSelect.style.display = "none";
        document.getElementById("shapeLabel").style.display = "none";

        document.getElementById("formulaInputs").style.display = "block";

        document.getElementById("value2").style.display = "none";
        document.getElementById("value3").style.display = "none";

        document.getElementById("value1").placeholder =
            "Enter numbers";
    }
    else if (formula === "Standard Deviation") {

        shapeContainer.style.display = "block";
        shapeSelect.style.display = "none";
        document.getElementById("shapeLabel").style.display = "none";

        document.getElementById("formulaInputs").style.display = "block";

        document.getElementById("value2").style.display = "none";
        document.getElementById("value3").style.display = "none";

        document.getElementById("value1").placeholder =
            "Enter numbers";
    }
    else if (formula === "Z-Score") {

        shapeContainer.style.display = "block";
        shapeSelect.style.display = "none";
        document.getElementById("shapeLabel").style.display = "none";

        document.getElementById("formulaInputs").style.display = "block";

        document.getElementById("value2").style.display = "block";
        document.getElementById("value3").style.display = "block";

        document.getElementById("value1").placeholder = "Value (x)";
        document.getElementById("value2").placeholder = "Mean";
        document.getElementById("value3").placeholder = "Std Deviation";
    }
    else if (formula === "Covariance") {

        shapeContainer.style.display = "block";
        shapeSelect.style.display = "none";
        document.getElementById("shapeLabel").style.display = "none";

        document.getElementById("formulaInputs").style.display = "block";

        document.getElementById("value2").style.display = "block";
        document.getElementById("value3").style.display = "none";

        document.getElementById("value1").placeholder =
            "Dataset X";

        document.getElementById("value2").placeholder =
            "Dataset Y";
    }
    else {

        shapeContainer.style.display = "none";
    }

});
document.getElementById("binarySelect")
.addEventListener("change", function () {

    showBinarySection();

    document.getElementById("binaryInputs")
    .style.display = "block";
});
document.getElementById("currencySelect")
.addEventListener("change", function () {

    showCurrencySection();

    document.getElementById("currencyInputs")
    .style.display = "block";
});

shapeSelect.addEventListener("change", function () {
    document.getElementById("formulaInputs").style.display = "block";

    const shape = this.value;

    const value2 =
        document.getElementById("value2");
    const value3 =
        document.getElementById("value3");

    if (
        shape === "Rectangle" ||

        shape === "Parallelogram" ||
        shape === "Cylinder" ||
        shape === "Cone"
    ) {
        value2.style.display = "block";
        value3.style.display = "none";
    }
    else if (shape === "Triangle") {

        value2.style.display = "block";
        value3.style.display = "block";
    }

    else if (shape === "Cuboid") {

        value2.style.display = "block";
        value3.style.display = "block";

    }

    else {

        value2.style.display = "none";
        value3.style.display = "none";
    }
});
async function calculateFormula() {
    let formula = document.getElementById("formulaSelect").value;
    let shape = document.getElementById("shapeSelect").value;

    let value1 = document.getElementById("value1").value;
    let value2 = document.getElementById("value2").value;
    let value3 = document.getElementById("value3").value;

    let params = new URLSearchParams();
    let historyText = "";

    if (formula === "Area") {
        if (shape === "Circle") {
            params.set("formula", "circle_area");
            params.set("radius", value1);
            historyText = "Area of Circle | Radius=" + value1;
        } else if (shape === "Square") {
            params.set("formula", "square_area");
            params.set("side", value1);
            historyText = "Area of Square | Side=" + value1;
        } else if (shape === "Rectangle") {
            params.set("formula", "rectangle_area");
            params.set("length", value1);
            params.set("width", value2);
            historyText = "Area of Rectangle | L=" + value1 + ", W=" + value2;
        } else if (shape === "Triangle") {
            params.set("formula", "triangle_area");
            params.set("base", value1);
            params.set("height", value2);
            historyText = "Area of Triangle | Base=" + value1 + ", Height=" + value2;
        } else if (shape === "Parallelogram") {
            params.set("formula", "parallelogram_area");
            params.set("base", value1);
            params.set("height", value2);
            historyText = "Area of Parallelogram | Base=" + value1 + ", Height=" + value2;
        }
    }
    else if (formula === "Volume") {

    else if (formula === "Volume") {
        if (shape === "Cube") {
            params.set("formula", "cube_volume");
            params.set("side", value1);
            historyText = "Volume of Cube | Side=" + value1;
        } else if (shape === "Cuboid") {
            params.set("formula", "cuboid_volume");
            params.set("length", value1);
            params.set("width", value2);
            params.set("height", value3);
            historyText = "Volume of Cuboid | L=" + value1 + ", W=" + value2 + ", H=" + value3;
        } else if (shape === "Cylinder") {
            params.set("formula", "cylinder_volume");
            params.set("radius", value1);
            params.set("height", value2);
            historyText = "Volume of Cylinder | R=" + value1 + ", H=" + value2;
        } else if (shape === "Cone") {
            params.set("formula", "cone_volume");
            params.set("radius", value1);
            params.set("height", value2);
            historyText = "Volume of Cone | R=" + value1 + ", H=" + value2;
        } else if (shape === "Sphere") {
            params.set("formula", "sphere_volume");
            params.set("radius", value1);
            historyText = "Volume of Sphere | Radius=" + value1;
        }
    }
    else if (formula === "Perimeter") {

    else if (formula === "Perimeter") {
        if (shape === "Square") {
            params.set("formula", "square_perimeter");
            params.set("side", value1);
            historyText = "Perimeter of Square | Side=" + value1;
        } else if (shape === "Rectangle") {
            params.set("formula", "rectangle_perimeter");
            params.set("length", value1);
            params.set("width", value2);
            historyText = "Perimeter of Rectangle | L=" + value1 + ", W=" + value2;
        } else if (shape === "Triangle") {
            params.set("formula", "triangle_perimeter");
            params.set("side1", value1);
            params.set("side2", value2);
            params.set("side3", value3);
            historyText = "Perimeter of Triangle | Sides=" + value1 + "," + value2 + "," + value3;
        } else if (shape === "Circle") {
            params.set("formula", "circle_perimeter");
            params.set("radius", value1);
            historyText = "Circumference of Circle | Radius=" + value1;
        } else if (shape === "Parallelogram") {
            params.set("formula", "parallelogram_perimeter");
            params.set("base", value1);
            params.set("side", value2);
            historyText = "Perimeter of Parallelogram | Base=" + value1 + ", Side=" + value2;
        }
    }

    else if (formula === "Speed") {
        params.set("formula", "speed");
        params.set("distance", value1);
        params.set("time", value2);
        historyText = "Speed | Distance=" + value1 + ", Time=" + value2;
    }

    else if (formula === "Simple Interest") {
        params.set("formula", "simple_interest");
        params.set("principal", value1);
        params.set("rate", value2);
        params.set("time", value3);
        historyText = "Simple Interest | P=" + value1 + ", R=" + value2 + ", T=" + value3;
    }

    else if (formula === "BMI") {
        params.set("formula", "bmi");
        params.set("weight", value1);
        params.set("height", value2);
        historyText = "BMI | Weight=" + value1 + ", Height=" + value2;
    }

    else if (formula === "Percentage") {
        params.set("formula", "percentage");
        params.set("part", value1);
        params.set("whole", value2);
        historyText = "Percentage | Obtained=" + value1 + ", Total=" + value2;
    }

    else if (formula === "Mean") {
        params.set("formula", "mean");
        params.set("numbers", value1);
        historyText = "Mean | Data=" + value1;
    }

    else if (formula === "Median") {
        params.set("formula", "median");
        params.set("numbers", value1);
        historyText = "Median | Data=" + value1;
    }

    else if (formula === "Mode") {
        params.set("formula", "mode");
        params.set("numbers", value1);
        historyText = "Mode | Data=" + value1;
    }

    else if (formula === "Variance") {
        params.set("formula", "variance_population");
        params.set("numbers", value1);
        historyText = "Variance | Data=" + value1;
    }

    else if (formula === "Standard Deviation") {
        params.set("formula", "std_dev_population");
        params.set("numbers", value1);
        historyText = "Standard Deviation | Data=" + value1;
    }

    else if (formula === "Z-Score") {
        params.set("formula", "z_score");
        params.set("value", value1);
        params.set("mean", value2);
        params.set("std_dev", value3);
        historyText = "Z-Score | X=" + value1 + ", Mean=" + value2 + ", SD=" + value3;
    }

    else if (formula === "Covariance") {
        params.set("formula", "covariance");
        params.set("numbers_x", value1);
        params.set("numbers_y", value2);
        historyText = "Covariance | X=" + value1 + ", Y=" + value2;
    }

    else {
        document.getElementById("result").innerText = "Choose a formula first";
        return;
    }

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/api/formula/?" + params.toString()
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Calculation failed");
        }

        document.getElementById("result").innerText = data.result;

        historyList.push(historyText + " → " + data.result);
        saveHistory();

    } catch (error) {
        document.getElementById("result").innerText = error.message;
    }
}
async function convertCurrency() {
    const amount = document.getElementById("currencyAmount").value;
    const type = document.getElementById("currencySelect").value;

    const conversionMap = {
        "INR → USD": { from: "INR", to: "USD" },
        "USD → INR": { from: "USD", to: "INR" },
        "INR → EUR": { from: "INR", to: "EUR" },
        "EUR → INR": { from: "EUR", to: "INR" },
        "INR → GBP": { from: "INR", to: "GBP" },
        "GBP → INR": { from: "GBP", to: "INR" }
    };

    const currencies = conversionMap[type];

    if (!amount || Number(amount) < 0) {
        document.getElementById("result").innerText = "Enter a valid amount";
        return;
    }

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/api/currency/?amount=" +
            encodeURIComponent(amount) +
            "&from=" + currencies.from +
            "&to=" + currencies.to
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Conversion failed");
        }

        document.getElementById("result").innerText = data.result;

        historyList.push(type + ": " + amount + " = " + data.result);
        saveHistory();

    } catch (error) {
        document.getElementById("result").innerText = error.message;
    }
}
async function convertBinary() {
    const value = document.getElementById("binaryValue").value.trim();
    const type = document.getElementById("binarySelect").value;

    const directionMap = {
        "Decimal → Binary": "dec_to_bin",
        "Binary → Decimal": "bin_to_dec"
    };

    const direction = directionMap[type];

    if (!value) {
        document.getElementById("result").innerText = "Enter a value";
        return;
    }

    if (!direction) {
        document.getElementById("result").innerText =
            "Choose Decimal → Binary or Binary → Decimal";
        return;
    }

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/api/binary/?direction=" +
            direction +
            "&value=" +
            encodeURIComponent(value)
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Conversion failed");
        }

        document.getElementById("result").innerText = data.result;

        historyList.push(type + ": " + value + " = " + data.result);
        saveHistory();

    } catch (error) {
        document.getElementById("result").innerText = error.message;
    }
}
function openHistory(){
    document.getElementById("sideMenu").style.display="none";
    document.getElementById("historyPage").style.display = "block";

    let content = document.getElementById("historyContent");

    if(historyList.length === 0){
        content.innerHTML = "No History Yet";
    }
    else{
        content.innerHTML = historyList.join("<br>");
    }
}

function closeHistory(){

    document.getElementById("historyPage").style.display = "none";
}

// ================= SETTINGS =================

// Open Settings Page
function openSettings() {

    document.getElementById("sideMenu").style.display = "none";

    document.getElementById("settingsPage").style.display = "block";

}

function clearHistory() {

    historyList = [];

    localStorage.removeItem("echoHistory");

    document.getElementById("historyContent").innerHTML =
        "No History Yet";
}
// Close Settings Page
function closeSettings() {

    document.getElementById("settingsPage").style.display = "none";

}


// Theme Change

function setTheme(mode) {

    if (mode === "dark") {

        document.body.classList.add("dark-mode");

        localStorage.setItem("theme", "dark");

    }

    else {

        document.body.classList.remove("dark-mode");

        localStorage.setItem("theme", "default");

    }

}


// Load Saved Theme

window.onload = function () {

    let savedTheme = localStorage.getItem("theme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

    }

};
function openSettings() {

    document.getElementById("sideMenu").style.display = "none";

    document.getElementById("settingsMenu").style.display = "block";

}



function toggleSetting(id) {

    let box = document.getElementById(id);


    if (box.style.display === "block") {

        box.style.display = "none";

    }

    else {

        box.style.display = "block";

    }

}
// Close menu/settings when clicking outside

document.addEventListener("click", function (event) {

    const menu = document.getElementById("sideMenu");
    const settings = document.getElementById("settingsMenu");
    const menuButton = document.querySelector(".menu-btn");


    if (
        !menu.contains(event.target) &&
        !settings.contains(event.target) &&
        !menuButton.contains(event.target)
    ) {

        menu.style.display = "none";

        settings.style.display = "none";

    }

});
function changeTheme() {

    let theme =
        document.getElementById("themeSelect").value;


    if (theme === "dark") {

        document.body.classList.add("dark-mode");

        localStorage.setItem("theme", "dark");

    }

    else {

        document.body.classList.remove("dark-mode");

        localStorage.setItem("theme", "default");

    }

}
window.onload = function () {

    let savedTheme = localStorage.getItem("theme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

        document.getElementById("themeSelect").value = "dark";

    }

};

const VoiceBtn = document.getElementById("voiceBtn");
const soundWave = document.querySelector(".sound-wave");
VoiceBtn.addEventListener("Click", () => {
    soundWave.classList.toggle("active");
});

function showAbout() {

    alert(
        `ECHOO Scientific Voice Calculator

Developed By:

Frontend:
Nafeezathul Mizriya

Backend:
Amisha Shiju

Features:
• Scientific Calculator
• Formula Hub
• Currency Converter
• Binary Converter
• Voice Input System

Version: 1.0`
    );
}
function startVoiceInput() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Voice Recognition not supported");
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = function (event) {

        let speechText =
            event.results[0][0].transcript.toLowerCase();

        processVoiceCommand(speechText);

    };

    recognition.onerror = function (event) {

        console.log(
            "Voice Error:",
            event.error
        );

    };

}

function processVoiceCommand(text) {

    // =========================================================
    // ECHOO FINAL VOICE COMMAND HANDLER
    // =========================================================

    const expressionBox = document.getElementById("expression");
    const resultBox = document.getElementById("result");

    const formulaSelectEl = document.getElementById("formulaSelect");
    const shapeSelectEl = document.getElementById("shapeSelect");
    const value1El = document.getElementById("value1");
    const value2El = document.getElementById("value2");
    const value3El = document.getElementById("value3");

    const currencySelectEl = document.getElementById("currencySelect");
    const currencyAmountEl = document.getElementById("currencyAmount");

    const binarySelectEl = document.getElementById("binarySelect");
    const binaryValueEl = document.getElementById("binaryValue");

    // ---------------------------------------------------------
    // BASIC HELPERS
    // ---------------------------------------------------------

    function speak(message) {
        if (!("speechSynthesis" in window)) return;

        speechSynthesis.cancel();

        const voice = new SpeechSynthesisUtterance(String(message));
        voice.lang = "en-US";

        speechSynthesis.speak(voice);
    }

    function clearExpression() {
        if (expressionBox) {
            expressionBox.innerText = "";
        }

        expression = "";
    }
    function closeAllPanels() {

        const formulaPanel =
            document.getElementById("formulaContainer");

        const currencyPanel =
            document.getElementById("currencyContainer");

        const binaryPanel =
            document.getElementById("binaryContainer");

        if (formulaPanel) formulaPanel.style.display = "none";

        if (currencyPanel) currencyPanel.style.display = "none";

        if (binaryPanel) binaryPanel.style.display = "none";
    }
    function showExpression(value) {
        expression = value;

        if (expressionBox) {
            expressionBox.innerText = value;
        }
    }

    function formatNumber(value, decimals = null) {

        if (!Number.isFinite(Number(value))) {
            return String(value);
        }

        let decimalPlaces = decimals;

        if (decimalPlaces === null) {
            decimalPlaces = parseInt(
                localStorage.getItem("echoDecimalPlaces")
            );

            if (isNaN(decimalPlaces)) {
                decimalPlaces = 4;
            }
        }

        return Number(value).toFixed(decimalPlaces);
    }

    function getNumbers(value) {
        if (!value) return [];

        const matches = value.match(/-?\d+(?:\.\d+)?/g);

        if (!matches) return [];

        return matches.map(Number);
    }

    function getHexOrBinaryValue(value) {

        if (!value) return "";

        const match = value.match(/[0-9a-f]+/i);

        return match ? match[0] : "";
    }

    function selectDropdown(selectElement, value) {

        if (!selectElement) return false;

        selectElement.value = value;

        selectElement.dispatchEvent(
            new Event("change", { bubbles: true })
        );

        return selectElement.value === value;
    }

    function resultOnlyVoice() {
        if (!resultBox) return;

        speak(resultBox.innerText);
    }

    function prepareFormula(formula, shape = "") {

        clearExpression();

        if (!formulaSelectEl) return false;

        formulaSelectEl.value = formula;

        formulaSelectEl.dispatchEvent(
            new Event("change", { bubbles: true })
        );

        if (shape && shapeSelectEl) {

            shapeSelectEl.value = shape;

            shapeSelectEl.dispatchEvent(
                new Event("change", { bubbles: true })
            );
        }

        return true;
    }

    function findDecimalSelect() {

        const selects = document.querySelectorAll("select");

        for (const select of selects) {

            const optionTexts = Array.from(select.options)
                .map(option => option.textContent.trim());

            const numericOptions = optionTexts.filter(option =>
                /^\d+$/.test(option)
            );

            if (numericOptions.length >= 3) {
                return select;
            }
        }

        return null;
    }

    function findAngleSelect() {

        const selects = document.querySelectorAll("select");

        for (const select of selects) {

            const options = Array.from(select.options)
                .map(option =>
                    option.textContent.trim().toLowerCase()
                );

            const hasDegree = options.some(option =>
                option.includes("degree")
            );

            const hasRadian = options.some(option =>
                option.includes("radian")
            );

            if (hasDegree && hasRadian) {
                return select;
            }
        }

        return null;
    }

    function setDecimalPlaces(value) {

        value = parseInt(value);

        if (isNaN(value) || value < 0 || value > 10) {
            return false;
        }

        localStorage.setItem(
            "echoDecimalPlaces",
            String(value)
        );

        const decimalSelect = findDecimalSelect();

        if (decimalSelect) {

            let option = Array.from(decimalSelect.options)
                .find(item =>
                    item.value === String(value) ||
                    item.textContent.trim() === String(value)
                );

            if (option) {
                decimalSelect.value = option.value;
                decimalSelect.dispatchEvent(
                    new Event("change", { bubbles: true })
                );
            }
        }

        return true;
    }

    function setAngleMode(mode) {

        mode = mode.toLowerCase();

        let finalMode = "";

        if (
            mode.includes("degree") ||
            mode === "degrees"
        ) {
            finalMode = "degree";
        }

        if (
            mode.includes("radian") ||
            mode === "radians"
        ) {
            finalMode = "radian";
        }

        if (!finalMode) return false;

        localStorage.setItem(
            "echoAngleMode",
            finalMode
        );

        const angleSelect = findAngleSelect();

        if (angleSelect) {

            const desired = finalMode === "degree"
                ? ["degree", "degrees"]
                : ["radian", "radians"];

            const option = Array.from(angleSelect.options)
                .find(item =>
                    desired.includes(
                        item.textContent
                            .trim()
                            .toLowerCase()
                    ) ||
                    desired.includes(
                        String(item.value)
                            .trim()
                            .toLowerCase()
                    )
                );

            if (option) {

                angleSelect.value = option.value;

                angleSelect.dispatchEvent(
                    new Event("change", { bubbles: true })
                );
            }
        }

        return true;
    }

    function getAngleMode() {

        const saved =
            localStorage.getItem("echoAngleMode");

        if (
            saved === "degree" ||
            saved === "radian"
        ) {
            return saved;
        }

        return "degree";
    }

    function calculateTrig(type, number) {

        const mode = getAngleMode();

        let angle = Number(number);

        if (mode === "degree") {
            angle = angle * Math.PI / 180;
        }

        if (type === "sin") {
            return Math.sin(angle);
        }

        if (type === "cos") {
            return Math.cos(angle);
        }

        if (type === "tan") {
            return Math.tan(angle);
        }

        return NaN;
    }

    // ---------------------------------------------------------
    // CLEAN TEXT
    // ---------------------------------------------------------

    let originalText = String(text || "")
        .toLowerCase()
        .trim();
    closeAllPanels();

    if (!originalText) return;

    // ---------------------------------------------------------
    // HISTORY COMMANDS
    // NO VOICE RESPONSE
    // ---------------------------------------------------------

    if (
        originalText.includes("clear history")
    ) {
        clearHistory();
        return;
    }

    if (
        originalText.includes("close history")
    ) {
        closeHistory();
        return;
    }

    if (
        originalText.includes("open history") ||
        originalText.includes("show history")
    ) {
        openHistory();
        return;
    }

    // ---------------------------------------------------------
    // ABOUT
    // NO VOICE RESPONSE
    // ---------------------------------------------------------

    if (
        originalText.includes("open about") ||
        originalText.includes("show about") ||
        originalText.includes("about page")
    ) {
        showAbout();
        return;
    }

    // ---------------------------------------------------------
    // SETTINGS
    // NO VOICE RESPONSE
    // ---------------------------------------------------------

    if (
        originalText.includes("open settings") ||
        originalText.includes("show settings")
    ) {
        openSettings();
        return;
    }

    if (
        originalText.includes("close settings")
    ) {
        if (typeof closeSettings === "function") {
            closeSettings();
        }

        return;
    }

    // ---------------------------------------------------------
    // DECIMAL PLACES
    // ---------------------------------------------------------

    let decimalMatch =
        originalText.match(
            /(?:set|change|switch)\s+decimal\s+places?\s+(?:to\s+)?(\d+)/i
        );

    if (!decimalMatch) {

        decimalMatch =
            originalText.match(
                /decimal\s+places?\s+(?:to\s+)?(\d+)/i
            );
    }

    if (decimalMatch) {

        const places =
            parseInt(decimalMatch[1]);

        if (setDecimalPlaces(places)) {

            clearExpression();

            if (resultBox) resultBox.innerText = "";

            speak(
                `Decimal places set to ${places}`
            );

            return;
        }
    }

        // ---------------------------------------------------------
        // ANGLE MODE
        // ---------------------------------------------------------

        if (
            originalText.includes("degree mode") ||
            originalText.includes("degrees mode") ||
            originalText.includes("switch to degree") ||
            originalText.includes("change to degree")
        ) {

            setAngleMode("degree");

            clearExpression();

            if (resultBox) resultBox.innerText = "";

            speak("Degree mode enabled");

            return;
        }

        if (
            originalText.includes("radian mode") ||
            originalText.includes("radians mode") ||
            originalText.includes("switch to radian") ||
            originalText.includes("change to radian")
        ) {

            setAngleMode("radian");

            clearExpression();

            if (resultBox) resultBox.innerText = "";

            speak("Radian mode enabled");
            return;
        }

        // ---------------------------------------------------------
        // DARK MODE / LIGHT MODE
        // ---------------------------------------------------------

        if (
            originalText.includes("dark mode") ||
            originalText.includes("switch to dark") ||
            originalText.includes("change to dark")
        ) {

            document.body.classList.add("dark-mode");

            localStorage.setItem(
                "theme",
                "dark"
            );

            clearExpression();

            if (resultBox) resultBox.innerText = "";

            speak("Dark mode enabled");

            return;
        }

        if (
            originalText.includes("light mode") ||
            originalText.includes("switch to light") ||
            originalText.includes("change to light")
        ) {

            document.body.classList.remove("dark-mode");

            localStorage.setItem(
                "theme",
                "default"
            );

            clearExpression();

            if (resultBox) resultBox.innerText = "";

            speak("Light mode enabled");

            return;
        }

        // ---------------------------------------------------------
        // FORMULA LIST
        // ---------------------------------------------------------

        if (
            originalText.includes("show formulas") ||
            originalText.includes("open formulas") ||
            originalText.includes("show formula")
        ) {

            clearExpression();

            if (typeof toggleFormulaList === "function") {
                toggleFormulaList();
            }

            return;
        }

        // ---------------------------------------------------------
        // CONVERTER TEXT
        // ---------------------------------------------------------

        let textForNumbers = originalText;

        const numberWords = {
            "zero": "0",
            "one": "1",
            "two": "2",
            "three": "3",
            "four": "4",
            "five": "5",
            "six": "6",
            "seven": "7",
            "eight": "8",
            "nine": "9",
            "ten": "10"
        };

        Object.keys(numberWords).forEach(word => {

            const pattern =
                new RegExp("\\b" + word + "\\b", "g");

            textForNumbers =
                textForNumbers.replace(
                    pattern,
                    numberWords[word]
                );
        });

        // =========================================================
        // CURRENCY CONVERTER
        // =========================================================

        const currencyNumbers =
            getNumbers(textForNumbers);

        if (
            (
                textForNumbers.includes("rupee") ||
                textForNumbers.includes("rupees") ||
                textForNumbers.includes("inr") ||
                textForNumbers.includes("indian rupee")
            ) &&
            (
                textForNumbers.includes("dollar") ||
                textForNumbers.includes("usd")
            )
        ) {

            if (currencyNumbers.length >= 1) {

                const amount =
                    currencyNumbers[0];

                let conversion = "";

                if (
                    textForNumbers.includes("rupee") ||
                    textForNumbers.includes("rupees") ||
                    textForNumbers.includes("inr") ||
                    textForNumbers.includes("indian rupee")
                ) {
                    conversion = "INR → USD";
                } else {
                    conversion = "USD → INR";
                }

                clearExpression();

                selectDropdown(
                    currencySelectEl,
                    conversion
                );

                if (currencyAmountEl) {
                    currencyAmountEl.value = amount;
                }

                if (typeof convertCurrency === "function") {
                    convertCurrency();
                }

                resultOnlyVoice();

                return;
            }
        }

        if (
            (
                textForNumbers.includes("rupee") ||
                textForNumbers.includes("rupees") ||
                textForNumbers.includes("inr") ||
                textForNumbers.includes("indian rupee")
            ) &&
            (
                textForNumbers.includes("euro") ||
                textForNumbers.includes("eur")
            )
        ) {

            if (currencyNumbers.length >= 1) {

                const amount =
                    currencyNumbers[0];

                let conversion = "";

                if (
                    textForNumbers.includes("rupee") ||
                    textForNumbers.includes("rupees") ||
                    textForNumbers.includes("inr") ||
                    textForNumbers.includes("indian rupee")
                ) {
                    conversion = "INR → EUR";
                } else {
                    conversion = "EUR → INR";
                }

                clearExpression();

                selectDropdown(
                    currencySelectEl,
                    conversion
                );

                currencyAmountEl.value = amount;

                if (typeof convertCurrency === "function") {
                    convertCurrency();
                }

                resultOnlyVoice();

                return;
            }
        }

        if (
            (
                textForNumbers.includes("rupee") ||
                textForNumbers.includes("rupees") ||
                textForNumbers.includes("inr") ||
                textForNumbers.includes("indian rupee")
            ) &&
            (
                textForNumbers.includes("pound") ||
                textForNumbers.includes("gbp") ||
                textForNumbers.includes("sterling")
            )
        ) {

            if (currencyNumbers.length >= 1) {

                const amount =
                    currencyNumbers[0];

                let conversion = "";

                if (
                    textForNumbers.includes("rupee") ||
                    textForNumbers.includes("rupees") ||
                    textForNumbers.includes("inr") ||
                    textForNumbers.includes("indian rupee")
                ) {
                    conversion = "INR → GBP";
                } else {
                    conversion = "GBP → INR";
                }

                clearExpression();

                selectDropdown(
                    currencySelectEl,
                    conversion
                );

                currencyAmountEl.value = amount;

                if (typeof convertCurrency === "function") {
                    convertCurrency();
                }

                resultOnlyVoice();

                return;
            }
        }

        // =========================================================
        // BINARY / OCTAL / HEXADECIMAL CONVERTER
        // =========================================================

        let binaryText =
            textForNumbers
                .replace(/convert/g, "")
                .trim();

        let binaryConversion = "";

        if (
            binaryText.includes("decimal") &&
            binaryText.includes("binary")
        ) {

            if (
                binaryText.includes("to binary") ||
                binaryText.includes("into binary")
            ) {
                binaryConversion = "Decimal → Binary";
            }
            else if (
                binaryText.includes("to decimal") ||
                binaryText.includes("into decimal")
            ) {
                binaryConversion = "Binary → Decimal";
            }
        }

        if (
            binaryText.includes("decimal") &&
            binaryText.includes("octal")
        ) {

            if (
                binaryText.includes("to octal") ||
                binaryText.includes("into octal")
            ) {
                binaryConversion = "Decimal → Octal";
            }
            else if (
                binaryText.includes("to decimal") ||
                binaryText.includes("into decimal")
            ) {
                binaryConversion = "Octal → Decimal";
            }
        }

        if (
            binaryText.includes("decimal") &&
            (
                binaryText.includes("hexadecimal") ||
                binaryText.includes("hex")
            )
        ) {

            if (
                binaryText.includes("to hexadecimal") ||
                binaryText.includes("into hexadecimal") ||
                binaryText.includes("to hex") ||
                binaryText.includes("into hex")
            ) {
                binaryConversion = "Decimal → Hexadecimal";
            }
            else if (
                binaryText.includes("to decimal") ||
                binaryText.includes("into decimal")
            ) {
                binaryConversion = "Hexadecimal → Decimal";
            }
        }

        // Binary of 25
        if (
            binaryConversion === "" &&
            binaryText.includes("binary") &&
            !binaryText.includes("to decimal")
        ) {
            binaryConversion = "Decimal → Binary";
        }

        // Decimal of 1010 = Binary → Decimal
        if (
            binaryConversion === "" &&
            binaryText.match(/\bdecimal\s+of\b/)
        ) {
            binaryConversion = "Binary → Decimal";
        }

        if (
            binaryConversion !== ""
        ) {

            let binaryValue = "";

            if (
                binaryConversion === "Hexadecimal → Decimal"
            ) {
                binaryValue =
                    getHexOrBinaryValue(binaryText);
            }
            else if (
                binaryConversion === "Binary → Decimal"
            ) {
                const possible =
                    binaryText.match(/\b[01]+\b/g);

                if (possible) {
                    binaryValue = possible[possible.length - 1];
                }
            }
            else {
                const nums =
                    getNumbers(binaryText);

                if (nums.length > 0) {
                    binaryValue = nums[0];
                }
            }

            if (binaryValue !== "") {

                clearExpression();

                selectDropdown(
                    binarySelectEl,
                    binaryConversion
                );

                binaryValueEl.value =
                    binaryValue;

                if (typeof convertBinary === "function") {
                    convertBinary();
                }

                resultOnlyVoice();

                return;
            }
        }

        // =========================================================
        // NORMALIZE ARITHMETIC / SCIENTIFIC TEXT
        // =========================================================

        let normalized = textForNumbers
            .replace(/\bcalculate\b/g, "")
            .replace(/\bwhat is\b/g, "")
            .replace(/\bsolve\b/g, "")
            .replace(/\bplease\b/g, "")
            .trim();

        normalized = normalized
            .replace(/multiplied by/g, "*")
            .replace(/multiply by/g, "*")
            .replace(/times/g, "*")
            .replace(/\binto\b/g, "*")
            .replace(/plus/g, "+")
            .replace(/minus/g, "-")
            .replace(/divided by/g, "/")
            .replace(/divide by/g, "/");

        normalized =
            normalized
                .replace(/\s+/g, " ")
                .trim();

        // =========================================================
        // FORMULA CALCULATIONS
        // =========================================================

        const formulaNumbers =
            getNumbers(textForNumbers);

        // ---------- AREA ----------

        if (
            normalized.includes("area of circle") ||
            normalized.includes("circle area")
        ) {

            if (formulaNumbers.length >= 1) {

                prepareFormula(
                    "Area",
                    "Circle"
                );

                value1El.value =
                    formulaNumbers[0];

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        if (
            normalized.includes("area of rectangle") ||
            normalized.includes("rectangle area")
        ) {

            if (formulaNumbers.length >= 2) {

                prepareFormula(
                    "Area",
                    "Rectangle"
                );

                value1El.value =
                    formulaNumbers[0];

                value2El.value =
                    formulaNumbers[1];

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        if (
            normalized.includes("area of square") ||
            normalized.includes("square area")
        ) {

            if (formulaNumbers.length >= 1) {

                prepareFormula(
                    "Area",
                    "Square"
                );

                value1El.value =
                    formulaNumbers[0];

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        if (
            normalized.includes("area of triangle") ||
            normalized.includes("triangle area")
        ) {

            if (formulaNumbers.length >= 2) {

                prepareFormula(
                    "Area",
                    "Triangle"
                );

                value1El.value =
                    formulaNumbers[0];

                value2El.value =
                    formulaNumbers[1];

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        if (
            normalized.includes("area of parallelogram") ||
            normalized.includes("parallelogram area")
        ) {

            if (formulaNumbers.length >= 2) {

                prepareFormula(
                    "Area",
                    "Parallelogram"
                );

                value1El.value =
                    formulaNumbers[0];

                value2El.value =
                    formulaNumbers[1];

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        // ---------- VOLUME ----------

        if (
            normalized.includes("volume of cube") ||
            normalized.includes("cube volume")
        ) {

            if (formulaNumbers.length >= 1) {

                prepareFormula(
                    "Volume",
                    "Cube"
                );

                value1El.value =
                    formulaNumbers[0];

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        if (
            normalized.includes("volume of cuboid") ||
            normalized.includes("cuboid volume")
        ) {

            if (formulaNumbers.length >= 3) {

                prepareFormula(
                    "Volume",
                    "Cuboid"
                );

                value1El.value =
                    formulaNumbers[0];

                value2El.value =
                    formulaNumbers[1];

                value3El.value =
                    formulaNumbers[2];

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        if (
            normalized.includes("volume of cylinder") ||
            normalized.includes("cylinder volume")
        ) {

            if (formulaNumbers.length >= 2) {

                prepareFormula(
                    "Volume",
                    "Cylinder"
                );

                value1El.value =
                    formulaNumbers[0];

                value2El.value =
                    formulaNumbers[1];

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        if (
            normalized.includes("volume of cone") ||
            normalized.includes("cone volume")
        ) {

            if (formulaNumbers.length >= 2) {

                prepareFormula(
                    "Volume",
                    "Cone"
                );

                value1El.value =
                    formulaNumbers[0];

                value2El.value =
                    formulaNumbers[1];

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        if (
            normalized.includes("volume of sphere") ||
            normalized.includes("sphere volume")
        ) {

            if (formulaNumbers.length >= 1) {

                prepareFormula(
                    "Volume",
                    "Sphere"
                );

                value1El.value =
                    formulaNumbers[0];

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        // ---------- PERIMETER ----------

        if (
            normalized.includes("perimeter of square") ||
            normalized.includes("square perimeter")
        ) {

            if (formulaNumbers.length >= 1) {

                prepareFormula(
                    "Perimeter",
                    "Square"
                );

                value1El.value =
                    formulaNumbers[0];

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        if (
            normalized.includes("perimeter of rectangle") ||
            normalized.includes("rectangle perimeter")
        ) {

            if (formulaNumbers.length >= 2) {

                prepareFormula(
                    "Perimeter",
                    "Rectangle"
                );

                value1El.value =
                    formulaNumbers[0];

                value2El.value =
                    formulaNumbers[1];

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        if (
            normalized.includes("perimeter of triangle") ||
            normalized.includes("triangle perimeter")
        ) {

            if (formulaNumbers.length >= 3) {

                prepareFormula(
                    "Perimeter",
                    "Triangle"
                );

                value1El.value =
                    formulaNumbers[0];

                value2El.value =
                    formulaNumbers[1];

                value3El.value =
                    formulaNumbers[2];

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        if (
            normalized.includes("perimeter of circle") ||
            normalized.includes("circumference of circle") ||
            normalized.includes("circle perimeter")
        ) {

            if (formulaNumbers.length >= 1) {

                prepareFormula(
                    "Perimeter",
                    "Circle"
                );

                value1El.value =
                    formulaNumbers[0];

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        if (
            normalized.includes("perimeter of parallelogram") ||
            normalized.includes("parallelogram perimeter")
        ) {

            if (formulaNumbers.length >= 2) {

                prepareFormula(
                    "Perimeter",
                    "Parallelogram"
                );

                value1El.value =
                    formulaNumbers[0];

                value2El.value =
                    formulaNumbers[1];

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        // ---------- SPEED ----------

        if (
            normalized.includes("speed")
        ) {

            if (formulaNumbers.length >= 2) {

                prepareFormula("Speed");

                value1El.value =
                    formulaNumbers[0];

                value2El.value =
                    formulaNumbers[1];

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        // ---------- SIMPLE INTEREST ----------

        if (
            normalized.includes("simple interest")
        ) {

            if (formulaNumbers.length >= 3) {

                prepareFormula(
                    "Simple Interest"
                );

                value1El.value =
                    formulaNumbers[0];

                value2El.value =
                    formulaNumbers[1];

                value3El.value =
                    formulaNumbers[2];

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        // ---------- BMI ----------

        if (
            normalized.includes("bmi") ||
            normalized.includes("body mass index")
        ) {

            if (formulaNumbers.length >= 2) {

                prepareFormula("BMI");

                const weight =
                    formulaNumbers[0];

                let height =
                    formulaNumbers[1];

                if (
                    textForNumbers.includes("cm")
                ) {
                    height =
                        height / 100;
                }

                value1El.value =
                    weight;

                value2El.value =
                    height;

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        // ---------- PERCENTAGE ----------

        if (
            normalized.includes("percentage") ||
            normalized.includes("percent")
        ) {

            if (formulaNumbers.length >= 2) {

                prepareFormula(
                    "Percentage"
                );

                value1El.value =
                    formulaNumbers[0];

                value2El.value =
                    formulaNumbers[1];

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        // ---------- MEAN ----------

        if (
            normalized.includes("mean")
        ) {

            if (formulaNumbers.length >= 1) {

                prepareFormula("Mean");

                value1El.value =
                    formulaNumbers.join(",");

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        // ---------- MEDIAN ----------

        if (
            normalized.includes("median")
        ) {

            if (formulaNumbers.length >= 1) {

                prepareFormula("Median");

                value1El.value =
                    formulaNumbers.join(",");

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        // ---------- MODE ----------

        if (
            normalized.includes("mode")
        ) {

            if (formulaNumbers.length >= 1) {

                prepareFormula("Mode");

                value1El.value =
                    formulaNumbers.join(",");

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        // ---------- VARIANCE ----------

        if (
            normalized.includes("variance")
        ) {

            if (formulaNumbers.length >= 1) {

                prepareFormula(
                    "Variance"
                );

                value1El.value =
                    formulaNumbers.join(",");

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        // ---------- STANDARD DEVIATION ----------

        if (
            normalized.includes("standard deviation")
        ) {

            if (formulaNumbers.length >= 1) {

                prepareFormula(
                    "Standard Deviation"
                );

                value1El.value =
                    formulaNumbers.join(",");

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        // ---------- Z SCORE ----------

        if (
            normalized.includes("z-score") ||
            normalized.includes("z score")
        ) {

            if (formulaNumbers.length >= 3) {

                prepareFormula(
                    "Z-Score"
                );

                value1El.value =
                    formulaNumbers[0];

                value2El.value =
                    formulaNumbers[1];

                value3El.value =
                    formulaNumbers[2];

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        // ---------- COVARIANCE ----------

        if (
            normalized.includes("covariance")
        ) {

            const separatorIndex =
                textForNumbers.indexOf("and");

            if (separatorIndex !== -1) {

                const firstPart =
                    textForNumbers.substring(
                        0,
                        separatorIndex
                    );

                const secondPart =
                    textForNumbers.substring(
                        separatorIndex + 3
                    );

                const xValues =
                    getNumbers(firstPart);

                const yValues =
                    getNumbers(secondPart);

                if (
                    xValues.length > 0 &&
                    yValues.length > 0
                ) {

                    prepareFormula(
                        "Covariance"
                    );

                    value1El.value =
                        xValues.join(",");

                    value2El.value =
                        yValues.join(",");

                    calculateFormula();

                    resultOnlyVoice();

                    return;
                }
            }

            if (formulaNumbers.length >= 2) {

                const midpoint =
                    Math.floor(
                        formulaNumbers.length / 2
                    );

                const xValues =
                    formulaNumbers.slice(
                        0,
                        midpoint
                    );

                const yValues =
                    formulaNumbers.slice(
                        midpoint
                    );

                prepareFormula(
                    "Covariance"
                );

                value1El.value =
                    xValues.join(",");

                value2El.value =
                    yValues.join(",");

                calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        // =========================================================
        // SCIENTIFIC FUNCTIONS
        // =========================================================

        // ---------------------------------------------------------
        // SIN
        // ---------------------------------------------------------

        if (
            normalized.match(/^sin\b/)
        ) {

            const num =
                parseFloat(
                    normalized.replace(
                        /^sin\b/,
                        ""
                    ).trim()
                );

            if (!isNaN(num)) {

                const answer =
                    calculateTrig(
                        "sin",
                        num
                    );

                const formatted =
                    formatNumber(answer);

                showExpression(
                    "sin(" + num + ")"
                );

                resultBox.innerText =
                    formatted;

                historyList.push(
                    "sin(" +
                    num +
                    ") = " +
                    formatted
                );

                saveHistory();

                speak(
                    "The answer is " +
                    formatted
                );

                return;
            }
        }

        // ---------------------------------------------------------
        // COS
        // ---------------------------------------------------------

        if (
            normalized.match(/^cos\b/)
        ) {

            const num =
                parseFloat(
                    normalized.replace(
                        /^cos\b/,
                        ""
                    ).trim()
                );

            if (!isNaN(num)) {

                const answer =
                    calculateTrig(
                        "cos",
                        num
                    );

                const formatted =
                    formatNumber(answer);

                showExpression(
                    "cos(" + num + ")"
                );

                resultBox.innerText =
                    formatted;

                historyList.push(
                    "cos(" +
                    num +
                    ") = " +
                    formatted
                );

                saveHistory();

                speak(
                    "The answer is " +
                    formatted
                );

                return;
            }
        }

        // ---------------------------------------------------------
        // TAN
        // ---------------------------------------------------------

        if (
            normalized.match(/^tan\b/)
        ) {

            const num =
                parseFloat(
                    normalized.replace(
                        /^tan\b/,
                        ""
                    ).trim()
                );

            if (!isNaN(num)) {

                const answer =
                    calculateTrig(
                        "tan",
                        num
                    );

                const formatted =
                    formatNumber(answer);

                showExpression(
                    "tan(" + num + ")"
                );

                resultBox.innerText =
                    formatted;

                historyList.push(
                    "tan(" +
                    num +
                    ") = " +
                    formatted
                );

                saveHistory();

                speak(
                    "The answer is " +
                    formatted
                );

                return;
            }
        }

        // ---------------------------------------------------------
        // LOG
        // ---------------------------------------------------------

        if (
            normalized.match(/^log\b/)
        ) {

            const num =
                parseFloat(
                    normalized.replace(
                        /^log\b/,
                        ""
                    ).trim()
                );

            if (!isNaN(num)) {

                const answer =
                    Math.log10(num);

                const formatted =
                    formatNumber(answer);

                showExpression(
                    "log(" + num + ")"
                );

                resultBox.innerText =
                    formatted;

                historyList.push(
                    "log(" +
                    num +
                    ") = " +
                    formatted
                );

                saveHistory();

                speak(
                    "The answer is " +
                    formatted
                );

                return;
            }
        }

        // ---------------------------------------------------------
        // LN
        // ---------------------------------------------------------

        if (
            normalized.match(/^ln\b/)
        ) {

            const num =
                parseFloat(
                    normalized.replace(
                        /^ln\b/,
                        ""
                    ).trim()
                );

            if (!isNaN(num)) {

                const answer =
                    Math.log(num);

                const formatted =
                    formatNumber(answer);

                showExpression(
                    "ln(" + num + ")"
                );

                resultBox.innerText =
                    formatted;

                historyList.push(
                    "ln(" +
                    num +
                    ") = " +
                    formatted
                );

                saveHistory();

                speak(
                    "The answer is " +
                    formatted
                );

                return;
            }
        }

        // ---------------------------------------------------------
        // SQRT
        // ---------------------------------------------------------

        if (
            normalized.match(/^sqrt\b/) ||
            normalized.includes("square root")
        ) {

            let num;

            if (normalized.includes("square root")) {

                num =
                    parseFloat(
                        normalized.replace(
                            /square root/,
                            ""
                        ).trim()
                    );

            } else {

                num =
                    parseFloat(
                        normalized.replace(
                            /^sqrt\b/,
                            ""
                        ).trim()
                    );
            }

            if (!isNaN(num)) {

                const answer =
                    Math.sqrt(num);

                const formatted =
                    formatNumber(answer);

                showExpression(
                    "√(" + num + ")"
                );

                resultBox.innerText =
                    formatted;

                historyList.push(
                    "√(" +
                    num +
                    ") = " +
                    formatted
                );

                saveHistory();

                speak(
                    "The answer is " +
                    formatted
                );

                return;
            }
        }

        // =========================================================
        // NORMAL ARITHMETIC CALCULATOR
        // =========================================================

        let arithmeticText =
            normalized;

        arithmeticText =
            arithmeticText
                .replace(/\bplus\b/g, "+")
                .replace(/\bminus\b/g, "-")
                .replace(/\btimes\b/g, "*")
                .replace(/\bmultiplied by\b/g, "*")
                .replace(/\bmultiply by\b/g, "*")
                .replace(/\binto\b/g, "*")
                .replace(/\bdivided by\b/g, "/")
                .replace(/\bdivide by\b/g, "/");

        // Remove calculator-only words
        arithmeticText =
            arithmeticText
                .replace(/\bcalculate\b/g, "")
                .replace(/\banswer\b/g, "")
                .replace(/\bplease\b/g, "")
                .trim();

        // Keep only arithmetic-compatible characters
        const safeExpression =
            arithmeticText.replace(
                /[^0-9+\-*/().%\s]/g,
                ""
            );

        if (
            safeExpression &&
            /[0-9]/.test(safeExpression)
        ) {

            try {

                const answer =
                    eval(
                        safeExpression
                            .replace(/%/g, "/100")
                    );

                if (
                    typeof answer === "number" &&
                    Number.isFinite(answer)
                ) {

                    let displayAnswer;

                    if (
                        Number.isInteger(answer)
                    ) {
                        displayAnswer =
                            String(answer);
                    } else {
                        displayAnswer =
                            formatNumber(answer);
                    }

                    showExpression(
                        safeExpression
                            .replace(/\s+/g, "")
                    );

                    resultBox.innerText =
                        displayAnswer;

                    historyList.push(
                        safeExpression
                            .replace(/\s+/g, "") +
                        " = " +
                        displayAnswer
                    );

                    saveHistory();

                    speak(
                        "The answer is " +
                        displayAnswer
                    );

                    return;
                }

            } catch (error) {
                // Continue to final error message below
            }
        }

        // =========================================================
        // NOTHING MATCHED
        // =========================================================

        clearExpression();

        resultBox.innerText =
            "Command not understood";
    }
