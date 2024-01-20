const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VideoSchema = new Schema({

    id: { type: String, required: true, unique: true },

    comments: { type: [{ type: Schema.Types.ObjectId, ref: 'Comment' }], default: [] },
    likes: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] },
    dislikes: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] },
    views: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] }

});

module.exports = mongoose.model('Video', VideoSchema);
