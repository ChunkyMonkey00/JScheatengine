var FOUND_STRING = "Player";
var FOUND_NUM1 = 1;
var FOUND_NUM2 = 1484;

var scanMethod = "UK";

var allVars = [];

var inputEventListeners = [];

function setAppVals() {
  document.getElementById("string").innerHTML = "Name: " + FOUND_STRING;
  document.getElementById("health").innerHTML = "Health: " + FOUND_NUM1;
  document.getElementById("ammo").innerHTML = "Ammo: " + FOUND_NUM2;
}

setAppVals();

function randomString() {
  const length = 7;
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

function randomNum(min = -100, max = 100, decimalPlaces = 2) {
  const factor = Math.pow(10, decimalPlaces);
  let whole = Math.floor(Math.random() * (max - min + 1) + min);
  let decimal = Math.floor(Math.random() * (max - min + 1) + min) / factor;
  if (decimalPlaces == 0) decimal = 0;
  return whole + decimal;
}

function randomVars() {
  FOUND_STRING = randomString();
  FOUND_NUM1 = randomNum(0, 100);
  FOUND_NUM2 = randomNum(0, 250, 0);

  setAppVals();
}

function pushToTable(variables) {
  var tbody = document.getElementById('variableTableBody');

  // Clear existing rows
  tbody.innerHTML = '';

  // Iterate over the variables array
  for (var i = 0; i < variables.length; i++) {
    var variable = variables[i];

    // Create a new row
    var tr = document.createElement('tr');

    // Add cells for the address, type, and input field


    if (variable.type == "Function") {
      tr.appendChild(createCell(variable.address, true, variable));
      tr.appendChild(createCell(variable.type));
      tr.appendChild(createInputCell("[Function]", variable.address));
    } else {
      tr.appendChild(createCell(variable.address));
      tr.appendChild(createCell(variable.type));
      tr.appendChild(createInputCell(variable.value, variable.address));
    }

    // Append the row to the table body
    tbody.appendChild(tr);
  }

}

function createCell(content, isFunction = false, variable) {
  var td = document.createElement('td');
  td.textContent = content;

  if (isFunction) {
    td.classList.add("functionAddress");
    td.style.backgroundColor = "lightBlue";
    td.style.borderRadius = "10px";
    td.addEventListener("click", function () {
      pushToFunction(variable);
    });
  }

  return td;
}

function updateVal(element, address) {
      var originalValue = window[address];
      var parsedValue;
    
      // Determine the type of the original value and parse accordingly
      switch (typeof originalValue) {
        case 'boolean':
          // Convert the input to a boolean
          parsedValue = Boolean(element.value);
          break;
        case 'number':
          // Convert the input to a number
          parsedValue = Number(element.value);
          break;
        case 'string':
          // Keep the input as a string
          parsedValue = element.value;
          break;
        case 'function':
          alert("CANT SET FUNCTIONS YET");
          return;
        case "object":
          alert("DONT EVEN TRY OBJECTS");
          return;
        default:
          // For complex objects or functions, keep the original input
          parsedValue = element.value;
      }
    
      // Assign the parsed value to the global variable
      window[address] = parsedValue;
}

function createInputCell(value, address) {
  var td = document.createElement('td');
  var input = document.createElement('input');
  input.type = 'text';
  input.className = 'input-field';
  input.value = value;

  function handleChange(event) {
    updateVal(this, address);
    if (this.form) {
      event.preventDefault();
    }
    setAppVals();
  }

  // Store the event listener
  inputEventListeners.push({
    target: input,
    event: 'change',
    listener: handleChange
  });

  // Add event listener to the input element
  input.addEventListener('change', handleChange);

  td.appendChild(input);

  return td;
}

function removeStoredEventListeners() {
  inputEventListeners.forEach(function(listenerObj) {
    listenerObj.target.removeEventListener(listenerObj.event, listenerObj.listener);
  });
  // Clear the array after removing the listeners
  inputEventListeners = [];
}


function pushToFunction(v) {
  document.getElementById("function-address").innerHTML = v.address;
  document.getElementById("handler-function").textContent = v.value;
}

function scan() {
  removeStoredEventListeners(); // Remove old event listeners

  var variablesArray = [];

  // Iterate over all properties of the window object
  for (var prop in window) {
    // Check if the property belongs to the window object itself and not its prototype
    if (window.hasOwnProperty(prop)) {
      // Determine the type of the variable
      var valueType = typeof window[prop];
      var type = '';
      if (valueType === 'function') {
        type = 'Function';
      } else if (valueType === 'number') {
        type = 'Number';
      } else if (Array.isArray(window[prop])) {
        type = 'Array';
      } else if (valueType === 'object') {
        type = 'Object';
      } else if (valueType === 'string') {
        type = 'String';
      }

      // Exclude null and undefined values
      if (type && window[prop] != null && window[prop] != "") {
        // Push the variable name, type, and value into the array
        variablesArray.push({ address: prop, type: type, value: window[prop] });
      }
    }
  }

  return variablesArray;
}

function updateAllValues() {
  //Update allvars list's values
  //Find each variable in window
  //update the list with that var's value
  for (var i = 0; i < allVars.length; i++) {
    let v = allVars[i];
    let p = v.address;
    v.value = window[p];
  }
}

function newScan(vars) {
  removeStoredEventListeners(); // Remove old event listeners

  var s = scan();
  pushToTable(s);
  allVars = s;
}

function setScanMethod(method, element) {
  scanMethod = method;

  var buttons = document.querySelectorAll("button")

  buttons.forEach((btn) => { btn.classList.remove("activeMethod"); });

  element.classList.add("activeMethod");
}

function getScanCondition() {
  return document.getElementById("scan-condition").value;
}

function nextScan() {
  removeStoredEventListeners(); // Remove old event listeners
  updateAllValues();

  var method = scanMethod;
  var newList = [];

  if (method == "UK") {
    console.log("Attempted UK on nextScan");
    return;
  }
  if (method == "EQ") {
    allVars.forEach((vari) => {
      if ((vari.value || Number(vari.value)) == (getScanCondition() || Number(getScanCondition()))) {
        newList.push(vari);
      }
    });
  }
  if (method == "LT") {
    allVars.forEach((vari) => {
      if (Number(vari.value) < (Number(getScanCondition()))) {
        newList.push(vari);
      }
    });
  }
  if (method == "GT") {
    allVars.forEach((vari) => {
      if (Number(vari.value) > (Number(getScanCondition()))) {
        newList.push(vari);
      }
    });
  }
  if (method == "LTE") {
    allVars.forEach((vari) => {
      if (Number(vari.value) <= (Number(getScanCondition()))) {
        newList.push(vari);
      }
    });
  }
  if (method == "GTE") {
    allVars.forEach((vari) => {
      if (Number(vari.value) >= (Number(getScanCondition()))) {
        newList.push(vari);
      }
    });
  }
  pushToTable(newList);

  allVars = newList;
}

/* Create fuzz for the player to struggle to find the right vars */
function pushFuzzVars(numVariables) {
  for (let i = 0; i < numVariables; i++) {
    // Generate a random name for the variable
    const varName = randomString();
    // Generate a random value for the variable using randomNum
    if (randomNum(0, 1, 0) == 0) {
      var varValue = randomNum();
    } else {
      var varValue = randomString();
    }
    // Assign the variable to the window object to make it globally accessible
    window[varName] = varValue;
  }
}

// Example usage:
pushFuzzVars(100); // This will create  10 random variables with random names and values


newScan();