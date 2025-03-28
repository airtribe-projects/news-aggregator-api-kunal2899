const express = require('express');
const isAuthenticated = require('../middlewares/isAuthenticated');
const { fetchNews, fetchNewsByKeywords } = require('../controllers/newsController');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Secured routes
router.get('/', isAuthenticated(), fetchNews);
router.get('/search', isAuthenticated(), fetchNewsByKeywords);

module.exports = router;