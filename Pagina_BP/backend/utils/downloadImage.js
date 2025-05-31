import axios from 'axios';
import fs from 'fs';
import path from 'path';

export async function downloadImage(imageUrl, destFolder) {
  try {
    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'stream',
    });

    const ext = path.extname(imageUrl).split('?')[0] || '.jpg';
    const fileName = 'image-' + Date.now() + ext;
    const filePath = path.join(destFolder, fileName);

    await new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);
      let error = null;
      writer.on('error', err => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on('close', () => {
        if (!error) {
          resolve();
        }
      });
    });

    return fileName;
  } catch (error) {
    throw new Error('Error downloading image: ' + error.message);
  }
}
