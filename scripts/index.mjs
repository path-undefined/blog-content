import { comicPageCounter } from './comic-page-counter/index.mjs';
import { destinationsIndexing } from './destinations-indexing/index.mjs';

destinationsIndexing({
  articleDirectory: './articles',
  articlePrefix: 'article-',
  targetFile: './destinations/visitied.json',
});

comicPageCounter({
  comicDirectories: [
    './comics/the-adventure-of-hami',
  ],
  comicsPerBatch: 100,
  paddingLength: 5,
});