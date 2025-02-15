<template>
    <div class="container">
      <button @click="animateBox" class="btn">Animate</button>
      <button @click="resetAnimation" class="btn">Reset</button>
      <div ref="box" class="box"></div>
    </div>
  </template>

  <script setup>
  import { ref } from 'vue';
  import gsap from 'gsap';

  const box = ref(null);

  const animateBox = () => {
    gsap.to(box.value, { x: 200, rotation: 360, duration: 1 });
  };

  const resetAnimation = () => {
    gsap.to(box.value, { x: 0, rotation: 0, duration: 1 });
  };
  </script>

  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 50px;
  }

  .btn {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    transition: background 0.3s;
  }

  .btn:hover {
    background-color: #0056b3;
  }

  .box {
    width: 50px;
    height: 50px;
    background-color: red;
    margin-top: 20px;
  }
  </style>
