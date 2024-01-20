const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({

    video: { type: Schema.Types.ObjectId, ref: 'Video' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },

    parent: { type: Schema.Types.ObjectId, ref: 'Comment' }, // if this is a reply to another comment
    children: { type: [{ type: Schema.Types.ObjectId, ref: 'Comment' }], default: [] },

    likes: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] },
    dislikes: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] },

    text: { type: String, required: true },
    time: { type: Number, required: true }


});

module.exports = mongoose.model('Comment', CommentSchema);

