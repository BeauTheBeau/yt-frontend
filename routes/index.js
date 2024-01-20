const express = require('express');
const router = express.Router();

const config = require('../config.json')
const fs = require('fs');
const youtubedl = require("youtube-dl-exec");
const Fuse = require('fuse.js');

/* GET home page. */
router.get('/', function (req, res, next) {

    // Get all videos in the videos/ directory
    const fs = require('fs');
    const videos = fs.readdirSync(config.storage.paths.videos);
    let videoData = [];

    videos.forEach(video => {
        const metadata = require(`../data/videos/${video}/metadata.json`);
        if (!metadata.downloaded) fs.unlinkSync(`./data/videos/${video}/metadata.json`);

        videoData.push(metadata);
    });

    res.render('index', {res, title: `${res.locals.site.title} | Home`, videos: videoData});
});

/* GET watch page - this is where the user can watch videos */
router.get('/watch', function (req, res, next) {

    // Parameters
    // - ?v = the video URL / ID

    // If the v param is specified
    if (req.query.v) {

        // Get the video ID
        let videoId = req.query.v;
        try {
            const metadata = require(`../data/videos/${videoId}/metadata.json`);
            const domain = config.server.domain;

            if (!metadata.downloaded) return res.redirect(`/newVideo?v=${videoId}`);
            else return res.render('watch', {
                title: `${metadata.title} | ${res.locals.site.title}`,
                res,
                video: metadata,
                domain
            });

        } catch (e) {
            return res.send('Invalid video URL');
        }
    }
})

/* GET new video page - this is where the user can request new videos be downloaded */
router.get('/newVideo', function (req, res, next) {

    // Parameters
    // - ?v = the video URL / ID

    if (req.query.v) {

        // Get the video ID
        let videoId = req.query.v;
        try {

            const metadata = require(`../data/metadata/${videoId}/metadata.json`);

            if (metadata.downloaded) return res.redirect(`/video/${videoId}`);
            else return res.render('newVideo', {title: `${res.locals.site.title} | New Video`, res, video: metadata});

        } catch (e) {
            return res.send('Invalid video URL');
        }
    } else {
        res.render('newVideo', {title: `${res.locals.site.title} | New Video`, res, video: req.query.v});
    }
});

/* GET /search */
router.get('/search', async function (req, res, next) {

    // Parameters
    // - ?q = the search query
    // - ?am = the amount of results to return, defaults to 15, max is 50

    // If the q param is specified
    if (req.query.q) {

        // Get the search query
        let searchQuery = req.query.q;
        let searchAm = req.query.am || 15;

        if (searchAm > 50) searchAm = 50;

        try {

            // For each video in videos/
            const videos = fs.readdirSync(config.storage.paths.videos);
            let videoData = [];

            videos.forEach(video => {
                const metadata = require(`../data/videos/${video}/metadata.json`);
                if (!metadata.downloaded) fs.unlinkSync(`./data/videos/${video}/metadata.json`);

                videoData.push(metadata);
            });

            // Filter the videos based on the search query
            const options = {
                includeScore: true,
                keys: ['title', 'description', 'channel']
            };

            const fuse = new Fuse(videoData, options);
            const localVideos = fuse.search(searchQuery);

            // Search YouTube
            const ytVideos = await youtubedl(`ytsearch${searchAm}:${searchQuery}`, {
                dumpSingleJson: true,
                noWarnings: true,
                noCallHome: true,
                preferFreeFormats: false,
                youtubeSkipDashManifest: true,
                referer: 'https://screw.big.tech/',
                geoBypass: true,
                noCheckCertificate: true,
                output: `${config.storage.paths.metadata}/metadata.json`
            });

            // Render the search results
            res.render('search', {
                title: `${res.locals.site.title} | Search`,
                res,
                localVideos,
                ytVideos: ytVideos.entries,
                query: searchQuery
            });

        } catch (e) {
            console.log(e);
            return res.send('Invalid search query');
        }
    }

});

module.exports = router;
