<script setup lang="ts">
defineProps<{
  categories: string[];
  activeCategory: string;
}>();

const emit = defineEmits(['select-category']);

const selectCategory = (category: string) => {
  emit('select-category', category);
};
</script>

<template>
  <div class="categories-menu">
    <h2>Категории</h2>
    <div class="categories-list">
      <button 
        v-for="category in categories" 
        :key="category"
        :class="{ active: category === activeCategory }"
        @click="selectCategory(category)"
      >
        {{ category }}
      </button>
    </div>
    <p v-if="categories.length === 0" class="empty-message">
      Нет категорий. Добавьте категорию в настройках.
    </p>
  </div>
</template>

<style scoped>
.categories-menu {
  margin: 0;
}

.categories-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

h2 {
  display: none;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.4em 0.8em;
  font-size: 0.9em;
  font-weight: 500;
  font-family: inherit;
  background-color: var(--button-bg);
  cursor: pointer;
  transition: all 0.25s;
  white-space: nowrap;
}

button.active {
  border-color: var(--accent-color);
  background-color: var(--button-bg);
}

.empty-message {
  color: #888;
  font-style: italic;
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}
</style>
