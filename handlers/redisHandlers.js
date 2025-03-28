const redisClient = require("../services/redisClient");

const setDataToCache = async (key, value, ttl = null) => {
  if (ttl !== null) {
    await redisClient.set(
      key,
      value,
      "EX",
      ttl
    );
  }
  await redisClient.set(key, value);
};

const setExpiry = async (key, ttl) =>
  await redisClient.expire(key, ttl);

const getDataFromCache = async (key) =>
  await redisClient.get(key);

const deleteKey = async (key) =>
  await redisClient.del(key);

module.exports = { setDataToCache, getDataFromCache, setExpiry, deleteKey };
