// // console.log("Project Started");
// console.log("Scientific Voice Calculator Started");
let buttonSoundEnabled = true;

const clickSound = new Audio("sounds/click.mp3");

function playButtonSound(){

    if(buttonSoundEnabled){

        clickSound.currentTime = 0;
        clickSound.play();
    }
}


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
    playButtonSound();
    expression += value;

    document.getElementById("expression").innerText = expression;
}

function calculateResult() {
   playButtonSound();
    try {

        let answer = eval(expression);

      document.getElementById("result").innerText = answer;

historyList.push(expression + " = " + answer);
saveHistory();

    } catch {

        document.getElementById("result").innerText = "Error";
    }
}

function clearDisplay() {
    playButtonSound();
    expression = "";

    document.getElementById("expression").innerText = "";

    document.getElementById("result").innerText = "0";

    //  Reset Everthing

    document.getElementById("formulaSelect").selectedIndex=0;
    let shapeContainer=document.getElementById("shapeContainer");
    if(shapeContainer){
        shapeContainer.style.display="none";
    }
    document.getElementById("shapeSelect").selectedIndex=0;
    let value1=document.getElementById("value1");
    if(value1)
        value1.value="";
    let value2=document.getElementById("value2");
    if(value2){
        value2.value="";
        value2.style.display="none";
    }
        let value3=document.getElementById("value3");
    if(value3){
        value3.value="";
        value3.style.display="none";
    }
 
  document.getElementById("currencySelect").selectedIndex=0;
  let currencyInputs=document.getElementById("currencyInputs");
  if(currencyInputs){
    currencyInputs.style.display="none";
  }
  let currencyAmount=document.getElementById("currencyAmount");
  if(currencyAmount){
    currencyAmount.value="";
  }

    document.getElementById("binarySelect").selectedIndex=0;
    let binaryInputs=document.getElementById("binaryInputs");
    if(binaryInputs){
        binaryInputs.style.display="none";
    }
    let binaryValue=document.getElementById("binaryValue");
    if(binaryValue){
        binaryValue.value="";
    }
}

function calculateScientific(type){
    playButtonSound();
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
    playButtonSound();
    if(type === "pi"){
        expression = Math.PI.toString();
    }

    else if(type === "e"){
        expression = Math.E.toString();
    }

    document.getElementById("expression").innerText = expression;
}

function squareValue(){
      playButtonSound();
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
    playButtonSound();
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
function calculateFormula(){

    let formula =
    document.getElementById("formulaSelect").value;

    let shape =
    document.getElementById("shapeSelect").value;

    let value1 =
    parseFloat(document.getElementById("value1").value);

    let result = 0;
    let historyText = "";
     let inputText =
     document.getElementById("value1").value;
     let numbers =
     inputText.split(",").map(Number);
    if(formula === "Area"){

    if(shape === "Circle"){

       result = Math.PI * value1 * value1;

historyText =
"Area of Circle | Radius=" +
value1 +
" → " +
result.toFixed(2);

    }

    else if(shape === "Square"){

       result = value1 * value1;

historyText =
"Area of Square | Side=" +
value1 +
" → " +
result.toFixed(2);

    }

    else if(shape === "Rectangle"){

        let length =
parseFloat(document.getElementById("value1").value);

let width =
parseFloat(document.getElementById("value2").value);
       
result = length * width;

historyText =
"Area of Rectangle | Length=" +
length +
", Width=" +
width +
" → " +
result.toFixed(2);
    }

    else if(shape === "Triangle"){

        let base =
parseFloat(document.getElementById("value1").value);

let height =
parseFloat(document.getElementById("value2").value);
      result = 0.5 * base * height;

historyText =
"Area of Triangle | Base=" +
base +
", Height=" +
height +
" → " +
result.toFixed(2);
    }

    else if(shape === "Parallelogram"){

       let base =
parseFloat(document.getElementById("value1").value);

let height =
parseFloat(document.getElementById("value2").value);
      result = base * height;

historyText =
"Area of Parallelogram | Base=" +
base +
", Height=" +
height +
" → " +
result.toFixed(2);
    }
}
else if(formula === "Volume"){

    let value2 =
    parseFloat(document.getElementById("value2").value);

    let value3 =
    parseFloat(document.getElementById("value3").value);

    if(shape === "Cube"){

       result = value1 * value1 * value1;

historyText =
"Volume of Cube | Side=" +
value1 +
" → " +
result.toFixed(2);
    }

    else if(shape === "Cuboid"){
   result = value1 * value2 * value3;

historyText =
"Volume of Cuboid | Length=" +
value1 +
", Width=" +
value2 +
", Height=" +
value3 +
" → " +
result.toFixed(2);
    }

    else if(shape === "Cylinder"){

      result = Math.PI * value1 * value1 * value2;

historyText =
"Volume of Cylinder | Radius=" +
value1 +
", Height=" +
value2 +
" → " +
result.toFixed(2);
    }

    else if(shape === "Cone"){
result = (1/3) * Math.PI * value1 * value1 * value2;

historyText =
"Volume of Cone | Radius=" +
value1 +
", Height=" +
value2 +
" → " +
result.toFixed(2);
    }

    else if(shape === "Sphere"){

    result = (4/3) * Math.PI * value1 * value1 * value1;

historyText =
"Volume of Sphere | Radius=" +
value1 +
" → " +
result.toFixed(2);
    }
}
else if(formula === "Perimeter"){

    let value2 =
    parseFloat(document.getElementById("value2").value);

    if(shape === "Square"){
result = 4 * value1;

historyText =
"Perimeter of Square | Side=" +
value1 +
" → " +
result.toFixed(2);
    }

    else if(shape === "Rectangle"){

       result = 2 * (value1 + value2);

historyText =
"Perimeter of Rectangle | Length=" +
value1 +
", Width=" +
value2 +
" → " +
result.toFixed(2);
    }

    else if(shape === "Triangle"){

  {

    let side1 =
    parseFloat(document.getElementById("value1").value);

    let side2 =
    parseFloat(document.getElementById("value2").value);

    let side3 =
    parseFloat(document.getElementById("value3").value);

    result = side1 + side2 + side3;
    historyText =
"Perimeter of Triangle | Sides=" +
side1 + "," + side2 + "," + side3 +
" → " +
result.toFixed(2);
}
    }

    else if(shape === "Circle"){

        result = 2 * Math.PI * value1;

historyText =
"Circumference of Circle | Radius=" +
value1 +
" → " +
result.toFixed(2);
    }

    else if(shape === "Parallelogram"){

      result = 2 * (value1 + value2);

historyText =
"Perimeter of Parallelogram | Base=" +
value1 +
", Side=" +
value2 +
" → " +
result.toFixed(2);
    }
}
else if(formula === "Speed"){

    let distance =
    parseFloat(document.getElementById("value1").value);

    let time =
    parseFloat(document.getElementById("value2").value);

    result = distance / time;
    historyText =
"Speed | Distance=" +
distance +
", Time=" +
time +
" → " +
result.toFixed(2);
}
else if(formula === "Simple Interest"){

    let principal =
    parseFloat(document.getElementById("value1").value);

    let rate =
    parseFloat(document.getElementById("value2").value);

    let time =
    parseFloat(document.getElementById("value3").value);

    result = (principal * rate * time) / 100;
    historyText =
"Simple Interest | P=" +
principal +
", R=" +
rate +
", T=" +
time +
" → " +
result.toFixed(2);
}
else if(formula === "BMI"){

    let weight =
    parseFloat(document.getElementById("value1").value);

    let height =
    parseFloat(document.getElementById("value2").value);

    result = weight / (height * height);
    historyText =
"BMI | Weight=" +
weight +
", Height=" +
height +
" → " +
result.toFixed(2);
}
else if(formula === "Percentage"){

    let obtained =
    parseFloat(document.getElementById("value1").value);

    let total =
    parseFloat(document.getElementById("value2").value);

    result = (obtained / total) * 100;
    historyText =
"Percentage | Marks=" +
obtained +
"/" +
total +
" → " +
result.toFixed(2) + "%";
}
else if(formula === "Mean"){

    let numbers =
    document.getElementById("value1").value
    .split(",")
    .map(Number);

    let sum = 0;

    for(let i = 0; i < numbers.length; i++){
        sum += numbers[i];
    }

    result = sum / numbers.length;
    historyText =
"Mean | Data=" +
numbers.join(",") +
" → " +
result.toFixed(2);
}
else if(formula === "Median"){

    let numbers =
    document.getElementById("value1").value
    .split(",")
    .map(Number);

    numbers.sort((a,b) => a-b);

    let middle =
    Math.floor(numbers.length / 2);

    if(numbers.length % 2 === 0){

        result =
        (numbers[middle-1] + numbers[middle]) / 2;
    }
    else{

        result = numbers[middle];
    }
    historyText =
"Median | Data=" +
numbers.join(",") +
" → " +
result.toFixed(2);
}
else if(formula === "Mode"){

    let numbers =
    document.getElementById("value1").value
    .split(",")
    .map(Number);

    let count = {};
    let maxCount = 0;
    let mode = numbers[0];

    for(let num of numbers){

        count[num] = (count[num] || 0) + 1;

        if(count[num] > maxCount){

            maxCount = count[num];
            mode = num;
        }
    }

    result = mode;
    historyText =
"Mode | Data=" +
numbers.join(",") +
" → " +
result;
}
else if(formula === "Variance"){

    let numbers =
    document.getElementById("value1").value
    .split(",")
    .map(Number);

    let mean =
    numbers.reduce((a,b)=>a+b,0) / numbers.length;

    let variance =
    numbers.reduce((sum,num)=>
    sum + Math.pow(num-mean,2),0)
    / numbers.length;

    result = variance;
    historyText =
"Variance | Data=" +
numbers.join(",") +
" → " +
result.toFixed(2);
}
else if(formula === "Standard Deviation"){

    let numbers =
    document.getElementById("value1").value
    .split(",")
    .map(Number);

    let mean =
    numbers.reduce((a,b)=>a+b,0) / numbers.length;

    let variance =
    numbers.reduce((sum,num)=>
    sum + Math.pow(num-mean,2),0)
    / numbers.length;

    result = Math.sqrt(variance);
    historyText =
"Standard Deviation | Data=" +
numbers.join(",") +
" → " +
result.toFixed(2);
}
else if(formula === "Z-Score"){

    let x =
    parseFloat(document.getElementById("value1").value);

    let mean =
    parseFloat(document.getElementById("value2").value);

    let stdDev =
    parseFloat(document.getElementById("value3").value);

    result = (x - mean) / stdDev;
    historyText =
"Z-Score | X=" +
x +
", Mean=" +
mean +
", SD=" +
stdDev +
" → " +
result.toFixed(2);
}
else if(formula === "Covariance"){

    let x =
    document.getElementById("value1").value
    .split(",")
    .map(Number);

    let y =
    document.getElementById("value2").value
    .split(",")
    .map(Number);

    let meanX =
    x.reduce((a,b)=>a+b,0) / x.length;

    let meanY =
    y.reduce((a,b)=>a+b,0) / y.length;

    let sum = 0;

    for(let i=0; i<x.length; i++){

        sum +=
        (x[i]-meanX) *
        (y[i]-meanY);
    }

    result = sum / x.length;
    historyText =
"Covariance | X=" +
x.join(",") +
" | Y=" +
y.join(",") +
" → " +
result.toFixed(2);
}
document.getElementById("result").innerText =
result.toFixed(2);
if(historyText !== ""){

    historyList.push(historyText);

}
else{

    historyList.push(
        formula +
        (shape ? " (" + shape + ")" : "") +
        " = " +
        result.toFixed(2)
    );
}
saveHistory();
}
function convertCurrency(){

    let amount =
    parseFloat(document.getElementById("currencyAmount").value);

    let type =
    document.getElementById("currencySelect").value;

    let result = 0;

    if(type === "INR → USD"){
    result = amount / 85;
}
else if(type === "USD → INR"){
    result = amount * 85;
}
else if(type === "INR → EUR"){
    result = amount / 98;
}
else if(type === "EUR → INR"){
    result = amount * 98;
}
else if(type === "INR → GBP"){
    result = amount / 115;
}
else if(type === "GBP → INR"){
    result = amount * 115;
}

  document.getElementById("result").innerText =
result.toFixed(2);

historyList.push(
    type + ": " +
    amount + " = " +
    result.toFixed(2)
);
saveHistory();
}

function convertBinary(){

    let value = document.getElementById("binaryValue").value;

    let type = document.getElementById("binarySelect").value;

    let result = "";

    if(type === "Decimal → Binary"){
        result = parseInt(value,10).toString(2);
    }

    else if(type === "Binary → Decimal"){
        result = parseInt(value,2);
    }

    else if(type === "Decimal → Octal"){
        result = parseInt(value,10).toString(8);
    }

    else if(type === "Octal → Decimal"){
        result = parseInt(value,8);
    }

    else if(type === "Decimal → Hexadecimal"){
        result = parseInt(value,10).toString(16).toUpperCase();
    }

    else if(type === "Hexadecimal → Decimal"){
        result = parseInt(value,16);
    }
document.getElementById("result").innerText =
result;

historyList.push(
    type + ": " +
    value + " = " +
    result
);
saveHistory();
}

function openHistory(){
    document.getElementById("sideMenu").style.display="none"
    document.getElementById("historyPage").style.display = "block";

    let content =
    document.getElementById("historyContent");

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

function clearHistory(){

    historyList = [];

    localStorage.removeItem("echoHistory");

    document.getElementById("historyContent").innerHTML =
    "No History Yet";
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

const VoiceBtn =document.getElementById("voiceBtn");
const soundWave=document.querySelector(".sound-wave");
VoiceBtn.addEventListener("Click",()=>{
    soundWave.classList.toggle("active");
});

function showAbout(){

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

    recognition.onresult = function(event) {

        let speechText =
            event.results[0][0].transcript.toLowerCase();

        processVoiceCommand(speechText);

    };

    recognition.onerror = function(event) {

        console.log(
            "Voice Error:",
            event.error
        );

    };

}

function processVoiceCommand(text){

    text = text.toLowerCase();

    text=text.replace("calculate","");
    text=text.replace("what is","");
    text=text.replace("solve","");
 text = text.replace(/plus/g,"+");
    text = text.replace(/minus/g,"-");
    text = text.replace(/times/g,"*");
    text = text.replace(/into/g,"*");
    text = text.replace(/multiplied by/g,"*");
    text = text.replace(/divide by/g,"/");
    text = text.replace(/divided by/g,"/");
    text=text.replace(/point/g,".");
    text=text.replace(/power/g,"**");

    text = text.replace(/one/g,"1");
    text = text.replace(/two/g,"2");
    text = text.replace(/three/g,"3");
    text = text.replace(/four/g,"4");
    text = text.replace(/five/g,"5");
    text = text.replace(/six/g,"6");
    text = text.replace(/seven/g,"7");
    text = text.replace(/eight/g,"8");
    text = text.replace(/nine/g,"9");
    text = text.replace(/zero/g,"0");

    document.getElementById("expression").innerText =
        text;
    if(text.includes("sin")){
    let num = parseFloat(text.replace("sin",""));
    let answer = Math.sin(num * Math.PI / 180);

    document.getElementById("expression").innerText =
    "sin(" + num + ")";

    document.getElementById("result").innerText =
    answer.toFixed(4);

    return;
}

if(text.includes("cos")){
    let num = parseFloat(text.replace("cos",""));
    let answer = Math.cos(num * Math.PI / 180);

    document.getElementById("expression").innerText =
    "cos(" + num + ")";

    document.getElementById("result").innerText =
    answer.toFixed(4);

    return;
}

if(text.includes("tan")){
    let num = parseFloat(text.replace("tan",""));
    let answer = Math.tan(num * Math.PI / 180);

    document.getElementById("expression").innerText =
    "tan(" + num + ")";

    document.getElementById("result").innerText =
    answer.toFixed(4);

    return;
}
if(text.includes("log")){

    let num = parseFloat(
        text.replace("log","")
    );

    let answer = Math.log10(num);

    document.getElementById("expression").innerText =
    "log(" + num + ")";

    document.getElementById("result").innerText =
    answer.toFixed(4);

    return;
}
if(text.includes("ln")){

    let num = parseFloat(
        text.replace("ln","")
    );

    let answer = Math.log(num);

    document.getElementById("expression").innerText =
    "ln(" + num + ")";

    document.getElementById("result").innerText =
    answer.toFixed(4);

    return;
}
if(text.includes("sqrt")){

    let num = parseFloat(
        text.replace("sqrt","")
    );

    let answer = Math.sqrt(num);

    document.getElementById("expression").innerText =
    "√(" + num + ")";

    document.getElementById("result").innerText =
    answer.toFixed(4);

    return;
}
if(text === "pi"){

    document.getElementById("expression").innerText =
    "π";

    document.getElementById("result").innerText =
    Math.PI.toFixed(6);

    return;
}
if(text === "e"){

    document.getElementById("expression").innerText =
    "e";

    document.getElementById("result").innerText =
    Math.E.toFixed(6);

    return;
}

    try{

        let answer = eval(text);

        document.getElementById("result").innerText =
            answer;

        let speech =
            new SpeechSynthesisUtterance(
                "The answer is " + answer
            );

        speechSynthesis.speak(speech);

    }

    catch{

        document.getElementById("result").innerText =
            "Error";

    }

}