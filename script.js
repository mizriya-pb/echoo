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

// function toggleFormulas(){

//     let panel =
//     document.getElementById("formulaPanel");

//     if(panel.style.display === "block"){

//         panel.style.display = "none";
//     }

//     else{

//         panel.style.display = "block";
//     }
// }

