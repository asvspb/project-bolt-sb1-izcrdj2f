<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  films: any[];
}>();

// Состояние загрузки изображений
const loadedImages = ref<Record<string, boolean>>({});

// Функция для обработки загрузки изображения
const handleImageLoad = (filmId: string) => {
  loadedImages.value[filmId] = true;
};

// Функция для обработки ошибки загрузки изображения
const handleImageError = (filmId: string, event: Event) => {
  // Заменяем на заглушку с текстом
  const target = event.target as HTMLImageElement;
  target.src = `https://via.placeholder.com/300x200/2a2a2a/aaa?text=Фильм`;
  loadedImages.value[filmId] = true;
};

// Сбрасываем состояние загрузки при изменении списка фильмов
watch(() => props.films, () => {
  loadedImages.value = {};
});
</script>

<template>
  <div class="films-list">
    <h2>Фильмы</h2>
    <div class="films-grid">
      <div v-for="(film, index) in films" :key="film.id || index" class="film-card">
        <div class="film-thumbnail" :class="{ 'loaded': loadedImages[film.id] }">
          <div class="loading-placeholder" v-if="!loadedImages[film.id]">
            <div class="loading-spinner"></div>
          </div>
          <img
            :src="film.thumbnail || `https://via.placeholder.com/300x200/2a2a2a/aaa?text=Фильм+${index+1}`"
            :alt="film.title || 'Фильм'"
            @load="handleImageLoad(film.id)"
            @error="handleImageError(film.id, $event)"
            :style="{ opacity: loadedImages[film.id] ? 1 : 0 }"
          >
        </div>
        <div class="film-info">
          <h3>{{ film.title || 'Название фильма' }}</h3>
          <p>{{ film.description || 'Описание фильма' }}</p>
        </div>
      </div>

      <div v-if="films.length === 0" class="empty-message">
        <p>Нет фильмов в этой категории или категория не выбрана.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.films-list {
  width: 100%;
}

.films-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
  justify-content: center;
}

.film-card {
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--card-bg);
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px var(--shadow-color);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.film-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px var(--shadow-color);
  background-color: var(--card-hover-bg);
}

.film-thumbnail {
  position: relative;
  width: 100%;
  height: 180px;
  background-color: #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.film-thumbnail.loaded .loading-placeholder {
  display: none;
}

.loading-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2a2a2a;
  z-index: 1;
}

.loading-spinner {
  display: inline-block;
  box-sizing: border-box;
  width: 30px;
  height: 30px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: var(--accent-color, #646cff);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.film-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.film-card:hover .film-thumbnail img {
  transform: scale(1.05);
}

.film-info {
  padding: 1rem;
}

.film-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.film-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #aaa;
}

.empty-message {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  color: #888;
  font-style: italic;
}
</style>