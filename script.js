// // console.log("Project Started");
// console.log("Scientific Voice Calculator Started");
let expression = "";

function appendValue(value) {

    expression += value;

    document.getElementById("expression").innerText = expression;
}

function calculateResult() {

    try {

        let answer = eval(expression);

        document.getElementById("result").innerText = answer;

    } catch {

        document.getElementById("result").innerText = "Error";
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

    document.getElementById("formulaInputs").style.display = "block";

    document.getElementById("value2").style.display = "block";

    document.getElementById("value3").style.display = "none";

    document.getElementById("value1").placeholder = "Distance";

    document.getElementById("value2").placeholder = "Time";
}
else if(formula === "Simple Interest"){
    shapeContainer.style.display="block"
    shapeSelect.style.display = "none";

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

    document.getElementById("formulaInputs").style.display = "block";

    document.getElementById("value2").style.display = "block";
    document.getElementById("value3").style.display = "none";

    document.getElementById("value1").placeholder = "Weight (kg)";
    document.getElementById("value2").placeholder = "Height (m)";
}
else if(formula === "Percentage"){

    shapeContainer.style.display = "block";
    shapeSelect.style.display = "none";
   
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
   
  
    document.getElementById("formulaInputs").style.display = "block";

    document.getElementById("value2").style.display = "none";

    document.getElementById("value3").style.display = "none";

    document.getElementById("value1").placeholder =
    "Enter numbers";
}
else if(formula === "Variance"){

    shapeContainer.style.display = "block";
    shapeSelect.style.display = "none";

    document.getElementById("formulaInputs").style.display = "block";

    document.getElementById("value2").style.display = "none";
    document.getElementById("value3").style.display = "none";

    document.getElementById("value1").placeholder =
    "Enter numbers";
}
else if(formula === "Standard Deviation"){

    shapeContainer.style.display = "block";
    shapeSelect.style.display = "none";

    document.getElementById("formulaInputs").style.display = "block";

    document.getElementById("value2").style.display = "none";
    document.getElementById("value3").style.display = "none";

    document.getElementById("value1").placeholder =
    "Enter numbers";
}
else if(formula === "Z-Score"){

    shapeContainer.style.display = "block";
    shapeSelect.style.display = "none";

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
     let inputText =
     document.getElementById("value1").value;
     let numbers =
     inputText.split(",").map(Number);
    if(formula === "Area"){

    if(shape === "Circle"){

        result = Math.PI * value1 * value1;

    }

    else if(shape === "Square"){

        result = value1 * value1;

    }

    else if(shape === "Rectangle"){

        let length =
parseFloat(document.getElementById("value1").value);

let width =
parseFloat(document.getElementById("value2").value);
        result = length * width;
    }

    else if(shape === "Triangle"){

        let base =
parseFloat(document.getElementById("value1").value);

let height =
parseFloat(document.getElementById("value2").value);
        result = 0.5 * base * height;
    }

    else if(shape === "Parallelogram"){

       let base =
parseFloat(document.getElementById("value1").value);

let height =
parseFloat(document.getElementById("value2").value);
        result = base * height;
    }
}
else if(formula === "Volume"){

    let value2 =
    parseFloat(document.getElementById("value2").value);

    let value3 =
    parseFloat(document.getElementById("value3").value);

    if(shape === "Cube"){

        result = value1 * value1 * value1;
    }

    else if(shape === "Cuboid"){

        result = value1 * value2 * value3;
    }

    else if(shape === "Cylinder"){

        result =
        Math.PI * value1 * value1 * value2;
    }

    else if(shape === "Cone"){

        result =
        (1/3) * Math.PI *
        value1 * value1 * value2;
    }

    else if(shape === "Sphere"){

        result =
        (4/3) * Math.PI *
        value1 * value1 * value1;
    }
}
else if(formula === "Perimeter"){

    let value2 =
    parseFloat(document.getElementById("value2").value);

    if(shape === "Square"){

        result = 4 * value1;
    }

    else if(shape === "Rectangle"){

        result = 2 * (value1 + value2);
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
}
    }

    else if(shape === "Circle"){

        result = 2 * Math.PI * value1;
    }

    else if(shape === "Parallelogram"){

        result = 2 * (value1 + value2);
    }
}
else if(formula === "Speed"){

    let distance =
    parseFloat(document.getElementById("value1").value);

    let time =
    parseFloat(document.getElementById("value2").value);

    result = distance / time;
}
else if(formula === "Simple Interest"){

    let principal =
    parseFloat(document.getElementById("value1").value);

    let rate =
    parseFloat(document.getElementById("value2").value);

    let time =
    parseFloat(document.getElementById("value3").value);

    result = (principal * rate * time) / 100;
}
else if(formula === "BMI"){

    let weight =
    parseFloat(document.getElementById("value1").value);

    let height =
    parseFloat(document.getElementById("value2").value);

    result = weight / (height * height);
}
else if(formula === "Percentage"){

    let obtained =
    parseFloat(document.getElementById("value1").value);

    let total =
    parseFloat(document.getElementById("value2").value);

    result = (obtained / total) * 100;
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
}
else if(formula === "Z-Score"){

    let x =
    parseFloat(document.getElementById("value1").value);

    let mean =
    parseFloat(document.getElementById("value2").value);

    let stdDev =
    parseFloat(document.getElementById("value3").value);

    result = (x - mean) / stdDev;
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
}
document.getElementById("result").innerText =
result.toFixed(2);
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

    document.getElementById("result").innerText =
    result.toFixed(2);
}
function convertBinary(){

    let value =
    document.getElementById("binaryValue").value;

    let type =
    document.getElementById("binarySelect").value;

    let result = "";

    if(type === "Decimal → Binary"){
        result = parseInt(value).toString(2);
    }

    else if(type === "Binary → Decimal"){
        result = parseInt(value, 2);
    }

    document.getElementById("result").innerText =
    result;
}
