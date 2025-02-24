<template>
  <div class="converter-container">
    <h1>Перетворення числа в 32-бітне число з плаваючою комою</h1>
    <div class="input-section">
      <label for="decimal-input">Введіть число (Decimal):</label>
      <input
        id="decimal-input"
        type="text"
        v-model="decimalInput"
        @input="updateMemoryRepresentation"
        placeholder="Введіть число"
      />
    </div>

    <div v-if="errorMessage" class="error-message">
      <p>{{ errorMessage }}</p>
    </div>

    <div class="memory-representation">
      <h3>Представлення числа в пам'яті (32 біт):</h3>
      <div class="memory-cell" v-for="(byte, index) in memoryRepresentationBlocks" :key="index">
        <strong>Комірка {{ index }}:</strong> {{ byte }}
      </div>
    </div>

    <div class="memory-representation" v-if="memoryRepresentation">
      <h3>Представлення числа в пам'яті (32 біт):</h3>
      <div class="memory-cell">
        <strong>Sign:</strong> {{ memoryRepresentation.sign }} ({{ memoryRepresentation.sign === '0' ? '+' : '-' }})
      </div>
      <div class="memory-cell">
        <strong>Exponent:</strong> {{ memoryRepresentation.exponent }}
      </div>
      <div class="memory-cell">
        <strong>Mantissa:</strong> {{ memoryRepresentation.mantissa }}
      </div>
      <div class="binary-representation">
        <span class="sign">{{ memoryRepresentation.sign }}</span>
        <span class="exponent">{{ memoryRepresentation.exponent }}</span>
        <span class="mantissa">{{ memoryRepresentation.mantissa }}</span>
      </div>
      <div class="steps">
        <h3>Кроки перетворення:</h3>
        <ul style="margin-left: 1%;">
          <p v-for="(step, index) in steps" :key="index" v-html="step"></p>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      decimalInput: '',
      memoryRepresentation: null,
      errorMessage: '',
      memoryRepresentationBlocks: Array(4).fill('00000000'),
      steps: [],
    };
  },
  methods: {
    updateMemoryRepresentation() {
      if (this.decimalInput.trim().length === 0) {
        this.memoryRepresentation = null;
        this.memoryRepresentationBlocks = Array(4).fill('00000000');
        this.errorMessage = 'Будь ласка, введіть число.';
        return;
      }

      if (!this.isValidFloat(this.decimalInput)) {
        this.errorMessage = `Введіть правильне число замість "${this.decimalInput}"`;
        this.memoryRepresentationBlocks = Array(4).fill('00000000');
        return;
      }

      const floatNumber = parseFloat(this.decimalInput);
      if (floatNumber < -3.4e38 || floatNumber > 3.4e38) {
        this.errorMessage = 'Число виходить за межі допустимого діапазону для 32-бітного числа з плаваючою комою';
        this.memoryRepresentationBlocks = Array(4).fill('00000000');
        return;
      }

      this.errorMessage = '';
      const binaryString = this.toIEEE754(this.decimalInput);
      this.memoryRepresentation = this.splitIntoComponents(binaryString);
      this.memoryRepresentationBlocks = this.splitIntoBytes(binaryString);
    },
    isValidFloat(value) {
      const floatPattern = /^-?\d+(\.\d+)?$/;
      return floatPattern.test(value);
    },
    calculateSteps(number) {
      let temp = Math.abs(number);
      let stepResults = [];

      while (temp > 0) {
        let remainder = temp % 2;
        stepResults.push(`<br><span style="color: #007BFF; font-weight: bold;">${temp}</span> ÷ 2 = <span style="color: #007BFF; font-weight: bold;">${Math.floor(temp / 2)}</span>, записуємо ${remainder} `);
        temp = Math.floor(temp / 2);
      }
      return stepResults.reverse();
    },
    calculateFractionalSteps(number) {
      let temp = number - Math.floor(number);
      let stepResults = [];
      let count = 0;

      while (temp > 0 && count < 23) {
        let tempCaculation = temp * 2;
        let bit = Math.floor(tempCaculation);
        let fractionalPart = tempCaculation - bit;
        stepResults.push(`<br><span style="color: #007BFF; font-weight: bold;">${temp.toFixed(4)}</span> * 2 = ${tempCaculation.toFixed(4)} = (ціла частина) <span style="color: #007BFF; font-weight: bold;">${bit}</span> (дробова чатина для наступного розрахунку) ${fractionalPart.toFixed(4).toString().slice(2, 6)}. записуємо ${bit}`);
        tempCaculation -= bit;
        temp = tempCaculation;
        count++;
      }
      return stepResults;
    },
    toIEEE754(num) {
      this.steps = [];
      if (num == 0) {
        this.steps.push('Число є нулем, тому всі біти встановлені в 0.');
        return '00000000000000000000000000000000';
      }
      let sign = num < 0 ? 1 : 0;
      let helpLog = num < 0 ? 'число від\'ємне' : 'число додатнє';
      this.steps.push(`Знаковий біт: ${sign} оскільки ${helpLog}`);

      let integerPart = Math.trunc(Math.abs(num));
      this.steps.push(`<br>Приводимо цілу частину до бінарного виду <span style="color: #007BFF; font-weight: bold;">${integerPart}</span>:`);
      this.steps.push(this.calculateSteps(integerPart));
      this.steps.push(`Результат: <span style="color: #007BFF; font-weight: bold;">${integerPart.toString(2)}</span>`);
      this.steps.push(`<br>`);

      let fractionalPart = Math.abs(num) - integerPart;
      this.steps.push(`<br>Приводимо дробну частину до бінарного виду <span style="color: #007BFF; font-weight: bold;">${fractionalPart}</span>:`);
      this.steps.push(this.calculateFractionalSteps(fractionalPart));
      this.steps.push(`Результат: <span style="color: #007BFF; font-weight: bold;">${fractionalPart.toString(2).slice(0, 25)}</span>`);
      this.steps.push(`<br>`);

      this.steps.push(`Ціла і дробна частина разом: <span style="color: #007BFF; font-weight: bold;">${integerPart.toString(2)},${fractionalPart.toString(2).slice(2, 54).padEnd(52, '0')}</span>`);

      num = Math.abs(num);
      let exponent = Math.floor(Math.log2(num));
      helpLog = exponent < 0 ? 'зсуваємо число ліворуч' : 'зсуваємо число праворуч';
      this.steps.push(`Експонента (незміщена): <span style="color: #007BFF; font-weight: bold;">${exponent}</span> ${helpLog}`);

      let mantissa = num / Math.pow(2, exponent);
      this.steps.push(`Мантиса з цілою частиною: <span style="color: #007BFF; font-weight: bold;">${mantissa.toString(2).slice(0, 25)}</span>`);
      mantissa -= 1;
      this.steps.push(`Мантиса: <span style="color: #007BFF; font-weight: bold;">${mantissa.toString(2).slice(2, 25)}</span>`);

      this.steps.push(`Експонента (зміщена): 127 + <span style="color: #007BFF; font-weight: bold;">${exponent}</span> = <span style="color: #007BFF; font-weight: bold;">${exponent + 127}</span>`);
      exponent += 127; // Bias the exponent

      this.steps.push(`<br>Приводимо експоненту до бінарного виду <span style="color: #007BFF; font-weight: bold;">${exponent}</span>:`);
      this.steps.push(this.calculateSteps(exponent));

      let exponentBits = exponent.toString(2).padStart(8, '0');
      this.steps.push(`Біти експоненти: <span style="color: #007BFF; font-weight: bold;">${exponentBits}</span>`);
      this.steps.push(`<br>`);

      let mantissaBits = '';
      for (let i = 0; i < 23; i++) {
        mantissa *= 2;
        if (mantissa >= 1) {
          mantissaBits += '1';
          mantissa -= 1;
        } else {
          mantissaBits += '0';
        }
      }
      this.steps.push(`Біти мантіси: <span style="color: #007BFF; font-weight: bold;">${mantissaBits}</span>`);

      return `${sign}${exponentBits}${mantissaBits}`;
    },
    splitIntoComponents(binaryString) {
      return {
        sign: binaryString.slice(0, 1),
        exponent: binaryString.slice(1, 9),
        mantissa: binaryString.slice(9, 32),
      };
    },
    splitIntoBytes(binaryString) {
      return [
        binaryString.slice(0, 8),
        binaryString.slice(8, 16),
        binaryString.slice(16, 24),
        binaryString.slice(24, 32),
      ];
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

.exponent {
  background-color: #ccffcc;
}

.mantissa {
  background-color: #ccccff;
}
</style>