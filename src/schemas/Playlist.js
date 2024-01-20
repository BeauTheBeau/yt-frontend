const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({

    user: {type: Schema.Types.ObjectId, ref: 'User'},
    name: {type: String, required: true},
    description: {type: String, default: ''},
    videos: { type: [{type: Schema.Types.ObjectId, ref: 'Video'}], default: [] },
    private: {type: Boolean, default: false}

});

module.exports = mongoose.model('Playlist', PlaylistSchema);
