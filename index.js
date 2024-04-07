const util = require('node:util');
const fs = require('node:fs');

const exec = util.promisify(require('node:child_process').exec);
const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

const commit_msg = 'important code changes';
const file_path = './assets/spam_file.txt';

async function processFile(date) {
  try {
    // Read file
    let data = await readFileAsync(file_path, 'utf8');

    // Modify data
    const newData = data.trim() + '\n' + commit_msg;

    // Write modified data back to file
    await writeFileAsync(file_path, newData);

    // Add file to Git
    await exec(`git add ${file_path}`);

    // Commit changes with specified date
    await exec(`git commit -m "${commit_msg}" --date="${date.toUTCString()}"`);
  } catch (error) {
    console.error('Error processing file:', error);
  }
}

async function main() {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 365);
  const endDate = new Date();

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const shouldRun = Math.floor(Math.random() * 100) <= 65; // 65% chance of running
    if (shouldRun) {
      await processFile(currentDate);
    } else {
      console.log('Skipping commit for', currentDate.toDateString());
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
}

main();
