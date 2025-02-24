<template>
  <div class="converter-container">
    <h1>Перетворення числа в 32-бітне знакове</h1>
    <div class="input-section">
      <label for="decimal-input">Введіть число (Decimal):</label>
      <input id="decimal-input" type="text" v-model="decimalInput" @input="updateMemoryRepresentation"
        placeholder="Введіть ціле число" />
    </div>

    <div v-if="errorMessage" class="error-message">
      <p>{{ errorMessage }}</p>
    </div>

    <div class="memory-representation">
      <h3>Представлення числа в пам'яті (32 біт):</h3>
      <div class="memory-cell" v-for="(byte, index) in memoryRepresentation" :key="index">
        <strong>Комірка {{ index }}:</strong> {{ byte }}
      </div>
    </div>
    <div class="memory-representation" v-if="memoryRepresentationBlocks">
      <div class="memory-cell">
        <strong>Знак:</strong> {{ memoryRepresentationBlocks.sign }} ({{ memoryRepresentationBlocks.sign === '0' ? '+' :
        '-' }})
      </div>
      <div class="memory-cell">
        <strong>Дані:</strong> {{ memoryRepresentationBlocks.data }}
      </div>
      <div class="binary-representation" v-if="memoryRepresentationBlocks">
        <span class="sign">{{ memoryRepresentationBlocks.sign }}</span>
        <span class="data">{{ memoryRepresentationBlocks.data }}</span>
      </div>
    </div>
    <div class="result-section">
      <div v-if="steps.length">
        <h3 class="text-md font-semibold mt-2">Розрахунок:</h3>
        <div class="list-disc pl-5">
          <p v-for="(step, index) in steps" :key="index" v-html="step"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      decimalInput: '',
      memoryRepresentation: Array(4).fill('00000000'),
      errorMessage: '',
      memoryRepresentationBlocks: null,
      steps: [],
    };
  },
  methods: {
    updateMemoryRepresentation() {
      if (this.decimalInput.length === 0) {
        this.memoryRepresentation = Array(4).fill('00000000');
        this.memoryRepresentationBlocks = null;
        this.errorMessage = '';
        return;
      }

      if (this.decimalInput.includes('-') && this.decimalInput.length === 1) {
        this.memoryRepresentation = Array(4).fill('00000000');
        this.memoryRepresentationBlocks = null;
        this.errorMessage = '';
        return;
      }

      if (!this.isValidInteger(this.decimalInput)) {
        this.errorMessage = 'Введіть правильне ціле число замість "' + this.decimalInput + '"';
        this.memoryRepresentation = Array(4).fill('00000000');
        this.memoryRepresentationBlocks = null;
        return;
      }

      let decimalNumber = parseInt(this.decimalInput, 10);
      if (decimalNumber < -2147483648 || decimalNumber > 2147483647) {
        this.errorMessage = 'Число виходить за межі допустимого діапазону для 32-бітного числа';
        this.memoryRepresentation = Array(4).fill('00000000');
        this.memoryRepresentationBlocks = null;
        return;
      }
      this.errorMessage = '';

      let binaryString = this.calculateStepsToBinary(decimalNumber);
      this.memoryRepresentation = this.splitIntoBytes(binaryString);
      this.memoryRepresentationBlocks = this.splitIntoComponents(this.memoryRepresentation.join(''));
    },
    isValidInteger(value) {
      const integerPattern = /^-?\d+$/;
      return integerPattern.test(value);
    },
    to32BitBinary(num) {
      if (num < 0) {
        num = (Math.pow(2, 32) + num) & 0xFFFFFFFF;
      }

      const binary = num.toString(2);
      return binary.padStart(32, '0').slice(-32);
    },
    calculateSteps(number) {
      let temp = Math.abs(number);
      let stepResults = [];

      while (temp > 0) {
        let remainder = temp % 2;
        stepResults.push(`<br>${temp} ÷ 2 = ${Math.floor(temp / 2)}, залишок = ${remainder}`);
        temp = Math.floor(temp / 2);
      }
      stepResults.push(`Переводимо в двійкову систему числення число ${Math.abs(number)}:`);
      return stepResults.reverse();
    },
    calculateStepsToBinary(number) {
        let stepResult = [];
        const isNegative = number < 0;

        if (isNegative) {
            number = Math.abs(number);
            stepResult.push(`(${number} – змінюємо знак, бо число від’ємне)`);
        }

        stepResult.push(this.calculateSteps(number));
        let binaryStr = number.toString(2);
        stepResult.push(`<br>1. Перетворюємо число ${number} в двійкове: <span style="color: #D35400; font-weight: bold;">${binaryStr}</span>`);
        binaryStr = binaryStr.padStart(32, '0');

        let twosComplement = '';
        if (isNegative) {
            let invertedBinary = binaryStr
                .split('')
                .map(bit => bit === '0' ? '1' : '0')
                .join('');
            stepResult.push(`2. Інвертуємо біти двійкового числа: <span style="color: #007BFF; font-weight: bold;">${binaryStr} -> ${invertedBinary}</span>`);
            let invertedBinaryTemp = invertedBinary;
            twosComplement = (parseInt(invertedBinary, 2) + 1).toString(2);
            stepResult.push(`3. Додаємо 1: <span style="color: #007BFF; font-weight: bold;">${invertedBinaryTemp} + 1 = ${twosComplement}</span>`);
            stepResult.push(`4. Отримуємо доповняльний код для числа ${number}: <span style="color: #007BFF; font-weight: bold;">${twosComplement}</span>`);
        } else {
            twosComplement = binaryStr;
            stepResult.push(`2. Число ${number} вже додатне, тому двійковий запис не змінюється: <span style="color: #007BFF; font-weight: bold;">${binaryStr}</span>`);
        }
        this.steps = stepResult;
        return twosComplement;
    },
    splitIntoBytes(binaryString) {
      return [
        binaryString.slice(0, 8),
        binaryString.slice(8, 16),
        binaryString.slice(16, 24),
        binaryString.slice(24, 32),
      ];
    },
    splitIntoComponents(binaryString) {
      return {
        sign: binaryString.slice(0, 1),
        data: binaryString.slice(1, 32),
      };
    },
  },
};
</script>

<style scoped>
.converter-container {
  /* max-width: 80%; */
  margin: auto;
  padding: 20px;
  /* background: white; */
  border-radius: 10px;
  /* box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); */
}

h1 {
  text-align: center;
  color: #007BFF;
}

.error-message {
  color: red;
  font-weight: bold;
  text-align: center;
}

.input-section, .select-section {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.memory-representation {
  margin-top: 20px;
}

.memory-cell {
  padding: 5px;
  font-size: 14px;
  border-bottom: 1px solid #ddd;
}

.memory-cell strong {
  color: #007BFF;
}

.result-section {
  margin-left: 1%;
  margin-right: 1%;
}

#svg-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.memory-representation {
  margin-top: 20px;
}

.binary-representation {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.binary-representation span {
  padding: 5px;
  font-size: 14px;
  border: 1px solid #ddd;
  margin: 0 2px;
}

.sign {
  background-color: #ffcccc;
}

.data {
  background-color: #ccccff;
}
</style>
