const { map, toLower } = require("lodash");

const getAggregatedPreferencesKey = (preferences) =>
  map(preferences, toLower).sort().join("-");

module.exports = { getAggregatedPreferencesKey };
