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

    else{

        shapeContainer.style.display = "none";
    }

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
document.getElementById("result").innerText =
result.toFixed(2);
}