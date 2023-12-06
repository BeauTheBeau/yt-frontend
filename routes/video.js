const express = require('express');
const router = express.Router();
const fs = require('fs');

const youtubedl = require('youtube-dl-exec');
const config = require('../config.json');

async function checkDir(dir, mkdir = true) {
    if (mkdir) if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    else return fs.existsSync(dir);
}

const fromInfo = async (infoFile, flags) => youtubedl.exec('', {loadInfoJson: infoFile, ...flags})

router.get('/download', async (req, res) => {

    // Parameters
    // - ?v = STR   video URL
    // - ?r = STR   redirect URL, do not redirect if not specified
    // - ?m = BOOL  if true, return metadata instead of downloading

    const videoUrl = decodeURI(req.query.v)
    const redirect = req.query.r;
    const metadataOnly = req.query.m === 'true';

    let videoId;

    try {
        videoId = videoUrl.split('v=')[1];
    } catch (e) {
        return res.send('Invalid video URL');
    }

    // Get video metadata
    const downloadOptions = {
        dumpSingleJson: true,
        noWarnings: true,
        noCallHome: true,
        preferFreeFormats: false,
        youtubeSkipDashManifest: true,
        referer: 'https://screw.big.tech/',
        geoBypass: true,
        noCheckCertificate: true,
        output: `${config.storage.paths.metadata}${videoId}/metadata.json`
    };

    // Fetch & save metadata
    const videoInfo = await youtubedl(videoUrl, downloadOptions);
    await checkDir(`${config.storage.paths.metadata}${videoId}/`);
    await fs.writeFileSync(`${config.storage.paths.metadata}${videoId}/metadata.json`, JSON.stringify(videoInfo, null, 4));

    // If metadataOnly is true, return the metadata
    if (metadataOnly && redirect) return res.redirect(redirect + '?v=' + videoId);
    else if (metadataOnly) return res.send(videoInfo);

    // Download video
    await checkDir(`${config.storage.paths.videos}${videoId}/`);
    await fromInfo(`${config.storage.paths.metadata}${videoId}/metadata.json`, {
        output: `${config.storage.paths.processing}${videoId}/video.${videoInfo.ext}`,
    })

    // Move video from /data/processing/id/video.ext to /data/videos/id/video.ext
    await fs.renameSync(`${config.storage.paths.processing}${videoId}/video.${videoInfo.ext}`, `${config.storage.paths.videos}${videoId}/video.${videoInfo.ext}`);
    await fs.copyFileSync(`${config.storage.paths.metadata}${videoId}/metadata.json`, `${config.storage.paths.videos}${videoId}/metadata.json`);

    // Update metadata
    const metadata = require(`../data/metadata/${videoId}/metadata.json`);
    metadata.downloaded = true;
    await fs.writeFileSync(`${config.storage.paths.videos}${videoId}/metadata.json`, JSON.stringify(metadata, null, 4));

    // Redirect to video page
    res.redirect(`/watch?v=${videoId}`);


});

// /stream
router.get('/stream', async (req, res) => {

    // Parameters
    // - ?v = STR   video ID

    const videoId = req.query.v;

    // get video
    const metadata = require(`../data/videos/${videoId}/metadata.json`);
    const videoPath = `${config.storage.paths.videos}${videoId}/video.${metadata.ext}`;
    console.log(videoPath);

    // stream video
    const stat = fs.statSync(videoPath)
    const fileSize = stat.size

    const headers = {
        'Content-Length': fileSize,
        'Content-Type': `video/${metadata.ext}`
    }

    res.writeHead(200, headers)

    const videoStream = fs.createReadStream(videoPath)
    videoStream.pipe(res)




});

module.exports = router