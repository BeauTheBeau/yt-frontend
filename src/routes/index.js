/**
 * @file routes/index.js
 * @description This file handles all user-facing routes, such as the home, video and search pages.
 */

const express = require('express');
const router = express.Router();

const config = require('../../config.json')
const fs = require('fs');
const youtubedl = require("youtube-dl-exec");
const Fuse = require('fuse.js');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {res, title: `${res.locals.site.title} | Home` });
});



module.exports = router;
