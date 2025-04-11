<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import logoDark from './assets/logo-dark.svg';
import logoLight from './assets/logo-light.svg';
import CategoriesMenu from './components/CategoriesMenu.vue';
import FilmsList from './components/FilmsList.vue';
import SettingsModal from './components/SettingsModal.vue';
import ProgressBar from './components/ProgressBar.vue';
import ThemeToggle from './components/ThemeToggle.vue';
import { mockService } from './services/mock-service';
import { useCategoriesStore } from './stores/categories';

const categoriesStore = useCategoriesStore();

const showSettings = ref(false);
const activeCategory = ref('');
const films = ref<any[]>([]);
const isLoading = ref(false);
const progress = ref(0);
const isDarkTheme = ref(true);

// Используем список категорий из хранилища
const categories = computed(() => {
  return categoriesStore.categories.map(cat => cat.name);
});

onMounted(async () => {
  // Инициализируем приложение
  await loadCategories();

  // Проверяем текущую тему
  isDarkTheme.value = !document.documentElement.classList.contains('light-theme');

  // Слушаем изменения темы
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        isDarkTheme.value = !document.documentElement.classList.contains('light-theme');
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
});

const loadCategories = async () => {
  try {
    // Загружаем категории из хранилища
    await categoriesStore.fetchCategories();

    if (categories.value.length > 0) {
      activeCategory.value = categories.value[0];
      await loadFilms(activeCategory.value);
    }
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
};

const loadFilms = async (category: string) => {
  activeCategory.value = category;
  isLoading.value = true;

  try {
    // Загружаем фильмы из мок-сервиса
    films.value = mockService.getFilmsByCategory(category);
  } catch (error) {
    console.error('Failed to load films:', error);
  } finally {
    isLoading.value = false;
  }
};

const openSettings = () => {
  showSettings.value = true;
};

const closeSettings = () => {
  showSettings.value = false;
  loadCategories();
};
</script>

<template>
  <div class="app-container">
    <div class="top-section">
      <div class="logo-container">
        <img :src="isDarkTheme ? logoLight : logoDark" alt="Rutube Parser" class="logo" />
      </div>
      <CategoriesMenu
        :categories="categories"
        :activeCategory="activeCategory"
        @select-category="loadFilms"
      />
      <div class="top-buttons">
        <button @click="openSettings" class="icon-button" title="Настройки">
          <i class="fas fa-cog"></i>
        </button>
        <ThemeToggle />
      </div>
    </div>

    <main>
      <FilmsList :films="films" />
      <ProgressBar v-if="isLoading" :progress="progress" />
    </main>

    <SettingsModal
      v-if="showSettings"
      @close="closeSettings"
      @progress="(p: number) => progress = p"
    />
  </div>
</template>

<style scoped>
.app-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 2rem 0;
  text-align: center;
  position: relative;
}

.top-section {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: var(--bg-color);
  padding: 1rem;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo-container {
  flex: 0 0 auto;
  padding: 0 1rem;
}

.logo {
  height: 40px;
  width: auto;
  display: block;
}

.top-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* Остальные стили остаются без изменений */

@media (max-width: 768px) {
  .logo {
    height: 32px;
  }

  .top-section {
    padding: 0.5rem;
  }

  .logo-container {
    padding: 0 0.5rem;
  }
}
</style>
