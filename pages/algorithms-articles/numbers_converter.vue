<script setup>
import { ref, onMounted } from 'vue';

const inputNumber = ref('');
const inputNumberOutput = ref('');
const fromBase = ref(10);
const toBase = ref(2);
const bitMode = ref('auto');
const bitSize = ref(4);
const steps = ref([]);
const result = ref('');
const errorMessage = ref('');

const bases = [
  { value: 2, label: 'Binary (2)' },
  { value: 8, label: 'Octal (8)' },
  { value: 10, label: 'Decimal (10)' },
  { value: 16, label: 'Hexadecimal (16)' }
];

onMounted(() => {
  inputNumber.value = localStorage.getItem('inputNumber') || '';
  fromBase.value = Number(localStorage.getItem('fromBase')) || 10;
  toBase.value = Number(localStorage.getItem('toBase')) || 2;
  bitMode.value = localStorage.getItem('bitMode') || 'auto';
  bitSize.value = Number(localStorage.getItem('bitSize')) || 4;
});

const validateInput = () => {
  errorMessage.value = '';
  const regexMap = {
    2: /^[01]+$/,
    8: /^[0-7]+$/,
    10: /^-?\d+$/,
    16: /^[0-9A-Fa-f]+$/
  };

  if (inputNumber.value.includes('-')) {
    errorMessage.value = 'Конвертор не підтримує від\'ємні числа';
    return false;
  }

  if (!regexMap[fromBase.value].test(inputNumber.value)) {
    errorMessage.value = `Неправильний формат для ${bases.find(b => b.value === fromBase.value).label}`;
    return false;
  }
  return true;
};

const saveToLocalStorage = () => {
  localStorage.setItem('inputNumber', inputNumber.value);
  localStorage.setItem('fromBase', fromBase.value);
  localStorage.setItem('toBase', toBase.value);
  localStorage.setItem('bitMode', bitMode.value);
  localStorage.setItem('bitSize', bitSize.value);
};

const convertNumber = () => {
  if (!validateInput()) return;
  inputNumberOutput.value = formatNumber(inputNumber.value, fromBase.value);

  steps.value = [];
  try {
    let decimalValue = parseInt(inputNumber.value, fromBase.value);
    if (isNaN(decimalValue)) throw new Error('Invalid number');

    if (toBase.value === 10) {
      calculateStepsToDec(inputNumber.value, fromBase.value, decimalValue);
      result.value = decimalValue;
    } else {
      if (fromBase.value === 2 && toBase.value === 16) {
        binToHex(inputNumber.value);
      } else if (fromBase.value === 2 && toBase.value === 8) {
        binToOct(inputNumber.value);
      } else if (fromBase.value === 8 && toBase.value === 2) {
        octToBin(inputNumber.value);
      } else if (fromBase.value === 8 && toBase.value === 16) {
        octToHex(inputNumber.value);
      } else if (fromBase.value === 16 && toBase.value === 2) {
        hexToBin(inputNumber.value);
      } else if (fromBase.value === 16 && toBase.value === 8) {
        hexToOct(inputNumber.value);
      } else {
        calculateSteps(decimalValue, toBase.value);
      }
      let converted = decimalValue.toString(toBase.value).toUpperCase();
      if (toBase.value === 2) {
        converted = formatBinary(converted, decimalValue);
      } else if (toBase.value === 8) {
        converted = formatOct(converted, decimalValue);
      } else if (toBase.value === 16) {
        converted = formatHex(converted, decimalValue);
      }
      result.value = converted;
    }
    saveToLocalStorage();
  } catch (error) {
    result.value = 'Invalid input';
  }
};

const formatNumber = (number, base) => {
  if (base === 2) {
    return formatBinary(number, inputNumber.value);
  } else if (base === 8) {
    return formatOct(number, inputNumber.value);
  } else if (base === 16) {
    return formatHex(number, inputNumber.value);
  } else if (base === 10) {
    return number.toString();
  }
};

const binToHex = (binaryStr) => {
  let paddedBinary = binaryStr.padStart(Math.ceil(binaryStr.length / 4) * 4, '0');
  let hexResult = '';

  for (let i = 0; i < paddedBinary.length; i += 4) {
    let beforeNumber = paddedBinary.slice(0, i);
    let binChunk = paddedBinary.slice(i, i + 4);
    let afterNumber = paddedBinary.slice(i + 4, paddedBinary.length);
    let hexDigit = parseInt(binChunk, 2).toString(16).toUpperCase();
    steps.value.push(`${beforeNumber} <span style="color: #D35400; font-weight: bold;">${binChunk}</span> ${afterNumber} → ${hexResult} <span style="color: #D35400; font-weight: bold;">${hexDigit}</span>`);
    hexResult += hexDigit;
  }
  return hexResult;
};

const binToOct = (binaryStr) => {
  let paddedBinary = binaryStr.padStart(Math.ceil(binaryStr.length / 3) * 3, '0');
  let octResult = '';

  for (let i = 0; i < paddedBinary.length; i += 3) {
    let beforeNumber = paddedBinary.slice(0, i);
    let binChunk = paddedBinary.slice(i, i + 3);
    let afterNumber = paddedBinary.slice(i + 3, paddedBinary.length);
    let octDigit = parseInt(binChunk, 2).toString(8);
    steps.value.push(`${beforeNumber} <span style="color: #D35400; font-weight: bold;">${binChunk}</span> ${afterNumber} → ${octResult} <span style="color: #D35400; font-weight: bold;">${octDigit}</span>`);
    octResult += octDigit;
  }
  return octResult;
};

const octToHex = (octStr) => {
  steps.value.push(`Спочатку робимо Oct to Bin`);
  let binaryResult = octToBin(octStr);
  steps.value.push(`Тепер Bin to Hex`);
  return binToHex(binaryResult);
};

const hexToBin = (hexStr) => {
  let binaryResult = '';

  for (let i = 0; i < hexStr.length; i++) {
    let beforeNumber = hexStr.slice(0, i);
    let hexDigit = hexStr[i];
    let afterNumber = hexStr.slice(i + 1);
    let binChunk = parseInt(hexDigit, 16).toString(2).padStart(4, '0');
    steps.value.push(`${beforeNumber} <span style="color: #D35400; font-weight: bold;">${hexDigit}</span> ${afterNumber} → ${binaryResult} <span style="color: #D35400; font-weight: bold;">${binChunk}</span>`);
    binaryResult += binChunk;
  }
  return binaryResult;
};

const octToBin = (octalStr) => {
  let binaryResult = '';

  for (let i = 0; i < octalStr.length; i++) {
    let beforeNumber = octalStr.slice(0, i);
    let octDigit = octalStr[i];
    let afterNumber = octalStr.slice(i + 1);
    let binChunk = parseInt(octDigit, 8).toString(2).padStart(3, '0');
    steps.value.push(`${beforeNumber} <span style="color: #D35400; font-weight: bold;">${octDigit}</span> ${afterNumber} → ${binaryResult} <span style="color: #D35400; font-weight: bold;">${binChunk}</span>`);
    binaryResult += binChunk;
  }
  return binaryResult;
};

const hexToOct = (hexStr) => {
  steps.value.push(`Спочатку робимо Hex to Bin`);
  let binaryResult = hexToBin(hexStr);
  steps.value.push(`Тепер Bin to Oct`);
  return binToOct(binaryResult);
};

const formatBinary = (binaryStr, number) => {
  if (bitMode.value === 'auto') {
    let length = Math.ceil(binaryStr.length / 4) * 4;
    binaryStr = binaryStr.padStart(length, number < 0 ? '1' : '0');
  } else {
    binaryStr = binaryStr.padStart(bitSize.value, number < 0 ? '1' : '0');
  }

  return binaryStr.replace(/(.{4})/g, '$1 ').trim();
};

const formatOct = (binaryStr, number) => {
  if (bitMode.value === 'auto') {
    let length = Math.ceil(binaryStr.length / 4) * 4;
    binaryStr = binaryStr.padStart(length, number < 0 ? '7' : '0');
  } else {
    binaryStr = binaryStr.padStart(bitSize.value / 2, number < 0 ? '7' : '0');
  }

  return binaryStr.replace(/(.{4})/g, '$1 ').trim();
};

const formatHex = (binaryStr, number) => {
  if (bitMode.value === 'auto') {
    let length = Math.ceil(binaryStr.length / 4) * 4;
    binaryStr = binaryStr.padStart(length, number < 0 ? 'F' : '0');
  } else {
    binaryStr = binaryStr.padStart(bitSize.value / 4, number < 0 ? 'F' : '0');
  }

  return binaryStr.replace(/(.{4})/g, '$1 ').trim();
};

const calculateSteps = (number, base) => {
  let temp = Math.abs(number);
  let stepResults = [];

  while (temp > 0) {
    let remainder = temp % base;
    stepResults.push(`${temp} ÷ ${base} = ${Math.floor(temp / base)}, залишок = ${remainder}`);
    temp = Math.floor(temp / base);
  }
  steps.value = stepResults.reverse();
};

const calculateStepsToDec = (number, base, res) => {
  let stepResult = "";

  if (base === 2) {
    let numberStr = number.toString();
    for (let i = 0; i < numberStr.length; i++) {
      stepResult += `(${numberStr[i]} * 2 ^ ${numberStr.length - i - 1})`;
      if (i < numberStr.length - 1) {
        stepResult += ' + ';
      }
    }
  } else if (base === 8) {
    let numberStr = number.toString();
    for (let i = 0; i < numberStr.length; i++) {
      stepResult += `(${numberStr[i]} * 8 ^ ${numberStr.length - i - 1})`;
      if (i < numberStr.length - 1) {
        stepResult += ' + ';
      }
    }
  } else if (base === 16) {
    let numberStr = number.toString();
    for (let i = 0; i < numberStr.length; i++) {
      stepResult += `(${numberStr[i]} * 16 ^ ${numberStr.length - i - 1})`;
      if (i < numberStr.length - 1) {
        stepResult += ' + ';
      }
    }
  }
  stepResult += ` = ${res}`;

  steps.value = [stepResult];
};

const drawLines = () => {
  console.log("drawLines")
  const svg = document.getElementById('svg-lines');
  svg.innerHTML = '';

  const stepsElements = document.querySelectorAll('.step-item');
  const resultElement = document.getElementById('result-number');
  console.log("resultElement: ", resultElement)

  if (!resultElement) return;

  stepsElements.forEach((step, index) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const stepBox = step.getBoundingClientRect();
    const resultBox = resultElement.getBoundingClientRect();

    line.setAttribute('x1', stepBox.right + 10);
    line.setAttribute('y1', stepBox.top + stepBox.height / 2);
    line.setAttribute('x2', resultBox.left - 10);
    line.setAttribute('y2', resultBox.top + resultBox.height / 2);
    line.setAttribute('stroke', 'blue');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-dasharray', '5,5');

    svg.appendChild(line);
  });
};
</script>

<template>
  <div class="converter-container">
    <h1>Конвертор чисел</h1>
    <div class="input-section">
      <label>Введіть число:</label>
      <input v-model="inputNumber" type="text" @input="saveToLocalStorage">
    </div>
    <div class="select-section">
      <label>З системи:</label>
      <select v-model="fromBase" @change="saveToLocalStorage">
        <option v-for="base in bases" :key="base.value" :value="base.value">{{ base.label }}</option>
      </select>
      <label>В систему:</label>
      <select v-model="toBase" @change="saveToLocalStorage">
        <option v-for="base in bases" :key="base.value" :value="base.value">{{ base.label }}</option>
      </select>
    </div>
    <div class="bit-section">
      <label>Бітність:</label>
      <select v-model="bitMode" @change="saveToLocalStorage">
        <option value="auto">Автоматична</option>
        <option value="manual">Вручну</option>
      </select>
      <input v-if="bitMode === 'manual'" v-model.number="bitSize" type="number" min="4" max="128" @input="saveToLocalStorage">
    </div>
    <button @click="convertNumber">Конвертувати</button>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div v-if="result" class="result-section">
      <h2>Вхідні дані: <span id="result-number">{{ inputNumberOutput }}</span></h2>
      <div v-if="steps.length">
        <h3 class="text-md font-semibold mt-2">Розрахунок:</h3>
        <ol class="list-disc pl-5">
          <li v-for="(step, index) in steps" :key="index" v-html="step"></li>
        </ol>
      </div>
      <h2>Результат: <span id="result-number">{{ result }}</span></h2>
    </div>
  </div>
</template>

<style scoped>
.converter-container {
  max-width: 80%;
  margin: auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #007BFF;
}

.input-section, .select-section {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 10px;
  background: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #0056b3;
}

.result-section {
  text-align: center;
  margin-top: 20px;
}

.step-item {
  padding: 5px;
  border-bottom: 1px solid #ddd;
}

#svg-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>