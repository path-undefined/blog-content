import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export function comicPageCounter({ comicDirectories, comicsPerBatch, paddingLength }) {
  for (const comicDirectory of comicDirectories) {
    const fileNames = readdirSync(comicDirectory);
    const batchNumbers = fileNames
      .filter((fileName) => fileName.match(/\d\d\d\.json/))
      .map((fileName) => Number(fileName.substring(0, 3)));

    const maxBatchNumber = Math.max(batchNumbers);

    const lastFilePath = join(comicDirectory, `${maxBatchNumber.toString().padStart(paddingLength, '0')}.json`);
    const lastFileContent = readFileSync(lastFilePath, { encoding: 'utf-8' });
    const lastFileObject = JSON.parse(lastFileContent);
    const lastBatchNumber = lastFileObject.pages.length;

    const totalPageNumber = maxBatchNumber * comicsPerBatch + lastBatchNumber;

    const comicConfigPath = join(comicDirectory, 'index.json');
    const comicConfigContent = readFileSync(comicConfigPath, { encoding: 'utf-8' });
    const comicConfigObject = JSON.parse(comicConfigContent);

    comicConfigObject.totalPageNumber = totalPageNumber;

    writeFileSync(comicConfigPath, JSON.stringify(comicConfigObject, null, 2), { encoding: 'utf-8' });
  }
}