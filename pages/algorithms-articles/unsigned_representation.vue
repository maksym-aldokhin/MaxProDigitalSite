<template>
  <div class="converter-container">
    <h1>Перетворення числа в 32-бітне беззнакове число</h1>
    <div class="input-section">
      <label for="decimal-input">Введіть число (Decimal):</label>
      <input
        id="decimal-input"
        type="text"
        v-model="decimalInput"
        @input="updateMemoryRepresentation"
        placeholder="Введіть ціле число"
      />
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
        <strong>Дані:</strong> {{ memoryRepresentationBlocks.data }}
      </div>
      <div class="binary-representation" v-if="memoryRepresentationBlocks">
        <span class="data">{{ memoryRepresentationBlocks.data }}</span>
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
    };
  },
  methods: {
    updateMemoryRepresentation() {
      if (this.decimalInput.length === 0) {
        this.memoryRepresentation = Array(4).fill('00000000');
        this.errorMessage = '';
        this.memoryRepresentationBlocks = null;
        return;
      }

      if (this.decimalInput.includes('-')) {
        this.errorMessage = 'Не підтримується від\'ємне число';
        this.memoryRepresentationBlocks = null;
        return;
      }

      if (!this.isValidInteger(this.decimalInput)) {
        this.errorMessage = 'Введіть правильне ціле число замість "' + this.decimalInput + '"';
        this.memoryRepresentationBlocks = null;
        return;
      }

      let decimalNumber = parseInt(this.decimalInput, 10);
      if (decimalNumber < 0 || decimalNumber > 4294967295) {
        this.errorMessage = 'Число виходить за межі допустимого діапазону для безнаковго 32-бітного числа';
        this.memoryRepresentationBlocks = null;
        return;
      }
      this.errorMessage = '';

      const binaryString = this.to32BitBinary(decimalNumber);
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
        data: binaryString.slice(0, 32),
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

.data {
  background-color: #ccccff;
}
</style>
