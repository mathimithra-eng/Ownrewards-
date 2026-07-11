const https = require('https');
const fs = require('fs');
const path = require('path');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  try {
    await download('https://upload.wikimedia.org/wikipedia/commons/c/cc/Burger_King_2020.svg', path.join(__dirname, 'frontend/public/logos/burgerking.svg'));
    console.log('Burger King logo downloaded');
    await download('https://upload.wikimedia.org/wikipedia/commons/8/87/Lifestyle_Stores_logo.svg', path.join(__dirname, 'frontend/public/logos/lifestyle.svg'));
    console.log('Lifestyle logo downloaded');
  } catch (err) {
    console.error('Error downloading logos:', err);
  }
}
main();
