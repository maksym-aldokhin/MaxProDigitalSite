<script setup>
const { data: news, error } = await useFetch('/api/news');
console.log("news: ", news)
</script>

<template>
  <div>
    <h1>Останні новини</h1>
    <div v-if="!news || news.length === 0">
      <p>Новини не знайдено.</p>
    </div>
    <div v-else class="news-container">
      <div v-for="item in news" :key="item.id" class="news-item">
        <NuxtLink :to="`/news/${item.id}`">
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
.news-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.news-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px; /* Відступ між новинами */
  transition: transform 0.2s;
}
.news-item:hover {
  transform: scale(1.05);
}
.news-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.news-item h2 {
  font-size: 20px;
  margin: 10px;
}
.news-item p {
  font-size: 14px;
  color: #555;
  margin: 0 10px 10px;
}
</style>