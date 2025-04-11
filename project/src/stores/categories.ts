import { defineStore } from 'pinia';
import { mockService, type Category } from '../services/mock-service';

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [] as Category[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchCategories() {
      this.loading = true;
      this.error = null;

      try {
        // Используем мок-сервис вместо API
        this.categories = mockService.getCategories();
      } catch (error: any) {
        console.error('Failed to fetch categories:', error);
        this.error = error.message || 'Failed to fetch categories';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async addCategory(category: Omit<Category, 'id'>) {
      this.loading = true;
      this.error = null;

      try {
        // Добавляем категорию через мок-сервис
        const newCategory = mockService.addCategory(category);

        // Генерируем мок-фильмы для новой категории
        await mockService.generateMockFilms(category.name);

        // Обновляем список категорий
        this.categories = mockService.getCategories();

        return newCategory;
      } catch (error: any) {
        console.error('Failed to add category:', error);
        this.error = error.message || 'Failed to add category';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateCategory(category: Category) {
      this.loading = true;
      this.error = null;

      try {
        // Обновляем категорию через мок-сервис
        mockService.updateCategory(category);

        // Обновляем список категорий
        this.categories = mockService.getCategories();
      } catch (error: any) {
        console.error('Failed to update category:', error);
        this.error = error.message || 'Failed to update category';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteCategory(id: number) {
      this.loading = true;
      this.error = null;

      try {
        // Удаляем категорию через мок-сервис
        mockService.deleteCategory(id);

        // Обновляем список категорий
        this.categories = mockService.getCategories();
      } catch (error: any) {
        console.error('Failed to delete category:', error);
        this.error = error.message || 'Failed to delete category';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});