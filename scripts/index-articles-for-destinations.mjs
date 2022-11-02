import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ARTICLE_DIRECTORY = 'articles';
const ARTICLE_FILENAME_REGEX = /^article-\d{4}-\d{2}-\d{2}.json$/;
const TARGET_FILE = 'destinations/visited.json';

(function () {
  console.log('index destinations...');

  const destinations = { destinations: [] };

  for (let filename of readdirSync(ARTICLE_DIRECTORY)) {
    if (!filename.match(ARTICLE_FILENAME_REGEX)) {
      continue;
    }

    const fileContentString = readFileSync(
      join(ARTICLE_DIRECTORY, filename),
      { encoding: 'utf-8' },
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
    JSON.stringify(destinations, null, 2),
    { encoding: 'utf-8' },
  );

  console.log(`  wrote file: ${TARGET_FILE}`);
})();
