const mongoose = require('mongoose');
const config = require('../../config.json');

const connectToDb = () => {
    mongoose.connect(config.mongodb.url, null).then(r => console.log('Connected to MongoDB'));
};

module.exports = {connectToDb};