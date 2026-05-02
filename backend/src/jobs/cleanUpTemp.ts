import path from 'path';
import fs from 'fs';

async function cleanUpTemp() {
  const tempPath = path.join(__dirname, '../../temp');

  try {
    const files = await fs.promises.readdir(tempPath);

    files.forEach(async (file) => {
      const filePath = path.join(tempPath, file);
      await fs.promises.unlink(filePath);
    });
  } catch (error) {
    console.log(error);
  }
}

export default cleanUpTemp;
