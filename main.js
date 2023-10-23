const path = require('path');
const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

function isWavFile(wavFilename) {
  const ext = path.extname(wavFilename);
  return ext === '.wav';
}

function convertWavToMp3(wavFilename) {
  return new Promise((resolve, reject) => {
    if (!isWavFile(wavFilename)) {
      throw new Error(`Not a wav file`);
    }
    const outputFile = wavFilename.replace('.wav', '.mp3').replace('source', 'result');
    ffmpeg({
      source: wavFilename,
    })
      .on('error', err => {
        reject(err);
      })
      .on('end', () => {
        resolve(outputFile);
      })
      .save(outputFile);
  });
}

const main = async () => {
  const fullPath = path.join(__dirname, 'source');
  const fileList = await fs.readdirSync(fullPath);

  fileList.forEach(async item => {
    const res = await convertWavToMp3(path.join(fullPath, item));
    console.log(res);
  });
};
main();
