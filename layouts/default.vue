<template>
  <div class="layout">
    <Header />
    <div class="content">
      <div class="content1">
        <slot />
      </div>
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
  background-color: #f9f9f9;
  /* background: linear-gradient(to right, #ff7e5f, #feb47b); */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
  padding: 1rem;
  text-align: center;
  margin-top: 10px;
  min-height: 80vh;
  margin: auto;
}

/* .content1 {
  text-align: center;
} */

.footer {
  background-color: black;
  color: white;
  text-align: center;
  padding: 1rem 0;
  width: 100%;
}

@media (min-width: 768px) {
  .content {
    text-align: center;
    margin-left: 20%;
    margin-right: 20%;
    border-radius: 10px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

  }
  /* .content1 {
    text-align: center;
    margin-left: 5%;
    margin-right: 5%;
  } */
}
</style>