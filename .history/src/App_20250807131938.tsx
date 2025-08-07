import { useState } from 'react';
import styles from './styles.module.css';

export const App = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (
    firstValue: number,
    secondValue: number,
    operation: string
  ): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  fetch(
    'https://phoenix-dev.datamicron.com/api/data-loader-bff/api/v1/Connection/search'
  )
    .then((res) => console.log('This is a response', res.json()))
    .then((data) => console.log(data));

  return (
    <div className={styles.calculatorContainer}>
      <div className={styles.calculator}>
        <input
          type="text"
          className={styles.display}
          value={display}
          readOnly
        />
        <div className={styles.buttonGrid}>
          <button
            className={`${styles.button} ${styles.clearButton}`}
            onClick={clear}
          >
            C
          </button>
          <button
            className={`${styles.button} ${styles.operatorButton}`}
            onClick={() => inputOperation('/')}
          >
            ÷
          </button>
          <button
            className={`${styles.button} ${styles.operatorButton}`}
            onClick={() => inputOperation('*')}
          >
            ×
          </button>
          <button
            className={`${styles.button} ${styles.operatorButton}`}
            onClick={() => inputOperation('-')}
          >
            -
          </button>

          <button
            className={`${styles.button} ${styles.numberButton}`}
            onClick={() => inputNumber('7')}
          >
            7
          </button>
          <button
            className={`${styles.button} ${styles.numberButton}`}
            onClick={() => inputNumber('8')}
          >
            8
          </button>
          <button
            className={`${styles.button} ${styles.numberButton}`}
            onClick={() => inputNumber('9')}
          >
            9
          </button>
          <button
            className={`${styles.button} ${styles.operatorButton}`}
            onClick={() => inputOperation('+')}
          >
            +
          </button>

          <button
            className={`${styles.button} ${styles.numberButton}`}
            onClick={() => inputNumber('4')}
          >
            4
          </button>
          <button
            className={`${styles.button} ${styles.numberButton}`}
            onClick={() => inputNumber('5')}
          >
            5
          </button>
          <button
            className={`${styles.button} ${styles.numberButton}`}
            onClick={() => inputNumber('6')}
          >
            6
          </button>
          <button
            className={`${styles.button} ${styles.equalsButton}`}
            onClick={performCalculation}
            style={{ gridRow: 'span 2' }}
          >
            =
          </button>

          <button
            className={`${styles.button} ${styles.numberButton}`}
            onClick={() => inputNumber('1')}
          >
            1
          </button>
          <button
            className={`${styles.button} ${styles.numberButton}`}
            onClick={() => inputNumber('2')}
          >
            2
          </button>
          <button
            className={`${styles.button} ${styles.numberButton}`}
            onClick={() => inputNumber('3')}
          >
            3
          </button>

          <button
            className={`${styles.button} ${styles.numberButton} ${styles.zeroButton}`}
            onClick={() => inputNumber('0')}
          >
            0
          </button>
          <button
            className={`${styles.button} ${styles.numberButton}`}
            onClick={() => inputNumber('.')}
          >
            .
          </button>
        </div>
      </div>
    </div>
  );
};
