const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const config = require("./../../config");

const UserSchema = new Schema({

    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },

    watched: { type: [{ type: Schema.Types.ObjectId, ref: 'Video' }], default: [] },
    liked: { type: [{ type: Schema.Types.ObjectId, ref: 'Video' }], default: [] },
    disliked: { type: [{ type: Schema.Types.ObjectId, ref: 'Video' }], default: [] },

    favorites: { type: [{ type: Schema.Types.ObjectId, ref: 'Video' }], default: [] },
    playlists: { type: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }], default: [] },

});

UserSchema.pre('save', async function (next) {

    const user = this;
    if (!user.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    next();

});

UserSchema.methods.generateJWT = function () {
    const payload = { id: this._id, username: this.username };
    return jwt.sign(payload, config.jwt.secret, {expiresIn: config.jwt.expiresIn});
};

module.exports = mongoose.model('User', UserSchema);
