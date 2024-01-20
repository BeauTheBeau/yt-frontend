const path = require('path');
const fs = require('fs');
const config = require('../../config.json');

const ensureDirectoriesExist = (directories) => {
    directories.forEach((dir) => {
        const subDirs = dir.split('/');
        subDirs.reduce((currentPath, subDir) => {
            const newPath = path.join(currentPath, subDir);
            checkDir(newPath);
            return newPath;
        }, '');
    });
};

const checkDir = (dir, mkdir = true) => {
    if (mkdir && !fs.existsSync(dir)) fs.mkdirSync(dir);
    else return fs.existsSync(dir);
};

const initDirectories = () => {
    const directoriesToEnsure = [
        config.storage.paths.videos,
        config.storage.paths.processing,
        config.storage.paths.metadata
    ];
    ensureDirectoriesExist(directoriesToEnsure);
};

module.exports = { initDirectories };