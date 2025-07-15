const Url = require('../models/Url');
const moment = require('moment');
const geoip = require('geoip-lite');
const generateShortcode = require('../utils/generateShortcode'); //see it
const { log } = require('../../logging-middleware'); // import your custom logger


exports.createShortUrl = async (req, res) => {
  try {
    const { url, validity = 30, shortcode } = req.body;

    const code = shortcode || generateShortcode();

    // Check if shortcode already exists
    const existing = await Url.findOne({ shortcode: code });
    if (existing) {
      log('backend', 'error', 'handler', `Shortcode "${code}" already exists`);
      return res.status(400).json({ message: 'Shortcode already in use' });
    }

    const expiry = moment().add(validity, 'minutes').toDate();

    const newUrl = new Url({
      originalUrl: url,
      shortcode: code,
      expiry
    });

    await newUrl.save();
    log('backend', 'info', 'repository', `Short URL created with code "${code}"`);

    return res.status(201).json({
      shortLink: `http://localhost:3000/shorturls/r/${code}`,
      expiry: expiry.toISOString()
    });
  } catch (err) {
    log('backend', 'fatal', 'service', `Failed to create short URL: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.redirectToOriginal = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const record = await Url.findOne({ shortcode });

    if (!record) {
      log('backend', 'warn', 'repository', `Shortcode "${shortcode}" not found`);
      return res.status(404).json({ message: 'Shortcode not found' });
    }

    // Check for expiry only if expiresAt is defined
    if (record.expiresAt && new Date() > record.expiresAt) {
      log('backend', 'info', 'handler', `Shortcode "${shortcode}" has expired`);
      return res.status(410).json({ message: 'Short link expired' });
    }

    const location = geoip.lookup(req.ip)?.country || 'unknown';
    const referrer = req.headers['referer'] || 'direct';

    // Ensure clicks array exists
    if (!Array.isArray(record.clicks)) {
      record.clicks = [];
    }

    record.clicks.push({
      timestamp: new Date(),
      referrer,
      location,
    });

    await record.save();
    log('backend', 'info', 'service', `Redirected using shortcode "${shortcode}"`);

    return res.redirect(record.url); //Ensure the field is 'url'
  } catch (err) {
    log('backend', 'fatal', 'handler', `Redirection failed: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const record = await Url.findOne({ shortcode });

    if (!record) {
      log('backend', 'warn', 'repository', `Stats requested for missing shortcode "${shortcode}"`);
      return res.status(404).json({ message: 'Shortcode not found' });
    }

    log('backend', 'debug', 'controller', `Stats retrieved for shortcode "${shortcode}"`);

    return res.status(200).json({
      originalUrl: record.originalUrl,
      createdAt: record.createdAt,
      expiry: record.expiry,
      totalClicks: record.clicks.length,
      clicks: record.clicks
    });
  } catch (err) {
    log('backend', 'fatal', 'controller', `Failed to fetch stats: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


