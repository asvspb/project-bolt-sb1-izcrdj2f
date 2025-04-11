import { ref } from 'vue';

export interface Category {
  id: number;
  name: string;
  url: string;
  threshold: number;
}

export interface Film {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
}

// Используем простой мок-сервис вместо SQL.js
class MockService {
  private categories = ref<Category[]>([]);
  private films = ref<Record<string, Film[]>>({});

  constructor() {
    // Загружаем данные из localStorage при инициализации
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedCategories = localStorage.getItem('rutube_categories');
      const storedFilms = localStorage.getItem('rutube_films');

      if (storedCategories) {
        this.categories.value = JSON.parse(storedCategories);
      }

      if (storedFilms) {
        this.films.value = JSON.parse(storedFilms);
      }
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('rutube_categories', JSON.stringify(this.categories.value));
      localStorage.setItem('rutube_films', JSON.stringify(this.films.value));
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
    }
  }

  // Методы для работы с категориями
  public getCategories(): Category[] {
    return this.categories.value;
  }

  public getCategory(id: number): Category | undefined {
    return this.categories.value.find(c => c.id === id);
  }

  public getCategoryByName(name: string): Category | undefined {
    return this.categories.value.find(c => c.name === name);
  }

  public addCategory(category: Omit<Category, 'id'>): Category {
    // Генерируем новый ID
    const newId = this.categories.value.length > 0
      ? Math.max(...this.categories.value.map(c => c.id)) + 1
      : 1;

    const newCategory: Category = {
      id: newId,
      ...category
    };

    this.categories.value.push(newCategory);
    this.saveToStorage();

    return newCategory;
  }

  public updateCategory(category: Category): void {
    const index = this.categories.value.findIndex(c => c.id === category.id);

    if (index !== -1) {
      this.categories.value[index] = { ...category };
      this.saveToStorage();
    }
  }

  public deleteCategory(id: number): void {
    this.categories.value = this.categories.value.filter(c => c.id !== id);
    this.saveToStorage();
  }

  // Методы для работы с фильмами
  public getFilmsByCategory(categoryName: string): Film[] {
    return this.films.value[categoryName] || [];
  }

  public addFilmsToCategory(categoryName: string, newFilms: Film[]): void {
    // Если категория не существует, создаем пустой массив
    if (!this.films.value[categoryName]) {
      this.films.value[categoryName] = [];
    }

    // Добавляем новые фильмы, заменяя существующие с тем же ID
    const existingFilms = this.films.value[categoryName];
    const updatedFilms = [...existingFilms];

    for (const film of newFilms) {
      const index = updatedFilms.findIndex(f => f.id === film.id);

      if (index !== -1) {
        updatedFilms[index] = film;
      } else {
        updatedFilms.push(film);
      }
    }

    this.films.value[categoryName] = updatedFilms;
    this.saveToStorage();
  }

  // Метод для генерации мок-фильмов
  public async generateMockFilms(categoryName: string, count: number = 10): Promise<Film[]> {
    const titles = [
      'Триллер с неожиданным финалом',
      'Тайна темного леса',
      'Последний день на Земле',
      'Загадка старого дома',
      'Незнакомец в поезде',
      'Исчезнувшая девушка',
      'Тень прошлого',
      'Секретный агент',
      'Ночь страха',
      'Последний свидетель'
    ];

    const descriptions = [
      'Захватывающий триллер о таинственных событиях в маленьком городке.',
      'Группа друзей отправляется в поход и сталкивается с необъяснимыми явлениями.',
      'Апокалиптическая история о последних днях человечества.',
      'Семья переезжает в старый дом и обнаруживает его мрачную историю.',
      'Главный герой знакомится с таинственным попутчиком, который меняет его жизнь.',
      'Детектив расследует таинственное исчезновение молодой женщины.',
      'Мужчина сталкивается с призраками своего прошлого.',
      'История о секретном агенте, выполняющем опасную миссию.',
      'Группа людей оказывается запертой в заброшенном здании на ночь.',
      'Последний свидетель преступления пытается раскрыть правду.'
    ];

    // Изображения для фильмов - используем реальные изображения
    const thumbnails = [
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&h=280&fit=crop',
      'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=500&h=280&fit=crop',
      'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=500&h=280&fit=crop',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=500&h=280&fit=crop',
      'https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?w=500&h=280&fit=crop',
      'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=500&h=280&fit=crop',
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&h=280&fit=crop',
      'https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?w=500&h=280&fit=crop',
      'https://images.unsplash.com/photo-1559583109-3e7968736000?w=500&h=280&fit=crop',
      'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&h=280&fit=crop'
    ];

    const films: Film[] = [];

    for (let i = 0; i < Math.min(count, titles.length); i++) {
      // Симулируем задержку сети
      await new Promise(resolve => setTimeout(resolve, 100));

      films.push({
        id: `film-${i}`,
        title: titles[i],
        description: descriptions[i],
        thumbnail: thumbnails[i] || `https://via.placeholder.com/500x280/2a2a2a/aaa?text=Фильм+${i+1}`,
        url: `https://rutube.ru/video/mock-${i}`
      });
    }

    // Сохраняем сгенерированные фильмы
    this.addFilmsToCategory(categoryName, films);

    return films;
  }
}

// Экспортируем синглтон
export const mockService = new MockService();
