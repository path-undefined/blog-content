const { readdirSync, readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const ARTICLES_DIRECTORY = './articles/';
const ARTICLE_PREFIX = 'article-';
const TARGET_FILE = './destinations/visited.json';

const destinations = { destinations: [] };

for (let filename of readdirSync(ARTICLES_DIRECTORY)) {
  if (!filename.startsWith(ARTICLE_PREFIX)) {
    continue;
  }

  const fileContentString = readFileSync(
    join(ARTICLES_DIRECTORY, filename),
    { encoding: 'utf-8'},
  );
  const fileContentObject = JSON.parse(fileContentString);

  if (!('coord' in fileContentObject.location)) {
    continue;
  }

  destinations.destinations.push({
    ...fileContentObject.location,
    ...fileContentObject.time,
  });
}

writeFileSync(
  TARGET_FILE,
  JSON.stringify(destinations),
  { encoding: 'utf-8' },
);
