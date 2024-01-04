let runningTotal = 0;
let buffer = "0";
let previousOperator =null;

let screen = document.querySelector(".screen");
document
.querySelector(".calculator-keys")
.addEventListener("click", function(event) {
    //console.log(event.target.innerText);
    buttonClick(event.target.innerText);
})

function buttonClick(value) {
    if(isNaN(parseFloat(value))){
        handleSymbol(value);
    } else {
        handleNumber(value);
    }
    rerender();
}

function handleNumber(value) {
    if(buffer === "0"){
        buffer = value;
    } else {
        buffer += value;
    }
}
function handleSymbol(value){
    switch(value){
        case 'C':
            buffer = "0";
            runningTotal = 0;
            break;
        case '=':
            if(previousOperator === null){
                return;
            }
            flushOperation(parseFloat(buffer));
            previousOperator = null;
            buffer = "" + runningTotal;    
            runningTotal = 0;
            break;
        case '←':
            if(buffer.length === 1){
                buffer = "0";
            } else {
                buffer = buffer.substring(0, buffer.length - 1);
            }
            break;
        case '.':
            buffer += value;
            break;
        default:
            handleMath(value);
            break;
    }
}

function handleMath(value){
    const floatBuffer = parseFloat(buffer);
    if(runningTotal === 0 ){
        runningTotal = floatBuffer;
    }else{
        flushOperation(floatBuffer);
    }
    previousOperator = value;
    buffer = "0";
}



function flushOperation(floatBuffer) {
    if (previousOperator === "+") {
        runningTotal += floatBuffer;
    } else if (previousOperator === "-") {
        runningTotal -= floatBuffer;
    } else if (previousOperator === "÷") {
        runningTotal = Math.round((runningTotal / floatBuffer) * 100) / 100; // Round to two decimal places
    } else if (previousOperator === "×") {
        runningTotal *= floatBuffer;
    }
}


function rerender() {
    screen.innerText = buffer; 
}