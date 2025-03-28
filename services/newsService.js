const axios = require('axios');
const { getAggregatedPreferencesKey } = require("../utils/news");
const {
  getDataFromCache,
  setDataToCache,
} = require("../handlers/redisHandlers");

const NEWS_API_URL = process.env.NEWS_API_URL || "https://newsapi.org/v2";
const NEWS_API_KEY = process.env.NEWS_API_KEY;

const getOrRefreshNewsCache = async preferences => {
  const preferencesCacheKey = `${getAggregatedPreferencesKey(
    preferences
  )}-news`;

  const cachedPreferencesBasedNews = await getDataFromCache(
    preferencesCacheKey
  );
  if (cachedPreferencesBasedNews) {
    console.log("Returning from preferences based news cache!");
    let preferencesNewsJSON;
    try {
      preferencesNewsJSON = JSON.parse(cachedPreferencesBasedNews);
      return preferencesNewsJSON;
    } catch (err) {
      console.log("Error in parsing preferences based news JSON --- ", err);
    }
  }

  const queryParams = new URLSearchParams({
    q: preferences.join(" OR "),
    pageSize: 50,
    apiKey: NEWS_API_KEY,
    language: "en",
    sortBy: "relevancy",
  });

  const {
    data: { articles: news },
  } = await axios.get(`${NEWS_API_URL}/everything?${queryParams.toString()}`);
  
  const TTL = 24 * 60 * 60; // 1day
  await setDataToCache(preferencesCacheKey, JSON.stringify(news), TTL);

  return news;
}

module.exports = { getOrRefreshNewsCache };
