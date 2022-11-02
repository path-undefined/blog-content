import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ARTICLE_DIRECTORY = 'articles';
const ARTICLE_FILENAME_REGEX = /^article-\d{4}-\d{2}-\d{2}.json$/;
const ARTICLES_PAGE_CONFIG = 'pages/articles.json';

(function () {
  console.log('Generate article list pages...');

  const allArticles = [];

  for (let filename of readdirSync(ARTICLE_DIRECTORY).sort()) {
    if (!filename.match(ARTICLE_FILENAME_REGEX)) {
      continue;
    }

    const articleConfigFileContentString = readFileSync(
      join('.', ARTICLE_DIRECTORY, filename),
      { encoding: 'utf-8' },
    );
    const article = JSON.parse(articleConfigFileContentString);

    allArticles.push({
      title: article.title,
      date: article.time.date,
      thumbnailImageUrl: article.thumbnailImageUrl,
      excerpt: article.excerpt,
      itemUrl: {
        pageName: 'article',
        queries: {
          articleConfigPath: `/${ARTICLE_DIRECTORY}/${filename}`,
        },
      },
    });
  }

  const articlesPageConfigFileContentString = readFileSync(
    ARTICLES_PAGE_CONFIG,
    { encoding: 'utf-8' },
  );
  const articlesPage = JSON.parse(articlesPageConfigFileContentString);

  let fileIndex = 0;
  let articlesToWrite = [];
  while (allArticles.length > 0) {
    articlesToWrite.push(allArticles.pop());

    if (
      articlesToWrite.length === articlesPage.filePagination.itemsPerFile ||
      allArticles.length === 0
    ) {
      const fileNamePrefix = articlesPage.filePagination.fileNamePrefix;
      const fileNameIndex = fileIndex.toString().padStart(articlesPage.filePagination.fileNameIndexDigits, '0');
      const fileNameExtension = articlesPage.filePagination.fileNameExtension;

      const filePath = join('.', `${fileNamePrefix}${fileNameIndex}${fileNameExtension}`);

      writeFileSync(
        join('.', `${fileNamePrefix}${fileNameIndex}${fileNameExtension}`),
        JSON.stringify({ items: articlesToWrite }, null, 2),
        { encoding: 'utf-8' },
      );

      console.log(`  wrote file: ${filePath}`);

      fileIndex++;
      articlesToWrite = [];
    }
  }
})();