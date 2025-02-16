<script setup>
const { data: algorithms, error } = await useFetch('/api/algorithms');
</script>

<template>
  <div>
    <h1>Алгоритми</h1>
    <div v-if="error">
      <p>Помилка завантаження алгоритмів.</p>
    </div>
    <div v-if="!algorithms || algorithms.length === 0">
      <p>Алгоритми не знайдено.</p>
    </div>
    <div v-else class="algorithms-container">
      <div v-for="item in algorithms" :key="item.id" class="algorithms-item">
        <NuxtLink :to="`/algorithms-articles/${item.id}`">
          <img :src="item.image" :alt="item.title" />
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
}
.algorithms-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.algorithms-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px; /* Відступ між новинами */
  transition: transform 0.2s;
}
.algorithms-item:hover {
  transform: scale(1.05);
}
.algorithms-item img {
  width: 100%;
  height: 170px;
  object-fit: cover;
}
.algorithms-item h2 {
  font-size: 20px;
  margin: 10px;
}
.algorithms-item p {
  font-size: 14px;
  color: #555;
  margin: 0 10px 10px;
}
</style>