<template>
  <div>
    <h1>Algorithms</h1>
    <div v-for="group in algorithmGroups" :key="group.id">
      <NuxtLink :to="`/algorithms/${group.id}`">
        <img :src="group.image" alt="group.title" />
        <h2>{{ group.title }}</h2>
      </NuxtLink>
    </div>
  </div>
</template>
<script setup>
const algorithmGroups = [
  { id: 'sorting', title: 'Sorting Algorithms', image: '/sorting.jpg' },
  { id: 'searching', title: 'Searching Algorithms', image: '/searching.jpg' },
];
</script>