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

let ADVANCED = false;

let justEvaluated = false;

let calculator = new Calculator();

buttons.forEach((button) => {
  if (button.id === 'setting-normal' || button.id === 'setting-advanced') {
    button.addEventListener('click', (e) => {
      $('#setting-normal').classList.remove('active');
      $('#setting-advanced').classList.remove('active');

      button.classList.add('active');

      setAdvanced(button.id === 'setting-advanced');
    });
  } else {
    button.addEventListener('click', (e) =>
      ADVANCED ? handleInput(button) : handleButton(button)
    );
  }

  if (ADVANCED) {
    $('#key-lb').disabled = false;
    $('#key-rb').disabled = false;
    $('#key-root').disabled = true;
    $('#key-fact').disabled = true;
    $('#key-pow').disabled = true;
  }
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'Delete':
    case 'Backspace':
      {
        ADVANCED
          ? handleInput({ id: 'key-ce' })
          : handleButton({ id: 'key-ce' });

        $('#key-ce').classList.add('active');
      }
      break;

    case '+':
      {
        ADVANCED
          ? handleInput({ id: 'key-add' })
          : handleButton({ id: 'key-add' });

        $('#key-add').classList.add('active');
      }
      break;

    case '-':
      {
        ADVANCED
          ? handleInput({ id: 'key-subtract' })
          : handleButton({ id: 'key-subtract' });

        $('#key-subtract').classList.add('active');
      }
      break;

    case '/':
      {
        ADVANCED
          ? handleInput({ id: 'key-divide' })
          : handleButton({ id: 'key-divide' });

        $('#key-divide').classList.add('active');
      }
      break;

    case '*':
      {
        ADVANCED
          ? handleInput({ id: 'key-multiply' })
          : handleButton({ id: 'key-multiply' });

        $('#key-multiply').classList.add('active');
      }
      break;

    case '.':
      {
        ADVANCED
          ? handleInput({ id: 'key-dot' })
          : handleButton({ id: 'key-dot' });

        $('#key-dot').classList.add('active');
      }
      break;

    case '(':
      {
        if (e.shiftKey) {
          handleInput({ id: 'lb' });
          $('#key-lb').classList.add('active');
        }
      }
      break;

    case ')':
      {
        if (e.shiftKey) {
          handleInput({ id: 'rb' });
          $('#key-rb').classList.add('active');
        }
      }
      break;

    case '=':
    case 'Enter':
      {
        ADVANCED
          ? handleInput({ id: 'key-eq' })
          : handleButton({ id: 'key-eq' });

        $('#key-eq').classList.add('active');
      }
      break;
    default:
      {
        if (parseFloat(e.key) || e.key === '0') {
          ADVANCED
            ? handleInput({ id: `key-${e.key}` })
            : handleButton({ id: `key-${e.key}` });

          $(`#key-${e.key}`).classList.add('active');
        }
      }
      break;
  }
});

document.addEventListener('keyup', (e) => {
  buttons.forEach((button) => button.classList.remove('active'));
});

function setAdvanced(bool) {
  ADVANCED = bool;

  $('#key-lb').disabled = !ADVANCED;
  $('#key-rb').disabled = !ADVANCED;
  $('#key-root').disabled = ADVANCED;
  $('#key-fact').disabled = ADVANCED;
  $('#key-pow').disabled = ADVANCED;
}

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

// For normal
function handleButton(button) {
  if (ADVANCED) {
    handleInput(button);
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

// For advanced
function handleInput(button) {
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
        clear();
      }
      break;

    case 'pi':
      {
        if ([null, undefined, '', '0'].includes(display.textContent)) {
          setDisplay(PI);
        } else {
          setDisplay(display.textContent + PI);
        }
      }
      break;

    case 'e':
      {
        if ([null, undefined, '', '0'].includes(display.textContent)) {
          setDisplay(E);
        } else {
          setDisplay(display.textContent + E);
        }
      }
      break;

    case 'eq':
      {
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
        if (!display.textContent.includes('.')) {
          setDisplay(display.textContent + '.');
        }
      }
      break;

    case 'lb':
      {
        if ([null, undefined, '', '0'].includes(display.textContent)) {
          setDisplay('(');
        } else {
          setDisplay(display.textContent + '(');
        }
      }
      break;

    case 'rb':
      {
        if ([null, undefined, '', '0'].includes(display.textContent)) {
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
        if ([null, undefined, '', '0'].includes(display.textContent)) {
          setDisplay(buttonId);
        } else {
          setDisplay(display.textContent + buttonId);
        }
      }
      break;
  }
}
