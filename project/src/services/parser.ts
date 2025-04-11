import * as cheerio from 'cheerio';

type Film = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
};

type ProgressCallback = (progress: number) => void;

export class ParserService {
  public async parsePlaylist(url: string, progressCallback?: ProgressCallback): Promise<Film[]> {
    try {
      // In a real implementation, this would fetch the HTML from the URL
      // For now, we'll return mock data
      return this.getMockFilms(progressCallback);
    } catch (error) {
      console.error('Failed to parse playlist', error);
      throw error;
    }
  }

  private async getMockFilms(progressCallback?: ProgressCallback): Promise<Film[]> {
    // Симулируем задержку парсинга
    const films: Film[] = [];
    const totalFilms = 10;

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

    for (let i = 0; i < totalFilms; i++) {
      // Симулируем задержку сети
      await new Promise(resolve => setTimeout(resolve, 200));

      films.push({
        id: `film-${i}`,
        title: titles[i],
        description: descriptions[i],
        thumbnail: `https://via.placeholder.com/300x200?text=Фильм+${i+1}`,
        url: `https://rutube.ru/video/mock-${i}`
      });

      if (progressCallback) {
        progressCallback((i + 1) / totalFilms * 100);
      }
    }

    return films;
  }

  // In a real implementation, this would use Cheerio to parse the HTML
  private parseHtml(html: string): Film[] {
    const $ = cheerio.load(html);
    const films: Film[] = [];

    // Example parsing logic (would need to be adapted for actual Rutube HTML structure)
    $('.video-item').each((i, el) => {
      const id = $(el).attr('data-id') || '';
      const title = $(el).find('.video-title').text();
      const description = $(el).find('.video-description').text();
      const thumbnail = $(el).find('img').attr('src') || '';
      const url = $(el).find('a').attr('href') || '';

      films.push({
        id,
        title,
        description,
        thumbnail,
        url
      });
    });

    return films;
  }
}

// Singleton instance
export const parser = new ParserService();