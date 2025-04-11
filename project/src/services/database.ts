// Используем localStorage вместо SQL.js для избежания проблем с WebAssembly

type Category = {
  name: string;
  url: string;
  threshold: number;
};

type Film = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
};

export class DatabaseService {
  private initialized = false;
  private categories: Record<string, Category> = {};
  private films: Record<string, Record<string, Film>> = {};

  public async init(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('Initializing database...');

      // Загружаем данные из localStorage
      const storedCategories = localStorage.getItem('rutube_categories');
      const storedFilms = localStorage.getItem('rutube_films');

      if (storedCategories) {
        this.categories = JSON.parse(storedCategories);
      }

      if (storedFilms) {
        this.films = JSON.parse(storedFilms);
      }

      this.initialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  // Сохраняем данные в localStorage
  private saveData(): void {
    localStorage.setItem('rutube_categories', JSON.stringify(this.categories));
    localStorage.setItem('rutube_films', JSON.stringify(this.films));
  }

  public async addCategory(name: string, url: string, threshold: number = 0): Promise<void> {
    if (!this.initialized) await this.init();

    try {
      // Добавляем категорию в память
      this.categories[name] = { name, url, threshold };

      // Создаем пустой объект для фильмов этой категории
      if (!this.films[name]) {
        this.films[name] = {};
      }

      // Сохраняем данные
      this.saveData();
    } catch (error) {
      console.error('Failed to add category', error);
      throw error;
    }
  }

  public async getCategory(name: string): Promise<Category | null> {
    if (!this.initialized) await this.init();

    try {
      return this.categories[name] || null;
    } catch (error) {
      console.error('Failed to get category', error);
      throw error;
    }
  }

  public async getAllCategories(): Promise<Category[]> {
    if (!this.initialized) await this.init();

    try {
      return Object.values(this.categories);
    } catch (error) {
      console.error('Failed to get all categories', error);
      throw error;
    }
  }

  public async saveFilms(categoryName: string, films: Film[]): Promise<void> {
    if (!this.initialized) await this.init();

    try {
      // Создаем объект для фильмов этой категории, если его нет
      if (!this.films[categoryName]) {
        this.films[categoryName] = {};
      }

      // Добавляем фильмы
      for (const film of films) {
        this.films[categoryName][film.id] = film;
      }

      // Сохраняем данные
      this.saveData();
    } catch (error) {
      console.error('Failed to save films', error);
      throw error;
    }
  }

  public async getFilmsByCategory(categoryName: string): Promise<Film[]> {
    if (!this.initialized) await this.init();

    try {
      if (!this.films[categoryName]) {
        return [];
      }

      return Object.values(this.films[categoryName]);
    } catch (error) {
      console.error('Failed to get films by category', error);
      throw error;
    }
  }

  public async updateCategoryThreshold(name: string, threshold: number): Promise<void> {
    if (!this.initialized) await this.init();

    try {
      if (this.categories[name]) {
        this.categories[name].threshold = threshold;
        this.saveData();
      } else {
        throw new Error(`Category ${name} not found`);
      }
    } catch (error) {
      console.error('Failed to update category threshold', error);
      throw error;
    }
  }
}

// Singleton instance
export const database = new DatabaseService();
