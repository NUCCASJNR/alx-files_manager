const thumbnailQueue = require('./thumb_nail');
// Add a job to the queue
thumbnailQueue.add({
  inputPath: '/home/alareef/Pictures/hope.jpg',
  outputPath: 'hope.jpg',
  width: 360,
  height: 360,
});
