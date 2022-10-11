import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export function destinationsIndexing({ articleDirectory, articlePrefix, targetFile }) {
  const destinations = { destinations: [] };

  for (let filename of readdirSync(articleDirectory)) {
    if (!filename.startsWith(articlePrefix)) {
      continue;
    }

    const fileContentString = readFileSync(
      join(articleDirectory, filename),
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
    targetFile,
    JSON.stringify(destinations, null, 2),
    { encoding: 'utf-8' },
  );
}
