const { createClient } = require("redis");

const redisClient = createClient()
  .on("ready", () => console.log("Redis connected!"))
  .on("error", () => console.log("Error in connecting to redis!"));

module.exports = redisClient;