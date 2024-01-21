const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const config = require("./../../config");

const UserSchema = new Schema({

    username: { type: String, required: true, unique: true },
    handle: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },

    watched: { type: [{ type: Schema.Types.ObjectId, ref: 'Video' }], default: [] },
    liked: { type: [{ type: Schema.Types.ObjectId, ref: 'Video' }], default: [] },
    disliked: { type: [{ type: Schema.Types.ObjectId, ref: 'Video' }], default: [] },

    favorites: { type: [{ type: Schema.Types.ObjectId, ref: 'Video' }], default: [] },
    playlists: { type: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }], default: [] },

});

UserSchema.pre('save', function (next) {

    const user = this;
    if (!user.handle) user.handle = user.username.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });

    });

    next();

});

UserSchema.methods.generateJWT = function () {
    const payload = { id: this._id, username: this.username };
    return jwt.sign(payload, config.jwt.secret, {expiresIn: config.jwt.expiresIn});
};

module.exports = mongoose.model('User', UserSchema);
