var runningTotal = 0;
var buffer = "0";
var previousOperator = null;

var screen = document.querySelector(".screen");
document
  .querySelector(".calculator-keys")
  .addEventListener("click", function (event) {
    buttonClick(event.target.innerText);
  });

function buttonClick(value) {
  if (isNaN(parseFloat(value))) {
    handleSymbol(value);
  } else {
    handleNumber(value);
  }
  rerender();
}

function handleNumber(value) {
  if (buffer === "0") {
    buffer = value;
  } else {
    buffer += value;
  }
}
function handleSymbol(value) {
  switch (value) {
    case "C":
      buffer = "0";
      runningTotal = 0;
      break;
    case "=":
      if (previousOperator === null) {
        return;
      }
      flushOperation(parseFloat(buffer));
      previousOperator = null;
      buffer = "" + runningTotal;
      runningTotal = 0;
      break;
    case "←":
      if (buffer.length === 1) {
        buffer = "0";
      } else {
        buffer = buffer.substring(0, buffer.length - 1);
        console.log("buffer line 48: ", buffer);
      }
      break;
    case ".":
      buffer += value;
      break;
    default:
      handleMath(value);
      break;
  }
}

function handleMath(value) {
  let floatBuffer = parseFloat(buffer);
  if (runningTotal === 0) {
    runningTotal = floatBuffer;
    console.log("runningTotal line 64 ", runningTotal);
  } else {
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
// History Implementation

const buttons = document.querySelectorAll('.calculator-keys button');
const historyBtn = document.querySelector('.history-btn');
const historySection = document.querySelector('.history-section');
const historyList = document.querySelector('.history-list');
const clearHistoryBtn = document.querySelector('.clear-history-btn');

let currentInput = '';
let history = [];

// Function to update the screen
function updateScreen(value) {
    screen.textContent = value;
}

// Function to handle button clicks
buttons.forEach((button) => {
    button.addEventListener('click', () => {
        const btnValue = button.textContent;

        if (button.classList.contains('clear-btn')) {
            // Clear all input
            currentInput = '';
            updateScreen('0');
        } else if (button.classList.contains('backspace')) {
            // Remove last character
            currentInput = currentInput.slice(0, -1) || '0';
            updateScreen(currentInput);
        } else if (button.classList.contains('equal')) {
            // Evaluate the input and update history
            try {
                const result = eval(currentInput.replace('×', '*').replace('÷', '/'));
                if (!isNaN(result)) {
                    history.push(`${currentInput} = ${result}`);
                    currentInput = result.toString();
                    updateScreen(currentInput);
                    saveHistory();
                }
            } catch {
                updateScreen('Error');
                currentInput = '';
            }
        } else {
            // Handle other button inputs
            if (currentInput === '0' || screen.textContent === 'Error') {
                currentInput = btnValue;
            } else {
                currentInput += btnValue;
            }
            updateScreen(currentInput);
        }
    });
});

// Function to display the history
historyBtn.addEventListener('click', () => {
    historySection.style.display = historySection.style.display === 'none' ? 'block' : 'none';
    renderHistory();
});

// Function to render the history list
function renderHistory() {
    historyList.innerHTML = history
        .map((entry, index) => `<li data-index="${index}">${entry}</li>`)
        .join('');
}

// Function to save history to local storage
function saveHistory() {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
}

// Function to load history from local storage
function loadHistory() {
    const storedHistory = localStorage.getItem('calculatorHistory');
    if (storedHistory) {
        history = JSON.parse(storedHistory);
        renderHistory();
    }
}

// Function to clear the history
clearHistoryBtn.addEventListener('click', () => {
    history = [];
    saveHistory();
    renderHistory();
});

// Load history on page load
loadHistory();

// user should be able to put input using keyboard

document.addEventListener("keydown", function (event) {
    const key = event.key; // Get the pressed key
    if (!isNaN(key)) {
        // Handle numeric input (0-9)
        currentInput += key;
        updateScreen(currentInput);
    } else if (["+", "-", "*", "/"].includes(key)) {
        // Handle operators (+, -, *, /)
        let operator = key;
        if (operator === "/") operator = "÷";
        if (operator === "*") operator = "×";
        currentInput += ` ${operator} `;
        updateScreen(currentInput);
    } else if (key === "Enter" || key === "=") {
        // Handle Enter/Equal key for calculation
        try {
            const result = eval(currentInput.replace("×", "*").replace("÷", "/"));
            if (!isNaN(result)) {
                history.push(`${currentInput} = ${result}`);
                currentInput = result.toString();
                updateScreen(currentInput);
                saveHistory(); // Save history after calculation
            }
        } catch {
            updateScreen("Error");
            currentInput = "";
        }
    } else if (key === "Backspace") {
        // Handle Backspace key
        currentInput = currentInput.slice(0, -1) || "0";
        updateScreen(currentInput);
    } else if (key === "Escape") {
        // Handle Escape key for clear (C)
        currentInput = "";
        updateScreen("0");
    } else if (key === ".") {
        // Handle decimal point
        if (!currentInput.includes(".")) {
            currentInput += ".";
            updateScreen(currentInput);
        }
    }
});


