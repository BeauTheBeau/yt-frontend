/**
 * @file routes/users.js
 * @description This file handles all user-related routes, such as login and registration.
 */

const express = require('express');
const router = express.Router();
const { check } = require("express-validator")
const bcrypt = require('bcrypt');


const User = require('../schemas/User');

const { sendApiResponse } = require('../utilities/api');
const {jwt} = require("../../config");
const authenticate = require("../middleware/authenticate");
const config = require('../../config.json');

router.post(
    '/register',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
    ],
    async (req, res) => {

        let { username, password } = req.body;
        username = username.toLowerCase().replace(/[^a-z0-9]/g, "");
        const newUser = new User({ username, password });

        const existingUser = await User.findOne({ username });
        if (existingUser) return sendApiResponse(res, 400, 'User already exists');

        try {
            await newUser.save();
            return sendApiResponse(res, 200, 'User registered', { user: newUser });
        } catch (err) {
            return sendApiResponse(res, 500, 'Internal Server Error');
        }
    }
);


router.post(
    '/login',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('password', 'Password is required').not().isEmpty(),
    ],
    async (req, res) => {

        try {
            const {username, password} = req.body;
            const user = await User.findOne({username}).select('+password');

            if (user && await bcrypt.compare(password, user.password)) {

                const options = {
                    maxAge: config.jwt.expiresInMs,
                    httpOnly: true,
                    secure: true
                };

                const token = user.generateJWT();
                res.cookie('token', token, options);

                return sendApiResponse(res, 200, 'Logged in', {...user._doc, password: undefined});
            } else {
                return sendApiResponse(res, 400, 'Invalid credentials provided');
            }

        } catch (err) {
            console.log(err);
            return sendApiResponse(res, 500, 'Internal Server Error');
        }
    }
);

router.get('/logout', authenticate, async (req, res) => {
    try {
        res.clearCookie('token');
        return sendApiResponse(res, 200, 'Logged out');
    } catch (err) {
        console.log(err);
        return sendApiResponse(res, 500, 'Internal Server Error');
    }
});


module.exports = router;
