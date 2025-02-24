<template>
  <header class="header">
    <nav class="nav">
      <NuxtLink to="/" class="link">News</NuxtLink>
      <span class="separator">|</span>
      <NuxtLink to="/algorithms" class="link">Algorithms</NuxtLink>
      <span class="separator">|</span>
      <NuxtLink to="/about" class="link">About</NuxtLink>
      <span class="separator">|</span>
      <NuxtLink to="https://www.youtube.com/@maxprodigital" class="link">YouTube</NuxtLink>
    </nav>
  </header>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap');

.header {
  background-color: #1f2937;
  padding: 1rem 0;
  width: 100%;
}

.nav {
  display: flex;
  justify-content: center;
}

.nav-right {
  display: flex;
  justify-content: right;
}

.link {
  color: white;
  padding: 0.5rem 1rem;
  transition: color 0.3s;
  text-decoration: none;
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
}

.link:hover {
  color: #d1d5db;
}

.separator {
  color: white;
  padding: 0 0.5rem;
  font-size: 1.8rem;
}
</style>