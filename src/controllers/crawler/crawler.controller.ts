import { Controller, Get } from '@nestjs/common';
import axios from 'axios';
import cheerio from 'cheerio';

@Controller('crawler')
export class CrawlerController {
  @Get()
  async crawlApps() {
    const MAX_APPS = 20;

    const appUrls = ['https://apps.apple.com/us/app/google-chrome/id535886823'];
    const appNames = new Set();

    while (appUrls.length > 0 && appNames.size < MAX_APPS) {
      const appUrl = appUrls.shift();
      const relatedAppUrls = await this.crawlApp(appUrl);

      for (const relatedAppUrl of relatedAppUrls) {
        if (!appNames.has(relatedAppUrl)) {
          appNames.add(relatedAppUrl);
          appUrls.push(relatedAppUrl);

          if (appNames.size >= MAX_APPS) {
            break;
          }
        }
      }
    }

    return Array.from(appNames);
  }

  async crawlApp(appUrl: string) {
    const relatedAppUrls = [];

    try {
      const response = await axios.get(appUrl);
      const $ = cheerio.load(response.data);

      const alsoLikeSection = $('section.section--bordered h2:contains("You Might Also Like")').parent().parent();
  
      const relatedApps = alsoLikeSection.find('a[href]');

      relatedApps.each((i, el) => {
        const relatedAppUrl = $(el).attr('href');
        relatedAppUrls.push(relatedAppUrl);
      });
    } catch (error) {
      console.error(error);
    }

    return relatedAppUrls;
  }
}
