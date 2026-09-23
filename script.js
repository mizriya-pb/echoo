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
function updateResult(value) {

    document.getElementById("result").innerText = value;

}
async function calculateResult() {

    playButtonSound();

    try {

        let calcExpression = expression;

        // Convert calculator symbols to JavaScript operators
        calcExpression = calcExpression
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/−/g, "-");

        // Square root
        calcExpression = calcExpression.replace(
            /√\s*(\d+(?:\.\d+)?)/g,
            "sqrt($1)"
        );

        // SIN
        // SIN
        calcExpression = calcExpression.replace(
            /sin\((\d+(?:\.\d+)?)\)/g,
            "sin($1)"
        );
            
        

        
        // COS
        calcExpression = calcExpression.replace(
            /cos\((\d+(?:\.\d+)?)\)/g,
            "cos($1)"
        );

        // TAN
        // TAN
        // TAN
        calcExpression = calcExpression.replace(
           /tan\((\d+(?:\.\d+)?)\)/g,
           function(match, num) {
            return angleMode === "radian"
              ? "tan((" + num + ") * 180 / Math.PI)"
              : "tan(" + num + ")";
           }
      );
        

        // LOG
        // LOG
        calcExpression = calcExpression.replace(
           /log\((\d+(?:\.\d+)?)\)/g,
           "log($1)"
      );

       // LN
        calcExpression = calcExpression.replace(
           /ln\((\d+(?:\.\d+)?)\)/g,
           "ln($1)"
       );
        // Send the calculation to Django backend
    const response = await fetch(
      "http://127.0.0.1:8000/api/calculate/?expression=" +
       encodeURIComponent(calcExpression)
        );

    const data = await response.json();

    if (data.error) {
    if (data.error === "Tangent is undefined") {
        document.getElementById("result").innerText = "Undefined";
        return;
    }

    throw new Error(data.error);
}


    let answer = data.result;
        


        

        // Show result
        document.getElementById("result").innerText =
            Number(answer).toFixed(decimalPlaces);

        // Save history
        historyList.push(
            expression + " = " + Number(answer).toFixed(decimalPlaces)
        );

        saveHistory();

    } catch (error) {

        console.log("Calculation Error:", error);

        document.getElementById("result").innerText = "Error";
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

    if (
        type === "sin" ||
        type === "cos" ||
        type === "tan" ||
        type === "log" ||
        type === "ln"
    ) {
        appendValue(type + "(");
        return;
    }

    if (type === "sqrt") {
        appendValue("√");
        return;
    }
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
    setPanelBackButton(true);
}

function showCurrencySection() {

    document.getElementById("formulaSection").style.display = "none";
    document.getElementById("currencySection").style.display = "block";
    document.getElementById("binarySection").style.display = "none";
    setPanelBackButton(true);
}

function showBinarySection() {

    document.getElementById("formulaSection").style.display = "none";
    document.getElementById("currencySection").style.display = "none";
    document.getElementById("binarySection").style.display = "block";
    setPanelBackButton(true);
}

function setPanelBackButton(show) {
    const btn = document.getElementById("panelBackBtn");
    if (btn) {
        btn.style.display = show ? "block" : "none";
    }
}

function goBackRightPanel() {
    if (typeof playButtonSound === "function") {
        playButtonSound();
    }
    resetRightPanel();
}

function resetRightPanel() {

    setPanelBackButton(false);

    // Show all three main sections
    document.getElementById("formulaSection").style.display = "block";
    document.getElementById("currencySection").style.display = "block";
    document.getElementById("binarySection").style.display = "block";

    // Reset formula
    document.getElementById("formulaSelect").selectedIndex = 0;

    const shapeContainer = document.getElementById("shapeContainer");
    if (shapeContainer) {
        shapeContainer.style.display = "none";
    }

    const formulaInputs = document.getElementById("formulaInputs");
    if (formulaInputs) {
        formulaInputs.style.display = "none";
    }

    // Clear formula inputs
    document.getElementById("value1").value = "";
    document.getElementById("value2").value = "";
    document.getElementById("value3").value = "";

    // Reset currency
    document.getElementById("currencySelect").selectedIndex = 0;

    const currencyInputs =
        document.getElementById("currencyInputs");

    if (currencyInputs) {
        currencyInputs.style.display = "none";
    }

    document.getElementById("currencyAmount").value = "";

    // Reset binary
    document.getElementById("binarySelect").selectedIndex = 0;

    const binaryInputs =
        document.getElementById("binaryInputs");

    if (binaryInputs) {
        binaryInputs.style.display = "none";
    }

    document.getElementById("binaryValue").value = "";
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
    const formula = document.getElementById("formulaSelect").value;

    const value1 = document.getElementById("value1");
    const value2 = document.getElementById("value2");
    const value3 = document.getElementById("value3");

    // Labels for each input, so it is clear what to type where
    const labels = {
        "Area": {
            "Circle": ["Radius"],
            "Square": ["Side"],
            "Rectangle": ["Length", "Width"],
            "Triangle": ["Base", "Height"],
            "Parallelogram": ["Base", "Height"]
        },
        "Volume": {
            "Cube": ["Side"],
            "Cuboid": ["Length", "Width", "Height"],
            "Cylinder": ["Radius", "Height"],
            "Cone": ["Radius", "Height"],
            "Sphere": ["Radius"]
        },
        "Perimeter": {
            "Circle": ["Radius"],
            "Square": ["Side"],
            "Rectangle": ["Length", "Width"],
            "Triangle": ["Side 1", "Side 2", "Side 3"],
            "Parallelogram": ["Base", "Side"]
        }
    };

    const fields = (labels[formula] && labels[formula][shape]) || ["Enter Value"];

    value1.placeholder = fields[0];
    value2.placeholder = fields[1] || "Second Value";
    value3.placeholder = fields[2] || "Third Value";

    value2.style.display = fields.length >= 2 ? "block" : "none";
    value3.style.display = fields.length >= 3 ? "block" : "none";
});
async function calculateFormula() {

    let formula =
        document.getElementById("formulaSelect").value;

    let shape =
        document.getElementById("shapeSelect").value;

    let value1 =
        parseFloat(document.getElementById("value1").value);

    let result = null;
    let historyText = "";
    let inputText =
        document.getElementById("value1").value;
    let numbers =
        inputText.split(",").map(Number);
    if (formula === "Area") {

        if (shape === "Circle") {
    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=circle_area&radius=" +
        encodeURIComponent(value1)
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText = data.error;
        return;
    }

    result = data.result;

    historyText =
        "Area of Circle | Radius=" +
        value1 +
        " → " +
        result.toFixed(2);
}

        else if (shape === "Square") {
    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=square_area&side=" +
        encodeURIComponent(value1)
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText = data.error;
        return;
    }

    result = data.result;
            historyText =
                "Area of Square | Side=" +
                value1 +
                " → " +
                result.toFixed(2);

        }

      else if (shape === "Rectangle") {

    let length =
        parseFloat(document.getElementById("value1").value);

    let width =
        parseFloat(document.getElementById("value2").value);

    console.log("Rectangle values:", length, width);

    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=rectangle_area&length=" +
        encodeURIComponent(length) +
        "&width=" +
        encodeURIComponent(width)
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText = data.error;
        return;
    }

    result = data.result;

    historyText =
        "Area of Rectangle | Length=" +
        length +
        ", Width=" +
        width +
        " → " +
        result.toFixed(2);
}

        else if (shape === "Triangle") {

    let base =
        parseFloat(document.getElementById("value1").value);

    let height =
        parseFloat(document.getElementById("value2").value);

    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=triangle_area&base=" +
        encodeURIComponent(base) +
        "&height=" +
        encodeURIComponent(height)
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText = data.error;
        return;
    }

    result = data.result;

    historyText =
        "Area of Triangle | Base=" +
        base +
        ", Height=" +
        height +
        " → " +
        result.toFixed(2);
}
       else if (shape === "Parallelogram") {

    let base =
        parseFloat(document.getElementById("value1").value);

    let height =
        parseFloat(document.getElementById("value2").value);

    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=parallelogram_area&base=" +
        encodeURIComponent(base) +
        "&height=" +
        encodeURIComponent(height)
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText = data.error;
        return;
    }

    result = data.result;

    historyText =
        "Area of Parallelogram | Base=" +
        base +
        ", Height=" +
        height +
        " → " +
        result.toFixed(2);
}
    }
    else if (formula === "Volume") {

        let value2 =
            parseFloat(document.getElementById("value2").value);

        let value3 =
            parseFloat(document.getElementById("value3").value);

        if (shape === "Cube") {

    let side =
        parseFloat(document.getElementById("value1").value);

    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=cube_volume&side=" +
        encodeURIComponent(side)
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText = data.error;
        return;
    }

    result = data.result;

    historyText =
        "Volume of Cube | Side=" +
        side +
        " → " +
        result.toFixed(2);
}
        else if (shape === "Cuboid") {

    let length =
        parseFloat(document.getElementById("value1").value);

    let width =
        parseFloat(document.getElementById("value2").value);

    let height =
        parseFloat(document.getElementById("value3").value);

    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=cuboid_volume&length=" +
        encodeURIComponent(length) +
        "&width=" +
        encodeURIComponent(width) +
        "&height=" +
        encodeURIComponent(height)
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText = data.error;
        return;
    }

    result = data.result;

    historyText =
        "Volume of Cuboid | Length=" +
        length +
        ", Width=" +
        width +
        ", Height=" +
        height +
        " → " +
        result.toFixed(2);
}

       else if (shape === "Cylinder") {

    let radius =
        parseFloat(document.getElementById("value1").value);

    let height =
        parseFloat(document.getElementById("value2").value);

    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=cylinder_volume&radius=" +
        encodeURIComponent(radius) +
        "&height=" +
        encodeURIComponent(height)
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText = data.error;
        return;
    }

    result = data.result;

    historyText =
        "Volume of Cylinder | Radius=" +
        radius +
        ", Height=" +
        height +
        " → " +
        result.toFixed(2);
}

       else if (shape === "Cone") {

    let radius =
        parseFloat(document.getElementById("value1").value);

    let height =
        parseFloat(document.getElementById("value2").value);

    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=cone_volume&radius=" +
        encodeURIComponent(radius) +
        "&height=" +
        encodeURIComponent(height)
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText = data.error;
        return;
    }

    result = data.result;

    historyText =
        "Volume of Cone | Radius=" +
        radius +
        ", Height=" +
        height +
        " → " +
        result.toFixed(2);
}
       else if (shape === "Sphere") {

    let radius =
        parseFloat(document.getElementById("value1").value);

    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=sphere_volume&radius=" +
        encodeURIComponent(radius)
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText = data.error;
        return;
    }

    result = data.result;

    historyText =
        "Volume of Sphere | Radius=" +
        radius +
        " → " +
        result.toFixed(2);
}
    }
    else if (formula === "Perimeter") {

        let value2 =
            parseFloat(document.getElementById("value2").value);

        if (shape === "Square") {

    let side =
        parseFloat(document.getElementById("value1").value);

    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=square_perimeter&side=" +
        encodeURIComponent(side)
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText = data.error;
        return;
    }

    result = data.result;

    historyText =
        "Perimeter of Square | Side=" +
        side +
        " → " +
        result.toFixed(2);
}
else if (shape === "Rectangle") {

    let length =
        parseFloat(document.getElementById("value1").value);

    let width =
        parseFloat(document.getElementById("value2").value);

    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=rectangle_perimeter&length=" +
        encodeURIComponent(length) +
        "&width=" +
        encodeURIComponent(width)
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText = data.error;
        return;
    }

    result = data.result;

    historyText =
        "Perimeter of Rectangle | Length=" +
        length +
        ", Width=" +
        width +
        " → " +
        result.toFixed(2);
}

        else if (shape === "Triangle") {

    let a =
        parseFloat(document.getElementById("value1").value);

    let b =
        parseFloat(document.getElementById("value2").value);

    let c =
        parseFloat(document.getElementById("value3").value);

    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=triangle_perimeter" +
      "&side1=" + encodeURIComponent(a) +
      "&side2=" + encodeURIComponent(b) +
      "&side3=" + encodeURIComponent(c)
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText = data.error;
        return;
    }

    result = data.result;

    historyText =
        "Perimeter of Triangle | A=" +
        a +
        ", B=" +
        b +
        ", C=" +
        c +
        " → " +
        result.toFixed(2);
}
    

        else if (shape === "Circle") {

    let radius =
        parseFloat(document.getElementById("value1").value);

    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=circle_perimeter&radius=" +
        encodeURIComponent(radius)
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText = data.error;
        return;
    }

    result = data.result;

    historyText =
        "Perimeter of Circle | Radius=" +
        radius +
        " → " +
        result.toFixed(2);
}

        else if (shape === "Parallelogram") {

    let base =
        parseFloat(document.getElementById("value1").value);

    let side =
        parseFloat(document.getElementById("value2").value);

    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=parallelogram_perimeter" +
        "&base=" + encodeURIComponent(base) +
        "&side=" + encodeURIComponent(side)
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText = data.error;
        return;
    }

    result = data.result;

    historyText =
        "Perimeter of Parallelogram | Base=" +
        base +
        ", Side=" +
        side +
        " → " +
        result.toFixed(2);
}
    }
   else if (formula === "Speed") {

    let distance =
        parseFloat(document.getElementById("value1").value);

    let time =
        parseFloat(document.getElementById("value2").value);

    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=speed" +
        "&distance=" + encodeURIComponent(distance) +
        "&time=" + encodeURIComponent(time)
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText = data.error;
        return;
    }

    result = data.result;

    historyText =
        "Speed | Distance=" +
        distance +
        ", Time=" +
        time +
        " → " +
        result.toFixed(2);
}
    else if (formula === "Simple Interest") {

    let principal =
        parseFloat(document.getElementById("value1").value);

    let rate =
        parseFloat(document.getElementById("value2").value);

    let time =
        parseFloat(document.getElementById("value3").value);

    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=simple_interest" +
        "&principal=" + encodeURIComponent(principal) +
        "&rate=" + encodeURIComponent(rate) +
        "&time=" + encodeURIComponent(time)
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText = data.error;
        return;
    }

    result = data.result;

    historyText =
        "Simple Interest | Principal=" +
        principal +
        ", Rate=" +
        rate +
        ", Time=" +
        time +
        " → " +
        result.toFixed(2);
}
    else if (formula === "BMI") {

    let weight =
        parseFloat(document.getElementById("value1").value);

    let height =
        parseFloat(document.getElementById("value2").value);

    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=bmi" +
        "&weight=" + encodeURIComponent(weight) +
        "&height=" + encodeURIComponent(height)
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText = data.error;
        return;
    }

    result = data.result;

    historyText =
        "BMI | Weight=" +
        weight +
        ", Height=" +
        height +
        " → " +
        result.toFixed(2);
    }
else if (formula === "Percentage") {

    let value =
        parseFloat(document.getElementById("value1").value);

    let total =
        parseFloat(document.getElementById("value2").value);

    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=percentage" +
        "&part=" + encodeURIComponent(value) +
        "&whole=" + encodeURIComponent(total)
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText = data.error;
        return;
    }

    result = data.result;

    historyText =
        "Percentage | Value=" +
        value +
        ", Total=" +
        total +
        " → " +
        result.toFixed(2);
}

    else if (formula === "Mean") {

    let numbers =
        document.getElementById("value1").value
            .split(",")
            .map(Number);

    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=mean" +
        "&numbers=" + encodeURIComponent(numbers.join(","))
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText = data.error;
        return;
    }

    result = data.result;

    historyText =
        "Mean | Data=" +
        numbers.join(",") +
        " → " +
        result.toFixed(2);
}
    else if (formula === "Median") {

    let numbers =
        document.getElementById("value1").value
            .split(",")
            .map(Number);

    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=median" +
        "&numbers=" + encodeURIComponent(numbers.join(","))
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText = data.error;
        return;
    }

    result = data.result;

    historyText =
        "Median | Data=" +
        numbers.join(",") +
        " → " +
        result.toFixed(2);
}
else if (formula === "Mode") {

    let input =
        document.getElementById("value1").value.trim();

    let numbers =
        input.split(",").map(Number);

    if (
        numbers.length === 0 ||
        numbers.some(num => isNaN(num))
    ) {
        document.getElementById("result").innerText =
            "Enter valid values";
        return;
    }

    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=mode" +
        "&numbers=" +
        encodeURIComponent(numbers.join(","))
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText =
            data.error;
        return;
    }

    result = Number(data.result);

    historyText =
        "Mode | Data=" +
        numbers.join(",") +
        " → " +
        result.toFixed(2);
}


   else if (formula === "Variance") {

    let numbers =
        document.getElementById("value1").value
            .split(",")
            .map(Number);

    if (
        numbers.length === 0 ||
        numbers.some(num => isNaN(num))
    ) {
        document.getElementById("result").innerText =
            "Enter valid values";
        return;
    }

    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=variance_population" +
        "&numbers=" +
        encodeURIComponent(numbers.join(","))
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText =
            data.error;
        return;
    }

    result = Number(data.result);

    historyText =
        "Variance | Data=" +
        numbers.join(",") +
        " → " +
        result.toFixed(2);
}
    else if (formula === "Standard Deviation") {

    let numbers =
        document.getElementById("value1").value
            .split(",")
            .map(Number);

    if (
        numbers.length === 0 ||
        numbers.some(num => isNaN(num))
    ) {
        document.getElementById("result").innerText =
            "Enter valid values";
        return;
    }

    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=std_dev_population" +
        "&numbers=" +
        encodeURIComponent(numbers.join(","))
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText =
            data.error;
        return;
    }

    result = Number(data.result);

    historyText =
        "Standard Deviation | Data=" +
        numbers.join(",") +
        " → " +
        result.toFixed(2);
}
else if (formula === "Z-Score") {

    let x = parseFloat(
        document.getElementById("value1").value
    );

    let mean = parseFloat(
        document.getElementById("value2").value
    );

    let stdDev = parseFloat(
        document.getElementById("value3").value
    );

    if (
        isNaN(x) ||
        isNaN(mean) ||
        isNaN(stdDev)
    ) {
        document.getElementById("result").innerText =
            "Enter valid values";
        return;
    }

    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=z_score" +
        "&value=" + encodeURIComponent(x) +
        "&mean=" + encodeURIComponent(mean) +
        "&std_dev=" + encodeURIComponent(stdDev)
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText =
            data.error;
        return;
    }

    result = Number(data.result);

    historyText =
        "Z-Score | X=" + x +
        ", Mean=" + mean +
        ", SD=" + stdDev +
        " → " + result.toFixed(2);

}
else if (formula === "Covariance") {
    let xValues =
        document.getElementById("value1").value
            .split(",")
            .map(Number);

    let yValues =
        document.getElementById("value2").value
            .split(",")
            .map(Number);

    if (
        xValues.length === 0 ||
        yValues.length === 0 ||
        xValues.some(num => isNaN(num)) ||
        yValues.some(num => isNaN(num))
    ) {
        document.getElementById("result").innerText =
            "Enter valid values";
        return;
    }

    if (xValues.length !== yValues.length) {
        document.getElementById("result").innerText =
            "Both datasets must have the same length";
        return;
    }

    const response = await fetch(
        "http://127.0.0.1:8000/api/formula/?formula=covariance" +
        "&numbers_x=" + encodeURIComponent(xValues.join(",")) +
        "&numbers_y=" + encodeURIComponent(yValues.join(","))
    );

    const data = await response.json();

    if (data.error) {
        document.getElementById("result").innerText =
            data.error;
        return;
    }

    result = Number(data.result);

    historyText =
        "Covariance | X=" +
        xValues.join(",") +
        " | Y=" +
        yValues.join(",") +
        " → " +
        result.toFixed(2);
}
    let invalidSize = false;

    if (formula === "Area" || formula === "Volume" || formula === "Perimeter") {

        // lengths must be positive - look only at the boxes that are showing
        ["value1", "value2", "value3"].forEach(function (id) {
            const box = document.getElementById(id);

            if (box && getComputedStyle(box).display !== "none") {
                const v = parseFloat(box.value);

                if (!isNaN(v) && v <= 0) invalidSize = true;
            }
        });
    }

    if (!isFinite(result) || invalidSize) {
        document.getElementById("result").innerText = "Enter valid values";
        return;
    }

    document.getElementById("result").innerText =
        result.toFixed(2);
    if (historyText !== "") {

        historyList.push(historyText);

    }
    else {

        historyList.push(
            formula +
            (shape ? " (" + shape + ")" : "") +
            " = " +
            result.toFixed(2)
        );
    }
    saveHistory();
    resetRightPanel();
}

// =============================================================
// LIVE CURRENCY RATES (Frankfurter API - European Central Bank data)
// Falls back to cached rates, then to built-in approximate rates.
// =============================================================

// Approximate fallback: how many INR one unit of each currency is worth
const FALLBACK_RATES = { USD: 85, EUR: 98, GBP: 115 };
const RATE_CACHE_KEY = "echoCurrencyRates";
const RATE_MAX_AGE_MS = 6 * 60 * 60 * 1000;   // refresh after 6 hours

let currencyRates = Object.assign({}, FALLBACK_RATES);
let currencyRateStatus = { live: false, date: null };

function updateRateInfo() {

    const el = document.getElementById("rateInfo");
    if (!el) return;

    if (currencyRateStatus.live) {
        el.innerText =
            (currencyRateStatus.saved ? "Saved rates (ECB) \u2022 " : "Live rates (ECB) \u2022 ") +
            currencyRateStatus.date;
    }
    else {
        el.innerText = "Offline rates (approximate)";
    }
}

async function fetchJson(url) {

    const controller = new AbortController();
    const timer = setTimeout(function () { controller.abort(); }, 6000);

    try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error("HTTP " + res.status);
        return await res.json();
    }
    finally {
        clearTimeout(timer);
    }
}

// INR value of one unit of `code`
async function fetchInrRate(code) {

    try {
        const d = await fetchJson(
            "https://api.frankfurter.dev/v2/rate/" + code + "/INR"
        );
        if (d && typeof d.rate === "number" && d.rate > 0) {
            return { rate: d.rate, date: d.date };
        }
    }
    catch (e) { /* try the older endpoint below */ }

    const d2 = await fetchJson(
        "https://api.frankfurter.app/latest?from=" + code + "&to=INR"
    );
    if (d2 && d2.rates && typeof d2.rates.INR === "number" && d2.rates.INR > 0) {
        return { rate: d2.rates.INR, date: d2.date };
    }

    throw new Error("No rate for " + code);
}

async function loadCurrencyRates() {

    // 1) use a fresh cached copy if we have one
    let cached = null;
    try {
        cached = JSON.parse(localStorage.getItem(RATE_CACHE_KEY));
    }
    catch (e) { cached = null; }

    if (cached && cached.rates && Date.now() - cached.fetchedAt < RATE_MAX_AGE_MS) {
        currencyRates = Object.assign({}, FALLBACK_RATES, cached.rates);
        currencyRateStatus = { live: true, date: cached.date };
        updateRateInfo();
        return;
    }

    // 2) otherwise ask the API
    try {
        const codes = ["USD", "EUR", "GBP"];
        const results = await Promise.all(codes.map(fetchInrRate));

        const rates = {};
        let date = null;

        codes.forEach(function (code, i) {
            rates[code] = results[i].rate;
            date = results[i].date || date;
        });

        currencyRates = Object.assign({}, FALLBACK_RATES, rates);
        currencyRateStatus = { live: true, date: date };

        try {
            localStorage.setItem(RATE_CACHE_KEY, JSON.stringify({
                rates: rates, date: date, fetchedAt: Date.now()
            }));
        }
        catch (e) { /* storage full or blocked - ignore */ }
    }
    catch (e) {
        // 3) API unreachable: use stale cache if any, else the built-in rates
        if (cached && cached.rates) {
            currencyRates = Object.assign({}, FALLBACK_RATES, cached.rates);
            currencyRateStatus = { live: true, saved: true, date: cached.date };
        }
        else {
            currencyRates = Object.assign({}, FALLBACK_RATES);
            currencyRateStatus = { live: false, date: null };
        }
    }

    updateRateInfo();
}

loadCurrencyRates();

const CURRENCY_NAMES = {
    INR: ["Indian Rupee", "Indian Rupees"],
    USD: ["US Dollar", "US Dollars"],
    EUR: ["Euro", "Euros"],
    GBP: ["British Pound", "British Pounds"]
};

function currencyName(code, amount) {

    const names = CURRENCY_NAMES[code];
    if (!names) return code;

    return Number(amount).toFixed(2) === "1.00" ? names[0] : names[1];
}

// what Echoo says out loud for the last currency result
let currencySpeech = null;

 async function convertCurrency() {

    let amount =
        parseFloat(document.getElementById("currencyAmount").value);

    let type =
        document.getElementById("currencySelect").value;

    if (isNaN(amount)) {
        document.getElementById("result").innerText = "Enter Amount";
        return;
    }

    let result = 0;

    const parts = type.split(" → ");
    const from = parts[0];
    const to = parts[1];

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/currency/?from=" +
            encodeURIComponent(from) +
            "&to=" +
            encodeURIComponent(to) +
            "&amount=" +
            encodeURIComponent(amount)
        );

        const data = await response.json();

        if (data.error) {
            document.getElementById("result").innerText = data.error;
            return;
        }

        result = Number(data.result);

        const shown = result.toFixed(2);
        const toName = currencyName(to, result);
        const fromName = currencyName(from, amount);

        const resultBox = document.getElementById("result");
        resultBox.innerHTML = "";

        const numberLine = document.createElement("div");
        numberLine.innerText = shown + " " + to;

        const nameLine = document.createElement("div");
        nameLine.className = "result-currency-name";
        nameLine.innerText = toName;

        resultBox.appendChild(numberLine);
        resultBox.appendChild(nameLine);

        currencySpeech = {
            display: resultBox.innerText,
            speech: shown + " " + toName
        };

        const expressionBox = document.getElementById("expression");

        if (expressionBox) {
            expressionBox.innerText =
                amount + " " + from +
                " (" + fromName + ") → " + to;
        }

        historyList.push(
            amount + " " + from +
            " = " + shown + " " + to
        );

        saveHistory();
        resetRightPanel();

    } catch (error) {

        console.error("Currency Conversion Error:", error);

        document.getElementById("result").innerText =
            "Currency conversion failed";
    }
}
async function convertBinary() {

    let value = document.getElementById("binaryValue").value.trim();
    let type = document.getElementById("binarySelect").value;

    if (!value) {
        document.getElementById("result").innerText = "Error";
        return;
    }

    const directionMap = {
        "Decimal → Binary": "dec_to_bin",
        "Binary → Decimal": "bin_to_dec",
        "Decimal → Octal": "dec_to_oct",
        "Octal → Decimal": "oct_to_dec",
        "Decimal → Hexadecimal": "dec_to_hex",
        "Hexadecimal → Decimal": "hex_to_dec"
    };

    const direction = directionMap[type];

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/binary/?direction=" +
            encodeURIComponent(direction) +
            "&value=" +
            encodeURIComponent(value)
        );

        const data = await response.json();

        if (data.error) {
            document.getElementById("result").innerText = data.error;
            return;
        }

        const result = data.result;

        document.getElementById("result").innerText = result;

        historyList.push(
            type + ": " +
            value + " = " +
            result
        );

        saveHistory();
        resetRightPanel();

    } catch (error) {

        console.error("Binary Conversion Error:", error);
        document.getElementById("result").innerText = "Error";

    }
}


function openHistory() {
    document.getElementById("sideMenu").style.display = "none"
    document.getElementById("historyPage").style.display = "block";

    let content =
        document.getElementById("historyContent");

    if (historyList.length === 0) {

        content.innerHTML = "No History Yet";
    }
    else {

        content.innerHTML = historyList.join("<br>");
    }
}
function closeHistory() {

    document.getElementById("historyPage").style.display = "none";
}

// ================= SETTINGS =================

// Open Settings Page


function clearHistory() {

    historyList = [];

    localStorage.removeItem("echoHistory");

    document.getElementById("historyContent").innerHTML =
        "No History Yet";
}
// Close Settings Page
function closeSettings() {

    const menu = document.getElementById("settingsMenu");
    if (menu) menu.style.display = "none";

    // older layouts used a separate settings page
    const page = document.getElementById("settingsPage");
    if (page) page.style.display = "none";

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
VoiceBtn.addEventListener("click", () => {
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
    if (!voiceInputEnabled) return;

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
    recognition.maxAlternatives = 5;

    const soundWave = document.querySelector(".sound-wave");

    // Show sound wave when listening starts
    recognition.onstart = function () {
        if (soundWave) {
            soundWave.classList.add("active");
        }

        console.log("Voice recognition started");
    };

    // Get the spoken command
    recognition.onresult = function (event) {

        let alternatives = event.results[0];

        let speechText = alternatives[0].transcript.toLowerCase();

       for (let i = 0; i < alternatives.length; i++) {
            let candidate = alternatives[i].transcript.toLowerCase();

            if (
              /\b(dollar|dollars|rupee|rupees|euro|euros|pound|pounds|usd|inr|eur|gbp)\b/.test(candidate)
              ) {
                  speechText = candidate;
                   break;
    }
}
        console.log("You said:", speechText);

        processVoiceCommand(speechText);
    };

    // Stop sound wave when recognition ends
    recognition.onend = function () {
        if (soundWave) {
            soundWave.classList.remove("active");
        }

        console.log("Voice recognition ended");
    };

    // Handle microphone/recognition errors
    recognition.onerror = function (event) {

        if (soundWave) {
            soundWave.classList.remove("active");
        }

        console.log("Voice Error:", event.error);
    };

    recognition.start();
}

async function processVoiceCommand(text) {

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

    if (!voiceOutputEnabled) return;

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

        if (currencySpeech && currencySpeech.display === resultBox.innerText) {
            speak(currencySpeech.speech);
            return;
        }

        speak(resultBox.innerText);
    }

    function prepareFormula(formula, shape = "") {

      clearExpression();

      showFormulaSection();

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

        decimalPlaces = value;

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
            "ten": "10",
            "eleven": "11",
            "twelve": "12",
            "thirteen": "13",
            "fourteen": "14",
            "fifteen": "15",
            "sixteen": "16",
            "seventeen": "17",
            "eighteen": "18",
            "nineteen": "19",
            "twenty": "20",
            "thirty": "30",
            "forty": "40",
            "fifty": "50",
            "sixty": "60",
            "seventy": "70",
            "eighty": "80",
            "ninety": "90"
        };

        // "twenty five" -> 25 (only when actually spoken as words)
        textForNumbers = textForNumbers.replace(
            /\b(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)[\s-]+(one|two|three|four|five|six|seven|eight|nine)\b/g,
            function (m, tens, ones) {
                return String(
                    parseInt(numberWords[tens]) + parseInt(numberWords[ones])
                );
            }
        );

        Object.keys(numberWords).forEach(word => {

            const pattern =
                new RegExp("\\b" + word + "\\b", "g");

            textForNumbers =
                textForNumbers.replace(
                    pattern,
                    numberWords[word]
                );
        });

        // "1 hundred" -> 100, "2 thousand 500" -> 2500, "1 lakh" -> 100000
        [["hundred", 100], ["thousand", 1000], ["lakh", 100000], ["million", 1000000]]
            .forEach(function (unit) {
                textForNumbers = textForNumbers.replace(
                    new RegExp("\\b(\\d+)\\s+" + unit[0] + "(?:\\s+(?:and\\s+)?(\\d+)\\b)?", "g"),
                    function (m, n, rest) {
                        return String(
                            parseInt(n) * unit[1] + (rest ? parseInt(rest) : 0)
                        );
                    }
                );
            });

        // =========================================================
        // CURRENCY CONVERTER  (INR <-> USD / EUR / GBP)
        // =========================================================

        {
            let currencyText = textForNumbers
                .replace(/([$€£₹])\s*(\d[\d,]*(?:\.\d+)?)/g, function (m, sym, num) {
                    const names = { "$": "dollars", "€": "euros", "£": "pounds", "₹": "rupees" };
                    return num + " " + names[sym];
                })
                .replace(/\$/g, " dollars ")
                .replace(/€/g, " euros ")
                .replace(/£/g, " pounds ")
                .replace(/₹/g, " rupees ")
                .replace(/(\d),(\d{3})/g, "$1$2")
                .replace(/(\d),(\d{3})/g, "$1$2");

            const currencyPatterns = [
                ["INR", /\b(?:indian rupees?|rupees?|inr|rs)\b\.?/g],
                ["USD", /\b(?:us dollars?|dollars?|usd|bucks?)\b/g],
                ["EUR", /\b(?:euros?|eur)\b/g],
                ["GBP", /\b(?:british pounds?|pounds?|gbp|sterling|quid)\b/g]
            ];

            const mentions = [];

            currencyPatterns.forEach(function (entry) {
                const re = new RegExp(entry[1].source, "g");
                let m;
                while ((m = re.exec(currencyText)) !== null) {
                    mentions.push({
                        code: entry[0],
                        index: m.index,
                        end: m.index + m[0].length
                    });
                }
            });

            mentions.sort(function (a, b) { return a.index - b.index; });

            const distinctCodes = [];
            mentions.forEach(function (m) {
                if (distinctCodes.indexOf(m.code) === -1) distinctCodes.push(m.code);
            });

            const amountMatch = currencyText.match(/\d+(?:\.\d+)?/);

            if (distinctCodes.length >= 2 && amountMatch) {

                const amount = parseFloat(amountMatch[0]);
                const amountEnd = amountMatch.index + amountMatch[0].length;

                let source = null;
                let target = null;

                mentions.forEach(function (m) {
                    const before = currencyText.substring(0, m.index);

                    if (/\bfrom\s+(?:[a-z]+\s+)?$/.test(before)) {
                        if (!source) source = m.code;
                    }
                    else if (/\b(?:to|into|in|for)\s+(?:[a-z]+\s+)?$/.test(before)) {
                        if (!target) target = m.code;
                    }
                });

                if (!source) {
                    // currency written right after the amount: "100 dollars"
                    const after = mentions.find(function (m) {
                        return m.index >= amountEnd &&
                            currencyText.substring(amountEnd, m.index).trim() === "" &&
                            m.code !== target;
                    });

                    if (after) {
                        source = after.code;
                    }
                    else {
                        // currency written right before the amount: "rupees 100"
                        const beforeAmount = mentions.find(function (m) {
                            return m.end <= amountMatch.index &&
                                currencyText.substring(m.end, amountMatch.index).trim() === "" &&
                                m.code !== target;
                        });

                        if (beforeAmount) source = beforeAmount.code;
                    }
                }

                if (!source) {
                    source = mentions.find(function (m) {
                        return m.code !== target;
                    }).code;
                }

                if (!target || target === source) {
                    target = distinctCodes.find(function (c) {
                        return c !== source;
                    });
                }

                const conversion = source + " → " + target;

                const supported = [
                    "INR → USD", "USD → INR",
                    "INR → EUR", "EUR → INR",
                    "INR → GBP", "GBP → INR"
                ];

                if (supported.indexOf(conversion) !== -1) {

                    clearExpression();

                    showCurrencySection();

                    selectDropdown(currencySelectEl, conversion);

                    if (currencyAmountEl) {
                        currencyAmountEl.value = amount;
                    }

                    await convertCurrency();

                    resultOnlyVoice();

                    return;
                }

                clearExpression();

                resultBox.innerText =
                    "Only INR conversions are supported";

                speak("Only rupee conversions are supported");

                return;
            }
        }

        // =========================================================
        // BINARY / OCTAL / HEXADECIMAL / DECIMAL CONVERTER
        // =========================================================

        {
            const baseByWord = {
                "binary": 2,
                "octal": 8,
                "decimal": 10,
                "hexadecimal": 16,
                "hex": 16
            };

            const baseNames = {
                2: "Binary",
                8: "Octal",
                10: "Decimal",
                16: "Hexadecimal"
            };

            const digitTests = {
                2: /^[01]+$/,
                8: /^[0-7]+$/,
                10: /^[0-9]+$/,
                16: /^[0-9a-f]+$/
            };

            const baseText = textForNumbers;

            const baseMentions = [];
            const baseRe = /\b(binary|octal|decimal|hexadecimal|hex)\b/g;
            let baseMatch;

            while ((baseMatch = baseRe.exec(baseText)) !== null) {
                baseMentions.push({
                    base: baseByWord[baseMatch[1]],
                    index: baseMatch.index,
                    end: baseMatch.index + baseMatch[1].length
                });
            }

            if (
                baseMentions.length > 0 &&
                !/\bplaces?\b/.test(baseText)
            ) {

                const stopWords =
                    /\b(binary|octal|decimal|hexadecimal|hex|convert|change|transform|what|whats|is|the|a|an|number|value|of|from|to|into|in|as|please|equals|equal|base|for|me|it)\b/g;

                let tokens =
                    baseText
                        .replace(stopWords, " ")
                        .match(/\b[0-9a-f]+\b/g) || [];

                const guessSourceBase = function (token) {
                    if (/[a-f]/.test(token)) return 16;
                    if (/^[01]+$/.test(token)) return 2;
                    if (/^[0-7]+$/.test(token)) return 8;
                    return 10;
                };

                const flagOf = function (mention) {
                    const before = baseText.substring(0, mention.index);

                    if (/\bfrom\s+(?:[a-z]+\s+)?$/.test(before)) return "from";
                    if (/\b(?:to|into|in)\s+(?:[a-z]+\s+)?$/.test(before)) return "to";
                    if (/\b(?:of|as)\s+$/.test(before)) return "to";

                    return "";
                };

                let sourceBase = null;
                let targetBase = null;

                const distinctBases = [];
                baseMentions.forEach(function (m) {
                    if (distinctBases.indexOf(m.base) === -1) distinctBases.push(m.base);
                });

                if (distinctBases.length >= 2) {

                    const first = baseMentions[0];
                    const second = baseMentions.find(function (m) {
                        return m.base !== first.base;
                    });

                    const firstFlag = flagOf(first);
                    const secondFlag = flagOf(second);

                    if (firstFlag === "to" || secondFlag === "from") {
                        targetBase = first.base;
                        sourceBase = second.base;
                    }
                    else {
                        sourceBase = first.base;
                        targetBase = second.base;
                    }
                }
                else {

                    const only = baseMentions[0];
                    const flag = flagOf(only);

                    // pick the number first, then decide what it means
                    const firstToken = tokens.length ? tokens[0] : "";

                    const followedByOf =
                        /^\s+of\b/.test(baseText.substring(only.end));

                    if (flag === "to" || followedByOf) {
                        targetBase = only.base;
                    }
                    else if (flag === "from") {
                        sourceBase = only.base;
                        targetBase = 10;
                    }
                    else if (
                        digitTests[only.base].test(firstToken) &&
                        only.base !== 10
                    ) {
                        // "ff hex", "hex ff", "1010 binary"
                        sourceBase = only.base;
                        targetBase = 10;
                    }
                    else {
                        targetBase = only.base;
                    }

                    if (sourceBase === null) {
                        sourceBase =
                            targetBase === 10
                                ? guessSourceBase(firstToken)
                                : 10;
                    }
                }

                if (sourceBase === targetBase) {
                    sourceBase = targetBase === 10 ? 2 : 10;
                }

                // binary digits spoken one by one: "one zero one zero"
                if (
                    sourceBase === 2 &&
                    tokens.length > 1 &&
                    tokens.every(function (t) { return /^[01]$/.test(t); })
                ) {
                    tokens = [tokens.join("")];
                }

                const validTokens = tokens.filter(function (t) {
                    return digitTests[sourceBase].test(t);
                });

                if (tokens.length > 0) {

                    if (validTokens.length === 0) {

                        clearExpression();

                        resultBox.innerText =
                            "Invalid " + baseNames[sourceBase].toLowerCase() + " number";

                        speak(resultBox.innerText);

                        return;
                    }

                    const rawValue = validTokens[0];

                    if (sourceBase === 10 || targetBase === 10) {

                        const conversion =
                            baseNames[sourceBase] + " → " + baseNames[targetBase];

                        clearExpression();

                        showBinarySection();

                        selectDropdown(binarySelectEl, conversion);

                        binaryValueEl.value = rawValue;

                        await convertBinary();

                        resultOnlyVoice();

                        return;
                    }

                    // binary <-> octal <-> hex (no dropdown for these)
                    const converted =
                        parseInt(rawValue, sourceBase)
                            .toString(targetBase)
                            .toUpperCase();

                    showExpression(
                        rawValue + " (" + baseNames[sourceBase].toLowerCase() + ") → " +
                        baseNames[targetBase].toLowerCase()
                    );

                    updateResult(converted);

                    historyList.push(
                        baseNames[sourceBase] + " → " + baseNames[targetBase] +
                        ": " + rawValue + " = " + converted
                    );

                    saveHistory();

                    resultOnlyVoice();

                    return;
                }
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
            .replace(/\b(?:a|an|the)\b/g, " ")
            .replace(/\b(?:open|left)\s+(?:bracket|brackets|parenthesis)\b/g, "(")
            .replace(/\b(?:close|right)\s+(?:bracket|brackets|parenthesis)\b/g, ")")
            .replace(/(\d)\s+point\s+(\d)/g, "$1.$2")
            .replace(/\bover\b/g, "/")
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
        // BASIC BUTTON COMMANDS: clear, backspace
        // =========================================================

        const bareCommand =
            originalText.replace(/[.!?,]+/g, "").trim();

        if (
            /^(?:all clear|clear all|clear|clear screen|clear display|clear everything|reset|ac)$/.test(bareCommand)
        ) {
            clearDisplay();
            return;
        }

        if (
            /^(?:backspace|back space|delete|erase|delete last|remove last)$/.test(bareCommand)
        ) {
            backspace();
            return;
        }

        if (
            /^(?:go back|back|go to menu|back to menu|back to options|close panel|close formula|close currency|close binary)$/.test(bareCommand)
        ) {
            goBackRightPanel();
            return;
        }

        // =========================================================
        // PERCENT OF:  "20 percent of 50"  ->  10
        // =========================================================

        {
            const percentOf = textForNumbers.match(
                /(\d+(?:\.\d+)?)\s*(?:percent|%)\s+of\s+(\d+(?:\.\d+)?)/
            );

            if (percentOf && !/percentage/.test(textForNumbers)) {

                const part = parseFloat(percentOf[1]);
                const whole = parseFloat(percentOf[2]);
                const answer = (part / 100) * whole;

                const shown = Number.isInteger(answer)
                    ? String(answer)
                    : (Math.round(answer * 1e10) / 1e10).toFixed(decimalPlaces);

                const text = part + "% of " + whole;

                showExpression(text);
                updateResult(shown);

                historyList.push(text + " = " + shown);
                saveHistory();

                resultOnlyVoice();

                return;
            }
        }

        // =========================================================
        // FORMULA CALCULATIONS
        // =========================================================

        // ---- friendly wording for shapes ----
        let badTriangleFound = false;

        (function () {

            let badTriangle = false;

            const fix = function (t) {

                // other kinds of triangle are still "triangle" for the formulas
                t = t.replace(
                    /\b(?:right[\s-]?angled|right|isosceles|scalene)\s+triangle\b/g,
                    "triangle"
                );

                const wantsArea = /\barea\b/.test(t);

                if (wantsArea) {

                    // equilateral triangle: base = side, height = side * sqrt(3) / 2
                    t = t.replace(
                        /\bequilateral\s+triangle(?:\s+(?:with|of))?(?:\s+side)?\s+(\d+(?:\.\d+)?)/g,
                        function (m, n) {
                            const side = parseFloat(n);
                            return "triangle base " + side +
                                " height " + (side * Math.sqrt(3) / 2);
                        }
                    );

                    // three sides given: use Heron's formula
                    t = t.replace(
                        /\btriangle\s+(?:with\s+)?sides?\s+(\d+(?:\.\d+)?)\D+?(\d+(?:\.\d+)?)\D+?(\d+(?:\.\d+)?)/g,
                        function (m, x, y, z) {
                            const a = parseFloat(x);
                            const b = parseFloat(y);
                            const c = parseFloat(z);

                            if (a + b <= c || a + c <= b || b + c <= a) {
                                badTriangle = true;
                                return m;
                            }

                            const half = (a + b + c) / 2;
                            const area = Math.sqrt(
                                half * (half - a) * (half - b) * (half - c)
                            );

                            return "triangle base " + a +
                                " height " + (2 * area / a);
                        }
                    );
                }

                return t
                    // diameter -> radius (radius = diameter / 2)
                    .replace(
                        /\bdiameter(?:\s+(?:of|is|equals?|=))?\s+(\d+(?:\.\d+)?)/g,
                        function (m, n) {
                            return "radius " + (parseFloat(n) / 2);
                        }
                    )
                    // other names for a cuboid
                    .replace(/\b(?:rectangular\s+(?:box|prism|solid)|cuboid\s+box)\b/g, "cuboid")
                    // "circumference 7" -> "perimeter of circle 7"
                    .replace(/\bcircumference\b(?!\s+of\s+circle)/g, "perimeter of circle")
                    // equilateral triangle: one side is enough
                    .replace(
                        /\bequilateral\s+triangle(?:\s+(?:with|of))?(?:\s+side)?\s+(\d+(?:\.\d+)?)/g,
                        function (m, n) {
                            return "triangle " + n + " " + n + " " + n;
                        }
                    );
            };

            textForNumbers = fix(textForNumbers);
            normalized = fix(normalized);

            if (badTriangle) {
                clearExpression();
                resultBox.innerText = "Not a valid triangle";
                speak("Not a valid triangle");
                badTriangleFound = true;
            }
        })();

        if (badTriangleFound) return;

        let formulaNumbers =
            getNumbers(textForNumbers);

        // If the person names the values ("time 20 distance 100"),
        // put them in the order the formula expects.
        (function () {

            function keyedNumbers(text, keys) {

                const numRe = /-?\d+(?:\.\d+)?/g;
                const nums = [];
                let m;

                while ((m = numRe.exec(text)) !== null) {
                    nums.push({ v: parseFloat(m[0]), i: m.index });
                }

                const out = [];
                const used = {};

                for (const key of keys) {

                    const km = new RegExp(key).exec(text);

                    if (!km) return null;

                    const end = km.index + km[0].length;

                    const n = nums.find(function (x) {
                        return x.i >= end && !used[x.i];
                    });

                    if (!n) return null;

                    used[n.i] = true;
                    out.push(n.v);
                }

                return out;
            }

            const sets = [
                { test: /\bspeed\b/, keys: ["distance", "time"] },
                { test: /simple interest/, keys: ["principal", "rate", "time"] },
                { test: /\bbmi\b|body mass index/, keys: ["weight", "height"] },
                {
                    test: /z[\s-]?score/,
                    keys: [
                        "z[\\s-]?score(?:\\s+of)?",
                        "mean",
                        "(?:standard deviation|deviation|\\bsd\\b)"
                    ]
                },
                { test: /cylinder|cone/, keys: ["radius", "height"] },
                { test: /triangle|parallelogram/, keys: ["base", "height"] },
                { test: /rectangle/, keys: ["length", "(?:width|breadth)"] }
            ];

            for (const set of sets) {

                if (set.test.test(textForNumbers)) {

                    const keyed = keyedNumbers(textForNumbers, set.keys);

                    if (keyed) formulaNumbers = keyed;

                    break;
                }
            }
        })();


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

                await calculateFormula();

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

                await calculateFormula();

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

                await calculateFormula();

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

                await calculateFormula();

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

                await calculateFormula();

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

                await calculateFormula();

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

                await calculateFormula();

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

                await calculateFormula();

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

                await calculateFormula();

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

                await calculateFormula();

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

                await calculateFormula();

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

                await calculateFormula();

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

                await calculateFormula();

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

                await  calculateFormula();

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

                await calculateFormula();

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

                await  calculateFormula();

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

                 await calculateFormula();

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

                await calculateFormula();

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

                await calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        // ---------- Z SCORE ----------

        if (
/z[\s-]?score/.test(normalized)
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

                await calculateFormula();

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

                    await calculateFormula();

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

                await calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        // ---------- MEAN ----------

        if (
            normalized.includes("mean") ||
            normalized.includes("average")
        ) {

            if (formulaNumbers.length >= 1) {

                prepareFormula("Mean");

                value1El.value =
                    formulaNumbers.join(",");

                await calculateFormula();

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

                await calculateFormula();

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

                await calculateFormula();

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

                await calculateFormula();

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

                await calculateFormula();

                resultOnlyVoice();

                return;
            }
        }

        // =========================================================
        // NORMAL ARITHMETIC + SCIENTIFIC CALCULATOR
        //   3 sin 30, 2 cos 90, sin 30 + cos 30, 5 factorial,
        //   2 to the power of 3, square root of 144, 2 pi ...
        // =========================================================

        function factorialOf(n) {
            n = parseInt(n);
            if (n < 0 || n > 170) return "Infinity";
            let f = 1;
            for (let i = 2; i <= n; i++) f *= i;
            return String(f);
        }

        const numPattern = "(-?\\d+(?:\\.\\d+)?|Math\\.PI|Math\\.E)";

        const angleFactor =
            (typeof angleMode !== "undefined" && angleMode === "radian")
                ? "1"
                : "(Math.PI/180)";

        // Step 1: understand spoken words (used for display too)
        let prepared = normalized
            .replace(/[.?,]+$/g, "")
            .replace(/\s+(?:is\s+)?(?:equals?|equal\s+to)$/g, "")
            .replace(/([^\d])!+$/g, "$1")
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/\bx\b/g, "*")
            .replace(/\b(?:sine|sign|sin)\b/g, "sin")
            .replace(/\b(?:cosine|cosign|cos)\b/g, "cos")
            .replace(/\b(?:tangent|tan)\b/g, "tan")
            .replace(/\b(?:natural\s+log(?:arithm)?|l\s*n)\b/g, "ln")
            .replace(/\b(?:logarithm|log)\b/g, "log")
            .replace(/\b(?:square\s+root|sqrt|root)\b/g, "sqrt")
            .replace(/\b(sin|cos|tan|log|ln|sqrt)\s+of\b/g, "$1")
            .replace(/(\d)\s*(?:degrees?|°)/g, "$1")
            .replace(/π/g, " pi ")
            .replace(/\s+/g, " ")
            .trim();

        // Step 2: turn it into something JavaScript can calculate
        let arithmeticText = prepared
            .replace(/\bfactorial(?:\s+of)?\s+(\d+)/g, function (m, n) {
                return factorialOf(n);
            })
            .replace(/(\d+)\s*(?:factorial|!)/g, function (m, n) {
                return factorialOf(n);
            })
            .replace(/(\d+(?:\.\d+)?|\bpi|\be)\s+square(?:d)?\b/g, "$1**2")
            .replace(/(\d+(?:\.\d+)?|\bpi|\be)\s+cubed\b/g, "$1**3")
            .replace(/\bsquare\s+of\s+(\d+(?:\.\d+)?)/g, "$1**2")
            .replace(
                /\b(?:raised\s+)?to\s+(?:the\s+)?power(?:\s+of)?\b|\bpower(?:\s+of)?\b|\braised\s+to\b|\bcaret\b|\^/g,
                "**"
            )
            .replace(/\bpi\b/g, "Math.PI")
            .replace(/\beuler(?:'s)?(?:\s+number)?\b/g, "Math.E")
            .replace(/\be\b/g, "Math.E")
            .replace(new RegExp("\\bsin\\s*" + numPattern, "g"), "Math.sin($1*" + angleFactor + ")")
            .replace(new RegExp("\\bcos\\s*" + numPattern, "g"), "Math.cos($1*" + angleFactor + ")")
            .replace(new RegExp("\\btan\\s*" + numPattern, "g"), "Math.tan($1*" + angleFactor + ")")
            .replace(new RegExp("\\blog\\s*" + numPattern, "g"), "Math.log10($1)")
            .replace(new RegExp("\\bln\\s*" + numPattern, "g"), "Math.log($1)")
            .replace(new RegExp("\\bsqrt\\s*" + numPattern, "g"), "Math.sqrt($1)")
            // implicit multiplication: 3 sin 30 -> 3*sin(30), 2 pi -> 2*pi
            .replace(/(\d|\)|Math\.PI|Math\.E)\s*(?=Math\.)/g, "$1*")
            .replace(/\)\s*(?=\d)/g, ")*")
            .replace(/(?<![A-Za-z.\d])(\d+(?:\.\d+)?)\s*(?=\()/g, "$1*")
            .replace(/\)\s*(?=\()/g, ")*")
            .replace(/(Math\.PI|Math\.E)\s*(?=\()/g, "$1*")
            .trim();

        // Safety check: only numbers, operators and our own Math functions allowed
        const safeCheck = arithmeticText
            .replace(/Math\.(sin|cos|tan|log10|log|sqrt)\(/g, "(")
            .replace(/Math\.(PI|E)\b/g, "3");

        if (
            arithmeticText &&
            /\d|Math\.(PI|E)/.test(arithmeticText) &&
            /^[\d\s+\-*\/().%]+$/.test(safeCheck)
        ) {

            let value = null;

            try {
                value = Function(
                    '"use strict"; return (' + arithmeticText + ');'
                )();
            } catch (err) {
                value = null;   // incomplete expression such as "20 +"
            }

            if (typeof value === "number") {

                // nicer looking expression for the display / history
                const displayText = prepared
                    .replace(new RegExp("\\b(sin|cos|tan|log|ln)\\s*" + numPattern, "g"), "$1($2)")
                    .replace(new RegExp("\\bsqrt\\s*" + numPattern, "g"), "√($1)")
                    .replace(/(\d+)\s*(?:factorial|!)/g, "$1!")
                    .replace(/\bfactorial(?:\s+of)?\s+(\d+)/g, "$1!")
                    .replace(/(\d+(?:\.\d+)?)\s+squared\b/g, "$1²")
                    .replace(/\bsquare\s+of\s+(\d+(?:\.\d+)?)/g, "$1²")
                    .replace(/(\d+(?:\.\d+)?)\s+cubed\b/g, "$1³")
                    .replace(
                        /\b(?:raised\s+)?to\s+(?:the\s+)?power(?:\s+of)?\b|\bpower(?:\s+of)?\b|\braised\s+to\b|\bcaret\b|\*\*/g,
                        "^"
                    )
                    .replace(/\bpi\b/g, "π")
                    .replace(/\*/g, "×")
                    .replace(/\//g, "÷")
                    .replace(/\s+/g, " ")
                    .trim();

                let shown;

                if (!Number.isFinite(value)) {

                    shown = "Error";
                }
                else if (
                    /\btan\b/.test(prepared) &&
                    Math.abs(value) > 1e12
                ) {

                    shown = "Undefined";
                }
                else {

                    let cleaned = value;

                    if (Math.abs(cleaned) < 1e-10) {
                        cleaned = 0;
                    }
                    else if (Math.abs(cleaned) < 1e5) {
                        cleaned = Math.round(cleaned * 1e10) / 1e10;
                    }

                    shown = Number.isInteger(cleaned)
                        ? String(cleaned)
                        : cleaned.toFixed(decimalPlaces);
                }

                showExpression(displayText);

                updateResult(shown);

                if (shown !== "Error" && shown !== "Undefined") {
                    historyList.push(displayText + " = " + shown);
                    saveHistory();
                }

                resultOnlyVoice();

                return;
            }
        }

        // =========================================================
        // NOTHING MATCHED
        // =========================================================

        clearExpression();

        resultBox.innerText =
            "Command not understood";

        speak("Command not understood");
    }

function powerMode() {
    playButtonSound();

    expression += "**";
    document.getElementById("expression").innerText = expression;
}



// ======================
// SETTINGS TOGGLES
// ======================

let voiceInputEnabled = true;
let voiceOutputEnabled = true;


window.addEventListener("load", () => {

    const voiceInput = document.getElementById("voiceInputToggle");
    const voiceOutput = document.getElementById("voiceOutputToggle");

    if (voiceInput) {
        voiceInput.addEventListener("change", function () {
            voiceInputEnabled = this.value === "ON";
        });
    }

    if (voiceOutput) {
        voiceOutput.addEventListener("change", function () {
            voiceOutputEnabled = this.value === "ON";
        });
    }

});
document.addEventListener("DOMContentLoaded", () => {

    const soundToggle =
        document.getElementById(
            "buttonSoundToggle"
        );

    if (soundToggle) {

        soundToggle.addEventListener(
            "change",
            function () {

                buttonSoundEnabled =
                    this.value === "ON";

                console.log(
                    "Button Sound:",
                    buttonSoundEnabled
                );

            }
        );
    }

});

// ======================================================
// SETTINGS: make Angle Mode and Decimal Places really work
// (used by both the buttons and the voice commands)
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    document
        .querySelectorAll("#calculatorOptions select")
        .forEach(select => {

            select.addEventListener("change", function () {

                const options = Array.from(this.options)
                    .map(option => option.textContent.trim());

                if (options.includes("Degree")) {

                    angleMode =
                        this.value.trim().toLowerCase() === "radian"
                            ? "radian"
                            : "degree";
                }
                else if (options.includes("2")) {

                    const places = parseInt(this.value);

                    if (!isNaN(places)) {
                        decimalPlaces = places;
                    }
                }
            });
        });
});