<script setup>
import { ref } from 'vue';

const numbers = ref('');
const steps = ref([]);
const swaps = ref([]);
const sortedArray = ref([]);
const sortOrder = ref('asc');
const showComments = ref(true);
let from = -1;
let to = -1;

const quickSort = (arr, left = 0, right = arr.length - 1, depth = 0, comparator) => {
  // setTimeout(() => {  console.log('World!'); }, 10000);
  let accent = true;
  let sorted = false;
  let comment = "Intermediate result";

  if (left < right) {
    let pivot = partition(arr, left, right, comparator);
    steps.value.push({ array: [...arr], pivot, left, right, depth, accent, comment, sorted, from, to });
    quickSort(arr, left, pivot - 1, depth + 1, comparator);
    quickSort(arr, pivot + 1, right, depth + 1, comparator);
  }
  return arr;
};

const partition = (arr, left, right, comparator) => {
  let pivotValue = arr[right];
  let i = left - 1;
  let depth = 1;
  let pivot = right;
  let accent = false;
  let sorted = false;
  let from = -1;
  let to = -1;
  let smallest = -1;

  for (let j = left; j < right; j++) {
    if (comparator(arr[j], pivotValue)) {
      i++;
      if (arr[i] === arr[j]) {
        continue;
      }
      from = i;
      to = j;
      let comment = "swap " + i.toString() + " and " + j.toString() + " (" + arr[i].toString() + " more then " + arr[j].toString() + ") <br>smallest element: " + i.toString();
      [arr[i], arr[j]] = [arr[j], arr[i]];
      // swaps.value.push([...arr]);
      steps.value.push({ array: [...arr], pivot, left, right, depth, accent, comment, sorted , from, to, smallest});
      console.log('right:', right);
    }
  }
  from = i + 1;
  to = right;
  let comment = "swap pivot " + right.toString() + " and " + (i + 1).toString();
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  // swaps.value.push([...arr]);
  steps.value.push({ array: [...arr], pivot, left, right, depth, accent, comment, sorted, from, to });
  console.log('right:', right);
  return i + 1;
};

const sortNumbers = () => {
  steps.value = [];
  swaps.value = [];
  let arr = numbers.value.split(',').map(Number).filter(n => !isNaN(n));
  const comparator = sortOrder.value === 'asc'
    ? (a, b) => a < b
    : (a, b) => a > b;
  sortedArray.value = quickSort([...arr], 0, arr.length - 1, 0, comparator);

  let pivot = -1;
  let left = 0;
  let right = arr.length - 1;
  let depth = 0;
  let accent = 1;
  let comment = "Result";
  let sorted = true;
  let from = -1;
  let to = -1;
  steps.value.push({ array: [...sortedArray.value], pivot, left, right, depth, accent, comment, sorted, from, to });
};

onMounted(() => {
  numbers.value = localStorage.getItem('numbers') || '';
  showComments.value = JSON.parse(localStorage.getItem('showComments')) ?? true;
});

watch(showComments, (newValue) => {
  localStorage.setItem('showComments', JSON.stringify(newValue));
});

const saveToLocalStorage = () => {
  localStorage.setItem('numbers', numbers.value);
};
</script>

<template>
  <div class="sort-container">
    <h1>Quick Sort Visualization</h1>
    <input v-model="numbers" type="text" @input="saveToLocalStorage" v-on:keyup.enter="sortNumbers" placeholder="Enter numbers separated by commas">
    <select v-model="sortOrder">
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
    <div class="controls">
      <button @click="sortNumbers"  class="convert-button">Sort</button>
    </div>
      <!-- <label>
        <input type="checkbox" v-model="showComments"> Show Comments
      </label> -->
    <div class="controls">
      <b>Show Comments</b>
      <label class="toggle-switch">
        <input type="checkbox" v-model="showComments">
        <span class="slider"></span>
      </label>
    </div>
    <div style="align-items: center;">
      <div v-if="steps.length" class="visualization">
        <div v-for="(step, index) in steps" :key="index"
            class="step">
          <div class="items-row tooltip">
            <div v-for="(num, idx) in step.array" :key="idx"
                :class="{'pivot': idx === step.pivot,
                          'highlight': idx >= step.left && idx <= step.right,
                          'not-accent': !step.accent,
                          'hide': idx < step.left || idx > step.right,
                          'sorted': step.sorted,
                          'moving': idx === step.from || idx === step.to,
                          'smallest': idx === step.smallest}"
                class="block" :style="{ width: Math.max(40, num.toString().length * 10) + 'px' }">{{ num }}</div>
            <span class="tooltiptext" v-html="step.comment"></span>
          </div>
          <!-- <b>{{ step.comment }}</b> -->
          <div class="comment-column" v-if="showComments" :style="{ width: Math.max(40, step.comment.toString().length * 10) + 'px' }" v-html="step.comment">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sort-container {
  text-align: center;
  padding: 20px;
}

.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  width: 100%;
  background-color: #555;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;

  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -50%;

  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.convert-button {
  width: 200px;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}

.comment-column {
  justify-content: left;
  text-align: left;
  /* width: 400px; */
}

.controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 34px;
  height: 20px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:checked + .slider:before {
  transform: translateX(14px);
}

input, select {
  padding: 10px;
  width: 80%;
  margin-bottom: 10px;
}

button {
  padding: 10px;
  background: blue;
  color: white;
  border: none;
  cursor: pointer;
}

.visualization {
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  /* margin-top: 20px; */
  padding: 40px;
  max-width: 100%;
  overflow-x: auto;
  white-space: nowrap;
}

.items-row {
  display: flex;
  gap: 5px;
  align-items: center;
  min-width: max-content;
}

.column {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.block {
  /* min-width: 40px; */
  /* width: 120%; */
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: lightblue;
  border-radius: 5px;
}

.pivot {
  background: #9B59B6 !important;
}

.highlight {
  border: 2px solid darkblue;
}

.sorted {
  background: #1ABC9C !important;
}

.moving {
  background: #F9BC93 !important;
}

.smallest {
  background: #FE9EA2 !important;
}

.not-accent {
  filter: grayscale(40%);
  /* opacity: 0.2; */
  pointer-events: none;
  cursor: not-allowed;
}

.hide {
  opacity: 0.3;
  pointer-events: none;
  cursor: not-allowed;
}

.history {
  margin-top: 20px;
  text-align: left;
}

.swap-step {
  display: flex;
  gap: 10px;
  opacity: 0.6;
  margin-bottom: 5px;
}

.swap-block {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: gray;
  border-radius: 5px;
  color: white;
}
</style>