const express = require('express');
const { registerUser, loginUser, getUserPreferences, updateUserPreferences } = require('../controllers/usersController');
const { validateUser } = require('../middlewares/validateUser');
const isAuthenticated = require('../middlewares/isAuthenticated');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Auth routes
router.post('/signup', validateUser(), registerUser);
router.post('/login', validateUser(['email', 'password']), loginUser);

// Secured routes
// Preferences routes
router.get('/preferences', isAuthenticated(), getUserPreferences);
router.put('/preferences', isAuthenticated(), updateUserPreferences);

module.exports = router;