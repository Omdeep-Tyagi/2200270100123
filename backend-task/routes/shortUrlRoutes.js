const express = require('express');
const router = express.Router();
const { createShortUrl, redirectToOriginal, getStats } = require('../controllers/urlController');

router.post('/', createShortUrl); // POST /shorturls
router.get('/r/:shortcode', redirectToOriginal); // Redirection route
router.get('/:shortcode', getStats); // Analytics

module.exports = router;
