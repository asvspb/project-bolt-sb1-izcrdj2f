export class MenuService {
  private categories: string[] = [];
  private activeCategory: string = '';

  constructor() {
    // Load categories from localStorage if available
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const storedCategories = localStorage.getItem('rutubeParserCategories');
    if (storedCategories) {
      try {
        this.categories = JSON.parse(storedCategories);
      } catch (e) {
        console.error('Failed to parse stored categories', e);
        this.categories = [];
      }
    }
  }

  private saveToStorage() {
    localStorage.setItem('rutubeParserCategories', JSON.stringify(this.categories));
  }

  public getCategories(): string[] {
    return [...this.categories];
  }

  public getActiveCategory(): string {
    return this.activeCategory;
  }

  public setActiveCategory(category: string): void {
    if (this.categories.includes(category)) {
      this.activeCategory = category;
    }
  }

  public addCategory(category: string): void {
    if (!this.categories.includes(category)) {
      this.categories.push(category);
      this.saveToStorage();
      
      // If this is the first category, make it active
      if (this.categories.length === 1) {
        this.activeCategory = category;
      }
    }
  }

  public removeCategory(category: string): void {
    const index = this.categories.indexOf(category);
    if (index !== -1) {
      this.categories.splice(index, 1);
      this.saveToStorage();
      
      // If the active category was removed, set a new active category
      if (this.activeCategory === category) {
        this.activeCategory = this.categories.length > 0 ? this.categories[0] : '';
      }
    }
  }
}

// Singleton instance
export const menu = new MenuService();