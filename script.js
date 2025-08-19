/**======================
 *    HELPER FUNCTIONS
 *========================**/
const $ = (selector, context = document) => context.querySelector(selector);
const $All = (selector, context = document) =>
  context.querySelectorAll(selector);

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

function clearDisplay() {
  lOperator = null;
  rOperator = null;
  operator = null;

  setDisplay('0');
}

function setAdvancedMode(bool) {
  advancedMode = bool;

  $('#key-lb').disabled = !advancedMode;
  $('#key-rb').disabled = !advancedMode;
  $('#key-root').disabled = advancedMode;
  $('#key-fact').disabled = advancedMode;
  $('#key-pow').disabled = advancedMode;
}

/**======================
 *    CALCULATOR CLASS
 *========================**/
class Calculator {
  constructor() {
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
}

/**============================================
 *               CONSTANTS & VARIABLES
 *=============================================**/
const E = Math.floor(Math.E * 1000) / 1000;
const PI = Math.floor(Math.PI * 1000) / 1000;

let advancedMode = false; // Takes order of operations into consideration
let justEvaluated = false; // Resets display on new input after evaluation in normal mode

// Operation Variables
let lOperator = null;
let rOperator = null;
let operator = null;

let calculator = new Calculator();

/**======================
 *    DOM REFERENCES
 *========================**/
const display = $('#display');
const buttons = [...$All('button')];

/**======================
 *    EVENT HANDLERS
 *========================**/

// For normal mode
function handleButtonNormal(button) {
  if (advancedMode) {
    handleButtonAdvanced(button);
    return;
  }
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
    switch (value) {
      case 'ce':
        {
          clearDisplay();
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
      clearDisplay();
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

// For advanced mode
function handleButtonAdvanced(button) {
  const buttonId = button.id.replaceAll('key-', '');

  switch (buttonId) {
    case 'add':
      {
        setDisplay(display.textContent + ' + ');
      }
      break;

    case 'subtract':
      {
        setDisplay(display.textContent + ' - ');
      }
      break;

    case 'divide':
      {
        setDisplay(display.textContent + ' / ');
      }
      break;

    case 'multiply':
      {
        setDisplay(display.textContent + ' * ');
      }
      break;

    case 'mod':
      {
        setDisplay(display.textContent + ' % ');
      }
      break;

    case 'ce':
      {
        clearDisplay();
      }
      break;

    case 'pi':
      {
        if (
          [null, undefined, '', '0'].includes(display.textContent) ||
          display.classList.contains('error')
        ) {
          setDisplay(PI);
        } else {
          setDisplay(display.textContent + PI);
        }
      }
      break;

    case 'e':
      {
        if (
          [null, undefined, '', '0'].includes(display.textContent) ||
          display.classList.contains('error')
        ) {
          setDisplay(E);
        } else {
          setDisplay(display.textContent + E);
        }
      }
      break;

    case 'eq':
      {
        if (/[a-zA-Z]/.test(display.textContent)) {
          setDisplay("What'r you trying to do?", true);
          return;
        }
        try {
          const errorValues = [null, undefined, Infinity, NaN, Error];
          let result = eval(display.textContent);

          const isError = errorValues.includes(result);
          if (isError) {
            result = 'Error';
          }

          setDisplay(result, isError);
        } catch (e) {
          setDisplay('Error', true);
        }
      }
      break;

    case 'dot':
      {
        if (
          !display.textContent.includes('.') &&
          !display.classList.contains('error')
        ) {
          setDisplay(display.textContent + '.');
        }
      }
      break;

    case 'lb':
      {
        if (
          [null, undefined, '', '0'].includes(display.textContent) ||
          display.classList.contains('error')
        ) {
          setDisplay('(');
        } else {
          setDisplay(display.textContent + '(');
        }
      }
      break;

    case 'rb':
      {
        if (
          [null, undefined, '', '0'].includes(display.textContent) ||
          display.classList.contains('error')
        ) {
          setDisplay(')');
        } else {
          setDisplay(display.textContent + ')');
        }
      }
      break;

    case 'pow':
    case 'fact':
    case 'root':
      {
      }
      break;

    default:
      {
        if (
          [null, undefined, '', '0'].includes(display.textContent) ||
          display.classList.contains('error')
        ) {
          setDisplay(buttonId);
        } else {
          setDisplay(display.textContent + buttonId);
        }
      }
      break;
  }
}

/**======================
 *    EVENT LISTENERS
 *========================**/

// Button click events
buttons.forEach((button) => {
  if (button.id === 'setting-normal' || button.id === 'setting-advanced') {
    button.addEventListener('click', (e) => {
      $('#setting-normal').classList.remove('active');
      $('#setting-advanced').classList.remove('active');

      button.classList.add('active');

      setAdvancedMode(button.id === 'setting-advanced');
    });
  } else {
    button.addEventListener('click', (e) =>
      advancedMode ? handleButtonAdvanced(button) : handleButtonNormal(button)
    );
  }

  if (advancedMode) {
    $('#key-lb').disabled = false;
    $('#key-rb').disabled = false;
    $('#key-root').disabled = true;
    $('#key-fact').disabled = true;
    $('#key-pow').disabled = true;
  }
});

// Keyboard events
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'Delete':
    case 'Backspace':
      {
        advancedMode
          ? handleButtonAdvanced({ id: 'key-ce' })
          : handleButtonNormal({ id: 'key-ce' });

        $('#key-ce').classList.add('active');
      }
      break;

    case '+':
      {
        advancedMode
          ? handleButtonAdvanced({ id: 'key-add' })
          : handleButtonNormal({ id: 'key-add' });

        $('#key-add').classList.add('active');
      }
      break;

    case '-':
      {
        advancedMode
          ? handleButtonAdvanced({ id: 'key-subtract' })
          : handleButtonNormal({ id: 'key-subtract' });

        $('#key-subtract').classList.add('active');
      }
      break;

    case '/':
      {
        advancedMode
          ? handleButtonAdvanced({ id: 'key-divide' })
          : handleButtonNormal({ id: 'key-divide' });

        $('#key-divide').classList.add('active');
      }
      break;

    case '*':
      {
        advancedMode
          ? handleButtonAdvanced({ id: 'key-multiply' })
          : handleButtonNormal({ id: 'key-multiply' });

        $('#key-multiply').classList.add('active');
      }
      break;

    case '.':
      {
        advancedMode
          ? handleButtonAdvanced({ id: 'key-dot' })
          : handleButtonNormal({ id: 'key-dot' });

        $('#key-dot').classList.add('active');
      }
      break;

    case '(':
      {
        if (e.shiftKey) {
          handleButtonAdvanced({ id: 'lb' });
          $('#key-lb').classList.add('active');
        }
      }
      break;

    case ')':
      {
        if (e.shiftKey) {
          handleButtonAdvanced({ id: 'rb' });
          $('#key-rb').classList.add('active');
        }
      }
      break;

    case '=':
    case 'Enter':
      {
        advancedMode
          ? handleButtonAdvanced({ id: 'key-eq' })
          : handleButtonNormal({ id: 'key-eq' });

        $('#key-eq').classList.add('active');
      }
      break;
    default:
      {
        if (parseFloat(e.key) || e.key === '0') {
          advancedMode
            ? handleButtonAdvanced({ id: `key-${e.key}` })
            : handleButtonNormal({ id: `key-${e.key}` });

          $(`#key-${e.key}`).classList.add('active');
        }
      }
      break;
  }
});

document.addEventListener('keyup', (e) => {
  buttons.forEach((button) => button.classList.remove('active'));
});
