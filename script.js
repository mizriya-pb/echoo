// // console.log("Project Started");
// console.log("Scientific Voice Calculator Started");
let expression = "";
let historyList = [];
function saveHistory(){

    localStorage.setItem(
        "echoHistory",
        JSON.stringify(historyList)
    );
}

function loadHistory(){

    let savedHistory =
    localStorage.getItem("echoHistory");

    if(savedHistory){

        historyList =
        JSON.parse(savedHistory);
    }
}

loadHistory();

function appendValue(value) {

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

    expression = "";

    document.getElementById("expression").innerText = "";

    document.getElementById("result").innerText = "0";
}

function calculateScientific(type){

    let num = parseFloat(expression);

    if(isNaN(num)){
        document.getElementById("result").innerText = "Enter Number";
        return;
    }

    let result;

    switch(type){

        case "sin":
            result = Math.sin(num * Math.PI / 180);
            break;

        case "cos":
            result = Math.cos(num * Math.PI / 180);
            break;

        case "tan":
            result = Math.tan(num * Math.PI / 180);
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

    document.getElementById("result").innerText = result;
    historyList.push(type +"(" + num + ") = " + result);
    saveHistory();
}

function insertConstant(type){

    if(type === "pi"){
        expression = Math.PI.toString();
    }

    else if(type === "e"){
        expression = Math.E.toString();
    }

    document.getElementById("expression").innerText = expression;
}

function squareValue(){

    let num = parseFloat(expression);

    if(isNaN(num)){
        document.getElementById("result").innerText = "Enter Number";
        return;
    }

    let result = num * num;

    document.getElementById("result").innerText = result;
    historyList.push(num + "² = " + result);
    saveHistory();
}

function backspace(){

    expression = expression.slice(0, -1);

    document.getElementById("expression").innerText = expression;
}

function toggleFormulaList() {

    const list = document.getElementById("formulaList");

    if(list.style.display === "none"){
        list.style.display = "block";
    }
    else{
        list.style.display = "none";
    }

}

function toggleCurrencyList(){

    const list =
    document.getElementById("currencyList");

    if(list.style.display === "none"){
        list.style.display = "block";
    }
    else{
        list.style.display = "none";
    }

}

function toggleBinaryList(){

    const list =
    document.getElementById("binaryList");

    if(list.style.display === "none"){
        list.style.display = "block";
    }
    else{
        list.style.display = "none";
    }

}



function toggleMenu(){

    const menu =
    document.getElementById("sideMenu");

    if(menu.style.display === "block"){
        menu.style.display = "none";
    }
    else{
        menu.style.display = "block";
    }

}


const formulaSelect =
document.getElementById("formulaSelect");

const shapeContainer =
document.getElementById("shapeContainer");

const shapeSelect =
document.getElementById("shapeSelect");

formulaSelect.addEventListener("change", function(){

    let formula = this.value;

    shapeSelect.style.display = "block";
    document.getElementById("formulaInputs").style.display = "none";

    shapeSelect.innerHTML = "";

    if(formula === "Area"){

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
  
    else if(formula === "Volume"){

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



    else if(formula === "Perimeter"){

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
    else if(formula === "Speed"){
        
    shapeContainer.style.display = "block";
     shapeSelect.style.display = "none";
     document.getElementById("shapeLabel").style.display = "none";

    document.getElementById("formulaInputs").style.display = "block";

    document.getElementById("value2").style.display = "block";

    document.getElementById("value3").style.display = "none";

    document.getElementById("value1").placeholder = "Distance";

    document.getElementById("value2").placeholder = "Time";
}
else if(formula === "Simple Interest"){
    shapeContainer.style.display="block"
    shapeSelect.style.display = "none";
    document.getElementById("shapeLabel").style.display = "none";

    document.getElementById("formulaInputs").style.display = "block";

    document.getElementById("value2").style.display = "block";

    document.getElementById("value3").style.display = "block";

    document.getElementById("value1").placeholder = "Principal Amount";

    document.getElementById("value2").placeholder = "Rate (%)";

    document.getElementById("value3").placeholder = "Time (Years)";
}
else if(formula === "BMI"){

    shapeContainer.style.display = "block";
    shapeSelect.style.display = "none";
    document.getElementById("shapeLabel").style.display = "none";

    document.getElementById("formulaInputs").style.display = "block";

    document.getElementById("value2").style.display = "block";
    document.getElementById("value3").style.display = "none";

    document.getElementById("value1").placeholder = "Weight (kg)";
    document.getElementById("value2").placeholder = "Height (m)";
}
else if(formula === "Percentage"){

    shapeContainer.style.display = "block";
    shapeSelect.style.display = "none";
    document.getElementById("shapeLabel").style.display = "none";
   
    document.getElementById("formulaInputs").style.display = "block";

    document.getElementById("value2").style.display = "block";

    document.getElementById("value3").style.display = "none";

    document.getElementById("value1").placeholder = "Obtained Marks";

    document.getElementById("value2").placeholder = "Total Marks";
}
  
    else if(
    formula === "Mean" ||
    formula === "Median" ||
    formula === "Mode"
){

    shapeContainer.style.display = "block";
    shapeSelect.style.display = "none";
    document.getElementById("shapeLabel").style.display = "none";
  
    document.getElementById("formulaInputs").style.display = "block";

    document.getElementById("value2").style.display = "none";

    document.getElementById("value3").style.display = "none";

    document.getElementById("value1").placeholder =
    "Enter numbers";
}
else if(formula === "Variance"){

    shapeContainer.style.display = "block";
    shapeSelect.style.display = "none";
    document.getElementById("shapeLabel").style.display = "none";

    document.getElementById("formulaInputs").style.display = "block";

    document.getElementById("value2").style.display = "none";
    document.getElementById("value3").style.display = "none";

    document.getElementById("value1").placeholder =
    "Enter numbers";
}
else if(formula === "Standard Deviation"){

    shapeContainer.style.display = "block";
    shapeSelect.style.display = "none";
    document.getElementById("shapeLabel").style.display = "none";

    document.getElementById("formulaInputs").style.display = "block";

    document.getElementById("value2").style.display = "none";
    document.getElementById("value3").style.display = "none";

    document.getElementById("value1").placeholder =
    "Enter numbers";
}
else if(formula === "Z-Score"){

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
else if(formula === "Covariance"){

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
    else{

        shapeContainer.style.display = "none";
    }

});
document.getElementById("binarySelect")
.addEventListener("change", function(){

    document.getElementById("binaryInputs")
    .style.display = "block";
});
document.getElementById("currencySelect")
.addEventListener("change", function(){

    document.getElementById("currencyInputs")
    .style.display = "block";
});

shapeSelect.addEventListener("change", function(){
    document.getElementById("formulaInputs").style.display = "block";

    const shape = this.value;

    const value2 =
    document.getElementById("value2");
    const value3 =
document.getElementById("value3");

    if(
    shape === "Rectangle" ||
 
    shape === "Parallelogram" ||
    shape === "Cylinder" ||
    shape === "Cone"
){
    value2.style.display = "block";
    value3.style.display = "none";
}
   else if(shape === "Triangle"){

    value2.style.display = "block";
    value3.style.display = "block";
}

else if(shape === "Cuboid"){

    value2.style.display = "block";
    value3.style.display = "block";

}

else{

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
function openSettings(){

    document.getElementById("sideMenu").style.display = "none";

    document.getElementById("settingsPage").style.display = "block";

}


// Close Settings Page
function closeSettings(){

    document.getElementById("settingsPage").style.display = "none";

}


// Theme Change

function setTheme(mode){

    if(mode === "dark"){

        document.body.classList.add("dark-mode");

        localStorage.setItem("theme","dark");

    }

    else{

        document.body.classList.remove("dark-mode");

        localStorage.setItem("theme","default");

    }

}


// Load Saved Theme

window.onload = function(){

    let savedTheme = localStorage.getItem("theme");


    if(savedTheme === "dark"){

        document.body.classList.add("dark-mode");

    }

};
function openSettings(){

    document.getElementById("sideMenu").style.display="none";

    document.getElementById("settingsMenu").style.display="block";

}



function toggleSetting(id){

    let box=document.getElementById(id);


    if(box.style.display==="block"){

        box.style.display="none";

    }

    else{

        box.style.display="block";

    }

}
// Close menu/settings when clicking outside

document.addEventListener("click", function(event){

    const menu = document.getElementById("sideMenu");
    const settings = document.getElementById("settingsMenu");
    const menuButton = document.querySelector(".menu-btn");


    if(
        !menu.contains(event.target) &&
        !settings.contains(event.target) &&
        !menuButton.contains(event.target)
    ){

        menu.style.display = "none";

        settings.style.display = "none";

    }

});
function changeTheme(){

    let theme =
    document.getElementById("themeSelect").value;


    if(theme === "dark"){

        document.body.classList.add("dark-mode");

        localStorage.setItem("theme","dark");

    }

    else{

        document.body.classList.remove("dark-mode");

        localStorage.setItem("theme","default");

    }

}
window.onload = function(){

    let savedTheme = localStorage.getItem("theme");


    if(savedTheme === "dark"){

        document.body.classList.add("dark-mode");

        document.getElementById("themeSelect").value="dark";

    }

};