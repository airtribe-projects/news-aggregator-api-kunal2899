const express = require('express');
const app = express();
require('dotenv').config();

const usersRouter = require('./routes/usersRoutes');
const newsRouter = require('./routes/newsRoutes');
const redisClient = require('./services/redisClient');

const PORT = process.env.PORT || 3000;

app.use('/v1/users', usersRouter);
app.use('/v1/news', newsRouter);

// Redis connection
redisClient.connect();

app.listen(PORT, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${PORT} 🚀`);
});

module.exports = app;