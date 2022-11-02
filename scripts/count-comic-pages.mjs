import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const COMIC_DIRECTORIES = [
  'comics/the-adventure-of-hami',
];

(function () {
  console.log('Count comic pages...');

  for (const comicDirectory of COMIC_DIRECTORIES) {
    const comicConfigPath = join(comicDirectory, 'index.json');
    const comicConfigContent = readFileSync(comicConfigPath, { encoding: 'utf-8' });
    const comicConfigObject = JSON.parse(comicConfigContent);

    const fileNames = readdirSync(comicDirectory);
    const batchNumbers = fileNames
      .filter((fileName) => fileName.match(/\d\d\d\d\d\.json/))
      .map((fileName) => Number(fileName.substring(0, 3)));

    const maxBatchNumber = Math.max(batchNumbers);

    const paddingLength = comicConfigObject.filePagination.fileNameIndexDigits;
    const comicsPerBatch = comicConfigObject.filePagination.itemsPerFile;

    const lastFilePath = join(comicDirectory, `${maxBatchNumber.toString().padStart(paddingLength, '0')}.json`);
    const lastFileContent = readFileSync(lastFilePath, { encoding: 'utf-8' });
    const lastFileObject = JSON.parse(lastFileContent);
    const lastBatchNumber = lastFileObject.pages.length;

    const totalPageNumber = maxBatchNumber * comicsPerBatch + lastBatchNumber;

    comicConfigObject.filePagination.totalItemNumber = totalPageNumber;

    writeFileSync(comicConfigPath, JSON.stringify(comicConfigObject, null, 2), { encoding: 'utf-8' });

    console.log(`  result: ${totalPageNumber}`);
  }
})();