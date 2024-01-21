const {User} = require("./../schemas/User");
const jwt = require("jsonwebtoken");
const {sendApiResponse} = require("../utilities/api");

/**
 * Authenticates the user by checking for an authentication header and cookie.
 * If a valid token is found, it decodes the token and fetches the user from the database.
 * If the user is found, it assigns the user and token to the request object and continues.
 * If no token is provided, it will continue without a user.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {void}
 */
async function authenticate(req, res, next) {

    let useCookie = false;
    let token = req.headers["authorization"];
    if (!token) {
        token = req.cookies["token"];
        useCookie = true;
    }

    if (!token) return next();
    if (token.startsWith("Bearer ")) token = token.slice(7, token.length);

    try {
        const decoded = jwt.decode(token, process.env.JWT_SECRET);

        const userId = decoded.id;
        const user = await User.findById(userId);
        if (!user) return res.status(401).json({message: "Invalid token provided"});

        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        if (useCookie) res.clearCookie("token");
        return sendApiResponse(res, 401, "Invalid token provided")
    }
}

module.exports = authenticate;
