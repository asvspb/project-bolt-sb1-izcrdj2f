<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isDark = ref(true);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('light-theme');
};

onMounted(() => {
  // Initialize theme based on system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  isDark.value = prefersDark;
  if (!prefersDark) {
    document.documentElement.classList.add('light-theme');
  }
});
</script>

<template>
  <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
    <i :class="['fas', isDark ? 'fa-sun' : 'fa-moon']"></i>
  </button>
</template>

<style scoped>
.theme-toggle {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: var(--text-color);
  background-color: var(--button-bg);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.25s ease;
}

.theme-toggle:hover {
  border-color: var(--accent-color);
  transform: translateY(-2px);
}
</style>