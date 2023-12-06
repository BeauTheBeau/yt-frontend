const express = require('express');
const router = express.Router();

const config = require('../config.json')

/* GET home page. */
router.get('/', function(req, res, next) {

    // Get all videos in the videos/ directory
    const fs = require('fs');
    const videos = fs.readdirSync(config.storage.paths.videos);
    let videoData = [];

    videos.forEach(video => {
        const metadata = require(`../data/videos/${video}/metadata.json`);
        if (!metadata.downloaded) fs.unlinkSync(`./data/videos/${video}/metadata.json`);

        videoData.push(metadata);
    });

    res.render('index', {res, title: `${res.locals.site.title} | Home`, videos: videoData });
});

/* GET watch page - this is where the user can watch videos */
router.get('/watch', function(req, res, next) {

    // Parameters
    // - ?v = the video URL / ID

    // If the v param is specified
    if (req.query.v) {

        // Get the video ID
        let videoId = req.query.v;
        try {
            const metadata = require(`../data/videos/${videoId}/metadata.json`);

            if (!metadata.downloaded) return res.redirect(`/newVideo?v=${videoId}`);
            else return res.render('watch', {title: `${res.locals.site.title} | Watch`, res, video: metadata});

        } catch (e) {
            return res.send('Invalid video URL');
        }
    }
})

/* GET new video page - this is where the user can request new videos be downloaded */
router.get('/newVideo', function(req, res, next) {

    // Parameters
    // - ?v = the video URL / ID

    if (req.query.v) {

        // Get the video ID
        let videoId = req.query.v;
        try {

            const metadata = require(`../data/metadata/${videoId}/metadata.json`);

            if (metadata.downloaded) return res.redirect(`/video/${videoId}`);
            else return res.render('newVideo', { title: `${res.locals.site.title} | New Video`, res, video: metadata });

        } catch (e) {
            return res.send('Invalid video URL');
        }
    } else {
        res.render('newVideo', { title: `${res.locals.site.title} | New Video`, res, video: req.query.v });
    }
});

module.exports = router;
