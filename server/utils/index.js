const connectDB = require('./connectDB');
const corsConfig = require('./corsConfig');
const instaPassport = require('./instaPassport');
const sendEmail = require('./mailer');
const passport = require('./passport');

module.exports = { connectDB, corsConfig, instaPassport, sendEmail, passport };