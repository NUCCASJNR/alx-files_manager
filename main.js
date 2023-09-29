import redisClient from './utils/redis';

(async () => {
  console.log(redisClient.isAlive());
  console.log(await redisClient.get('myKey'));
  await redisClient.set('myKey', 12, 5);
  await redisClient.set('NewKey', 12, 10);
  await redisClient.del('NewKey');
  console.log(await redisClient.get('myKey'));

  setTimeout(async () => {
    console.log(await redisClient.get('myKey'));
  }, 1000*10)
  setTimeout(async () => {
    console.log(await redisClient.get('NewKey'));
  }, 1000*3)
})();
