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
        <ul>
          <li v-for="(step, index) in steps" :key="index">{{ step }}</li>
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
    toIEEE754(num) {
      this.steps = [];
      let sign = num < 0 ? 1 : 0;
      this.steps.push(`Знаковий біт: ${sign}`);

      num = Math.abs(num);
      let exponent = Math.floor(Math.log2(num));
      this.steps.push(`Експонента (незміщена): ${exponent}`);

      let mantissa = num / Math.pow(2, exponent) - 1;
      this.steps.push(`Мантиса: ${mantissa}`);

      exponent += 127; // Bias the exponent
      this.steps.push(`Експонента (зміщена): ${exponent}`);

      let exponentBits = exponent.toString(2).padStart(8, '0');
      this.steps.push(`Біти експоненти: ${exponentBits}`);

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
      this.steps.push(`Біти мантіси: ${mantissaBits}`);

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