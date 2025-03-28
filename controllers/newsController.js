const axios = require("axios");
const jwt = require("jsonwebtoken");
const { getUserByEmail } = require("../db/dbController");
const { getOrRefreshNewsCache } = require("../services/newsService");
const { getDataFromCache } = require("../handlers/redisHandlers");

const fetchNews = async (req, res) => {
  try {
    const token = req.token;
    const decodedToken = jwt.decode(token);
    const user = getUserByEmail(decodedToken.email);
    // Fallback value for preferences is needed as `q` is required parameter
    const preferences = user.preferences.length
      ? user.preferences
      : ["Tech", "Sports", "International"];
    if (!user.preferences.length) {
      console.warn(
        "Warning: In newsController.fetchNews - User hasn't set any preferences, fetching news for some trending topics like Tech, Sports, International!"
      );
    }
    const userCacheKey = `user-${user.id}-news`;
    const cachedUserNews = await getDataFromCache(userCacheKey);
    if (cachedUserNews) {
      console.log("Returning from user news cache!");
      let userNewsJSON;
      try {
        userNewsJSON = JSON.parse(cachedUserNews);
        return res.status(200).send({ success: true, news: userNewsJSON });
      } catch (err) {
        console.log("Error in parsing user news JSON --- ", err);
      }
    }
    const news = await getOrRefreshNewsCache(preferences);
    const TTL = 24 * 60 * 60; // 1day
    await setDataToCache(userCacheKey, JSON.stringify(news), TTL);
    res.status(200).send({ success: true, news });
  } catch (error) {
    console.error("Error in newsController.fetchNews --- ", error);
    res.status(400).send({ message: "Something went wrong!" });
  }
};

const fetchNewsByKeywords = async (req, res) => {
  try {
    const { keywords } = req.query;
    if (!keywords) {
      throw new Error('Pass atleast one keyword in `keywords` query param to get results!');
    }
    const preferences = keywords.split(',');
    const news = await getOrRefreshNewsCache(preferences);
    res.status(200).send({ success: true, news });
  } catch (error) {
    console.error("Error in newsController.fetchNewsByKeywords --- ", error);
    res.status(400).send({ message: "Something went wrong!" });
  }
};

module.exports = { fetchNews, fetchNewsByKeywords };
