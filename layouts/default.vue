<template>
  <div class="layout">
    <Header />
    <div class="content">
      <slot />
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
</script>

<style scoped>
.layout {
  background-color: #BABABC;
  /* background: linear-gradient(to right, #ff7e5f, #feb47b); */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
  padding: 1rem;
}

.footer {
  background-color: black;
  color: white;
  text-align: center;
  padding: 1rem 0;
  width: 100%;
}
</style>