import { database } from './database';
import { parser } from './parser';

type ProgressCallback = (progress: number) => void;

export class CatalogService {
  private initialized = false;

  public async init(): Promise<void> {
    if (this.initialized) return;

    await database.init();
    this.initialized = true;
  }

  public async addCategory(name: string, url: string, progressCallback?: ProgressCallback): Promise<void> {
    // Ensure database is initialized
    if (!this.initialized) await this.init();

    // Save category to database
    await database.addCategory(name, url);

    // Parse films from the playlist
    await this.parseFilms(name, url, progressCallback);
  }

  public async updateCategory(name: string, progressCallback?: ProgressCallback): Promise<void> {
    // Ensure database is initialized
    if (!this.initialized) await this.init();

    // Get category URL
    const category = await database.getCategory(name);
    if (!category) throw new Error(`Category ${name} not found`);

    // Parse films from the playlist
    await this.parseFilms(name, category.url, progressCallback);
  }

  private async parseFilms(categoryName: string, url: string, progressCallback?: ProgressCallback): Promise<void> {
    // Parse films from the playlist
    const films = await parser.parsePlaylist(url, progressCallback);

    // Save films to database
    await database.saveFilms(categoryName, films);
  }

  public async getFilmsByCategory(categoryName: string): Promise<any[]> {
    // Ensure database is initialized
    if (!this.initialized) await this.init();

    // Get films from database
    return database.getFilmsByCategory(categoryName);
  }

  public async getCategory(name: string): Promise<any> {
    // Ensure database is initialized
    if (!this.initialized) await this.init();

    // Get category from database
    return database.getCategory(name);
  }

  public async getAllCategories(): Promise<any[]> {
    // Ensure database is initialized
    if (!this.initialized) await this.init();

    // Get all categories from database
    return database.getAllCategories();
  }
}

// Singleton instance
export const catalog = new CatalogService();

