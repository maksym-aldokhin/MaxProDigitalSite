import newsData from '../data/news.json';

export default defineEventHandler(() => {
  return newsData;
});