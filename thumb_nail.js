// thumbnailWorker.js
const Queue = require('bull');
const sharp = require('sharp');

// Create a Bull queue
const thumbnailQueue = new Queue('thumbnail', {
  redis: { port: 6379, host: 'localhost' }, // Configure your Redis server
});

// Define the thumbnail job processing
thumbnailQueue.process(async (job) => {
  const { inputPath, outputPath, width, height } = job.data;

  // Generate the thumbnail using sharp
  await sharp(inputPath)
    .resize(width, height)
    .toFile(outputPath);

  return 'Thumbnail created successfully!';
});

// Handle job completion
thumbnailQueue.on('completed', (job, result) => {
  console.log(result);
});

// Handle job failures
thumbnailQueue.on('failed', (job, err) => {
  console.error('Thumbnail job failed:', err);
});


module.exports = thumbnailQueue;
