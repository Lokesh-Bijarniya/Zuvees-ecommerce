const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Fan images from Unsplash
const fanImages = [
  'https://unsplash.com/photos/hzgs56Ze49s/download?force=true',
  'https://unsplash.com/photos/bFFe5E7yRdc/download?force=true',
  'https://unsplash.com/photos/ebHqvQ38x0M/download?force=true',
  'https://unsplash.com/photos/e12EkMYv44U/download?force=true',
];

// AC images from Unsplash
const acImages = [
  'https://unsplash.com/photos/QoFTD3kG1QM/download?force=true',
  'https://unsplash.com/photos/ZsdIrTYjspg/download?force=true',
  'https://unsplash.com/photos/DzJMgIV6wG0/download?force=true',
  'https://unsplash.com/photos/GNywSmJYu3c/download?force=true',
  'https://unsplash.com/photos/GPVQqep5QNw/download?force=true',
  'https://unsplash.com/photos/gDR-q7mXkmo/download?force=true',
];

const destFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(destFolder)) {
  fs.mkdirSync(destFolder);
}

async function downloadImages() {
  let i = 1;
  for (const url of fanImages) {
    const filename = `fan${i}.jpg`;
    const destPath = path.join(destFolder, filename);
    try {
      const response = await axios({
        url,
        responseType: 'arraybuffer',
        headers: { 'Accept': 'image/jpeg,image/png,image/webp' },
      });
      fs.writeFileSync(destPath, response.data);
      console.log(`Downloaded: ${filename}`);
    } catch (err) {
      console.warn(`Failed to download fan image ${url}: ${err.message}`);
    }
    i++;
  }
  i = 1;
  for (const url of acImages) {
    const filename = `ac${i}.jpg`;
    const destPath = path.join(destFolder, filename);
    try {
      const response = await axios({
        url,
        responseType: 'arraybuffer',
        headers: { 'Accept': 'image/jpeg,image/png,image/webp' },
      });
      fs.writeFileSync(destPath, response.data);
      console.log(`Downloaded: ${filename}`);
    } catch (err) {
      console.warn(`Failed to download AC image ${url}: ${err.message}`);
    }
    i++;
  }
  console.log('Download complete!');
}

downloadImages();
