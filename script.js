// Helper functions
const $ = (selector, context = document) => context.querySelector(selector);
const $All = (selector, context = document) =>
  context.querySelectorAll(selector);

// References
const display = $('#display');
const buttons = [...$All('button')];

// Operation Variables
let lOperator = null;
let rOperator = null;
let operator = null;

const E = Math.floor(Math.E * 1000) / 1000;
const PI = Math.floor(Math.PI * 1000) / 1000;

let justEvaluated = false;

let calculator = new Calculator();

buttons.forEach((button) => {
  button.addEventListener('click', (e) => handleButton(button));
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'Delete':
    case 'Backspace':
      {
        handleButton({ id: 'key-ce' });
      }
      break;

    case '+':
      {
        handleButton({ id: 'key-add' });
      }
      break;

    case '-':
      {
        handleButton({ id: 'key-subtract' });
      }
      break;

    case '/':
      {
        handleButton({ id: 'key-divide' });
      }
      break;

    case '*':
      {
        handleButton({ id: 'key-multiply' });
      }
      break;

    case '.':
      {
        handleButton({ id: 'key-dot' });
      }
      break;

    case '=':
    case 'Enter':
      {
        handleButton({ id: 'key-eq' });
      }
      break;
    default:
      {
        if (parseFloat(e.key) || e.key === '0') {
          handleButton({ id: `key-${e.key}` });
        }
      }
      break;
  }
});

function Calculator() {
  // Operations
  this.add = (a, b) => a + b;
  this.subtract = (a, b) => a - b;
  this.multiply = (a, b) => a * b;
  this.divide = (a, b) => a / b;
  this.mod = (a, b) => a % b;
  this.pow = (a) => Math.pow(a, 2);
  this.root = (a) => Math.sqrt(a);
  this.fact = (a) => {
    let result = 1;
    for (var i = 2; i <= a; i++) result = result * i;
    return result;
  };

  this.operate = (left, operator, right) => {
    const errorValues = [null, undefined, Infinity, NaN];

    const leftOperator = parseFloat(left);
    const rightOperator = parseFloat(right);
    let result = this[operator](leftOperator, rightOperator);
    const isError = errorValues.includes(result);
    if (isError) {
      result = 'Error';
    }

    setDisplay(result, isError);
    return result;
  };
}

// Helper functions
function setDisplay(value, isError = false) {
  if (typeof value === 'number') {
    value = Math.floor(value * 100) / 100;
  }
  display.textContent = value;

  if (isError) {
    display.classList.add('error');
  } else {
    display.classList.remove('error');
  }
}

function clear() {
  lOperator = null;
  rOperator = null;
  operator = null;

  setDisplay('0');
}

function handleButton(button) {
  let value = button.id.replaceAll('key-', '');
  const isAction = [
    'add',
    'subtract',
    'multiply',
    'divide',
    'mod',
    'pow',
    'fact',
    'eq',
    'ce',
    'root',
  ].includes(value);

  if (isAction) {
    console.log(value);
    switch (value) {
      case 'ce':
        {
          clear();
        }
        break;

      case 'eq':
        {
          if (lOperator !== null && operator !== null && rOperator != null) {
            calculator.operate(lOperator, operator, rOperator);
            justEvaluated = true;
          }
        }
        break;

      default:
        {
          if ('root,fact,pow'.includes(value)) {
            if (lOperator !== null) {
              lOperator = calculator.operate(lOperator, value);
              justEvaluated = true;
            }
            return;
          }

          justEvaluated = false;

          if (value === 'subtract') {
            if (lOperator === null) {
              lOperator = '-';
              return;
            }
          }

          if (lOperator !== null && rOperator !== null) {
            lOperator = calculator.operate(lOperator, operator, rOperator);
            rOperator = null;
          }

          operator = lOperator === null ? null : value;
        }
        break;
    }
  } else {
    if (justEvaluated) {
      justEvaluated = false;
      clear();
    }

    if (rOperator === null && operator === null) {
      if (lOperator === null) {
        lOperator = '';
      }
      if (value === 'dot') {
        if (!lOperator.includes('.')) {
          lOperator += '.';
        }
      } else {
        if (value === 'pi') {
          if (lOperator) {
            lOperator = calculator.operate(lOperator, 'multiply', PI);
          } else {
            lOperator = PI;
          }
        } else if (value === 'e') {
          if (lOperator) {
            lOperator = calculator.operate(lOperator, 'multiply', E);
          } else {
            lOperator = E;
          }
        } else {
          lOperator += value;
        }
      }

      setDisplay(lOperator);
    }

    if (lOperator !== null && operator !== null) {
      if (rOperator === null) {
        rOperator = '';
      }
      if (value === 'dot') {
        if (!rOperator.includes('.')) {
          rOperator += '.';
        }
      } else {
        if (value === 'pi') {
          rOperator = Math.floor(Math.PI * 1000) / 1000;
        } else if (value === 'e') {
          rOperator = Math.floor(Math.E * 1000) / 1000;
        } else {
          rOperator += value;
        }
      }
      setDisplay(rOperator);
    }
  }
}
