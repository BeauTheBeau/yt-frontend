const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    watched: { type: [{ type: Schema.Types.ObjectId, ref: 'Video' }], default: [] },
    liked: { type: [{ type: Schema.Types.ObjectId, ref: 'Video' }], default: [] },
    disliked: { type: [{ type: Schema.Types.ObjectId, ref: 'Video' }], default: [] },

    favorites: { type: [{ type: Schema.Types.ObjectId, ref: 'Video' }], default: [] },
    playlists: { type: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }], default: [] },

});

module.exports = mongoose.model('User', UserSchema);
