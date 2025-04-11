<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Category } from '../types/category';
import { useCategoriesStore } from '../stores/categories';

const categoriesStore = useCategoriesStore();
const emit = defineEmits(['close']);

// Modal states
const isAddMode = ref(false);
const isLoading = ref(false);
const error = ref('');
const showDeleteConfirm = ref(false);

// Form data
const formData = ref<Partial<Category>>({
  name: '',
  url: '',
  threshold: 0
});

const selectedCategory = ref<Category | null>(null);
const categoryToDelete = ref<Category | null>(null);

const categories = computed(() => categoriesStore.categories);

onMounted(async () => {
  try {
    await categoriesStore.fetchCategories();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
});

// URL validation
const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('rutube.ru');
  } catch {
    return false;
  }
};

const validateForm = (): boolean => {
  if (!formData.value.name?.trim()) {
    error.value = 'Название не может быть пустым';
    return false;
  }

  if (!formData.value.url?.trim()) {
    error.value = 'URL не может быть пустым';
    return false;
  }

  if (!isValidUrl(formData.value.url)) {
    error.value = 'Неверный формат URL (должен быть с домена rutube.ru)';
    return false;
  }

  if (formData.value.threshold! < 0) {
    error.value = 'Порог отбора не может быть отрицательным';
    return false;
  }

  return true;
};

const resetForm = () => {
  formData.value = {
    name: '',
    url: '',
    threshold: 0
  };
  error.value = '';
};

const showAddForm = () => {
  isAddMode.value = true;
  selectedCategory.value = null;
  resetForm();
};

const editCategory = (category: Category) => {
  selectedCategory.value = category;
  formData.value = { ...category };
  isAddMode.value = false;
  error.value = '';
};

const saveCategory = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  error.value = '';

  try {
    if (isAddMode.value) {
      await categoriesStore.addCategory(formData.value as Category);
      isAddMode.value = false;
    } else if (selectedCategory.value) {
      await categoriesStore.updateCategory({
        ...selectedCategory.value,
        ...formData.value
      });
    }
    resetForm();
  } catch (err: any) {
    error.value = err.message || 'Произошла ошибка при сохранении';
  } finally {
    isLoading.value = false;
  }
};

const confirmDelete = (category: Category) => {
  categoryToDelete.value = category;
  showDeleteConfirm.value = true;
};

const deleteCategory = async () => {
  if (!categoryToDelete.value) return;

  isLoading.value = true;

  try {
    await categoriesStore.deleteCategory(categoryToDelete.value.id);
    if (selectedCategory.value?.id === categoryToDelete.value.id) {
      selectedCategory.value = null;
    }
  } catch (err: any) {
    error.value = err.message || 'Произошла ошибка при удалении';
  } finally {
    isLoading.value = false;
    showDeleteConfirm.value = false;
    categoryToDelete.value = null;
  }
};
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <h2>Управление категориями</h2>

      <!-- Categories List -->
      <div class="categories-list" v-if="!isAddMode">
        <div v-for="category in categories" :key="category.id" class="category-card">
          <div class="category-info">
            <h3>{{ category.name }}</h3>
            <p class="url">{{ category.url }}</p>
            <div class="threshold-field">
              <label>Порог отбора:</label>
              <input
                type="number"
                v-model.number="category.threshold"
                min="0"
                @change="categoriesStore.updateCategory(category)"
              >
            </div>
          </div>
          <div class="category-actions">
            <button @click="editCategory(category)" class="edit-btn">
              <i class="fas fa-edit"></i> Изменить
            </button>
            <button @click="confirmDelete(category)" class="delete-btn">
              <i class="fas fa-trash"></i> Удалить
            </button>
          </div>
        </div>

        <button @click="showAddForm" class="add-btn">
          <i class="fas fa-plus"></i> Добавить категорию
        </button>
      </div>

      <!-- Add/Edit Form -->
      <form v-else @submit.prevent="saveCategory" class="category-form">
        <h3>{{ isAddMode ? 'Добавление категории' : 'Редактирование категории' }}</h3>

        <div class="form-group">
          <label>Название *</label>
          <input
            v-model="formData.name"
            type="text"
            required
            :disabled="isLoading"
          >
        </div>

        <div class="form-group">
          <label>URL *</label>
          <input
            v-model="formData.url"
            type="url"
            required
            :disabled="isLoading"
          >
        </div>

        <div class="form-group">
          <label>Порог отбора</label>
          <input
            v-model.number="formData.threshold"
            type="number"
            min="0"
            :disabled="isLoading"
          >
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>

        <div class="form-actions">
          <button type="submit" :disabled="isLoading" class="save-btn">
            {{ isLoading ? 'Сохранение...' : 'Сохранить' }}
          </button>
          <button type="button" @click="isAddMode = false" :disabled="isLoading">
            Отмена
          </button>
        </div>
      </form>

      <!-- Delete Confirmation Dialog -->
      <div v-if="showDeleteConfirm" class="delete-confirm-dialog">
        <p>Вы уверены, что хотите удалить категорию "{{ categoryToDelete?.name }}"?</p>
        <div class="confirm-actions">
          <button @click="deleteCategory" class="confirm-delete-btn" :disabled="isLoading">
            {{ isLoading ? 'Удаление...' : 'Удалить' }}
          </button>
          <button @click="showDeleteConfirm = false" :disabled="isLoading">
            Отмена
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background-color: var(--bg-color);
  border-radius: 12px;
  padding: 2rem;
  box-sizing: border-box;
  max-width: 400px; /* Уменьшено с 800px */
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.75rem;
}

.category-card {
  background-color: var(--button-bg);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.category-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: var(--text-color);
}

.url {
  color: var(--text-secondary);
  word-break: break-all;
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.threshold-field {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.75rem;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.threshold-field input {
  width: 120px;
  box-sizing: border-box;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-size: 0.9rem;
}

.category-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

/* Form styles */
.category-form {
  background-color: var(--button-bg);
  padding: 1.5rem;
  border-radius: 12px;
  margin-top: 1rem;
  width: 300px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}

.category-form h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.form-group {
  margin-bottom: 1.25rem;
  width: 100%;
  box-sizing: border-box;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-size: 1rem;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.error-message {
  width: 100%;
  color: var(--error-color);
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: rgba(255, 0, 0, 0.1);
  border-radius: 6px;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  width: 100%;
  box-sizing: border-box;
}

/* Button styles */
button {
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

button i {
  font-size: 1rem;
}

.save-btn {
  background-color: var(--accent-color);
  color: white;
}

.save-btn:hover {
  background-color: var(--hover-accent-color);
  transform: translateY(-1px);
}

.delete-btn {
  background-color: var(--error-color);
  color: white;
}

.delete-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.edit-btn {
  background-color: var(--secondary-color);
  color: white;
}

.edit-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Delete confirmation dialog */
.delete-confirm-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--bg-color);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 1100;
  min-width: 300px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.delete-confirm-dialog p {
  margin: 0 0 1.5rem 0;
  color: var(--text-color);
}

.confirm-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.confirm-delete-btn {
  background-color: var(--error-color);
  color: white;
}

.confirm-delete-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Add button */
.add-btn {
  width: 100%;
  background-color: var(--accent-color);
  color: white;
  margin-top: 1rem;
  justify-content: center;
}

.add-btn:hover {
  background-color: var(--hover-accent-color);
  transform: translateY(-1px);
}

/* Scrollbar styles */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: var(--accent-color);
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: var(--hover-accent-color);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .modal-content {
    padding: 1.5rem;
    box-sizing: border-box;
    width: 95%;
    max-width: 350px; /* Добавлено ограничение для мобильных */
  }

  .category-card {
    padding: 1rem;
  }

  .category-actions {
    flex-direction: column;
  }

  .category-actions button {
    width: 100%;
    justify-content: center;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions button {
    width: 100%;
    justify-content: center;
  }

  .form-group,
  .form-actions,
  .error-message {
    width: 100%; /* На мобильных используем полную ширину */
    max-width: 300px; /* Максимальная ширина для мобильных */
  }

  .category-form {
    width: 100%; /* На мобильных используем полную ширину */
    max-width: 300px; /* Максимальная ширина для мобильных */
  }
}
</style>
