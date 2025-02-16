<template>
  <div class="converter-container">
    <h1>Перетворення числа в 64-бітне число з плаваючою комою double</h1>
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
      <h3>Представлення числа в пам'яті (64 біт):</h3>
      <div class="memory-cell" v-for="(byte, index) in memoryRepresentationBlocks" :key="index">
        <strong>Комірка {{ index }}:</strong> {{ byte }}
      </div>
    </div>

    <div class="memory-representation" v-if="memoryRepresentation">
      <h3>Представлення числа в пам'яті (32 біт):</h3>
      <div class="memory-cell">
        <strong>Знак:</strong> {{ memoryRepresentation.sign }} ({{ memoryRepresentation.sign === '0' ? '+' : '-' }})
      </div>
      <div class="memory-cell">
        <strong>Експонента:</strong> {{ memoryRepresentation.exponent }}
      </div>
      <div class="memory-cell">
        <strong>Мантіса:</strong> {{ memoryRepresentation.mantissa }}
      </div>
      <div class="binary-representation">
        <div>
          <div class="binary-title">Знак</div>
          <span class="sign">{{ memoryRepresentation.sign }}</span>
        </div>
        <div>
          <div class="binary-title">Експонента</div>
          <span class="exponent">{{ memoryRepresentation.exponent }}</span>
        </div>
        <div>
          <div class="binary-title">Мантіса</div>
          <span class="mantissa">{{ memoryRepresentation.mantissa }}</span>
        </div>
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
      memoryRepresentationBlocks: Array(8).fill('00000000'),
      steps: [],
    };
  },
  methods: {
    updateMemoryRepresentation() {
      if (this.decimalInput.trim().length === 0) {
        this.memoryRepresentation = null;
        this.memoryRepresentationBlocks = Array(8).fill('00000000');
        this.errorMessage = 'Будь ласка, введіть число.';
        return;
      }

      if (!this.isValidFloat(this.decimalInput)) {
        this.errorMessage = `Введіть правильне число замість "${this.decimalInput}"`;
        this.memoryRepresentationBlocks = Array(8).fill('00000000');
        return;
      }

      const floatNumber = parseFloat(this.decimalInput);
      if (floatNumber < -1.7e308 || floatNumber > 1.7e308) {
        this.errorMessage = 'Число виходить за межі допустимого діапазону для 64-бітного числа з плаваючою комою';
        this.memoryRepresentationBlocks = Array(8).fill('00000000');
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

      exponent += 1023; // Bias the exponent
      this.steps.push(`Експонента (зміщена): ${exponent}`);

      let exponentBits = exponent.toString(2).padStart(11, '0');
      this.steps.push(`Біти експоненти: ${exponentBits}`);

      let mantissaBits = '';
      for (let i = 0; i < 52; i++) {
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
        exponent: binaryString.slice(1, 12),
        mantissa: binaryString.slice(12, 64),
      };
    },
    splitIntoBytes(binaryString) {
      return [
        binaryString.slice(0, 8),
        binaryString.slice(8, 16),
        binaryString.slice(16, 24),
        binaryString.slice(24, 32),
        binaryString.slice(32, 40),
        binaryString.slice(40, 48),
        binaryString.slice(48, 56),
        binaryString.slice(56, 64),
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
  padding: 5px;
  background-color: #ffcccc;
}

.exponent {
  padding: 5px;
  background-color: #ccffcc;
}

.mantissa {
  padding: 5px;
  background-color: #ccccff;
}

.binary-title {
  text-align: center;
  margin-bottom: 4px;
}
</style>