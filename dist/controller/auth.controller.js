"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessTokenHandler = exports.createSessionHandler = void 0;
const lodash_1 = require("lodash");
const auth_service_1 = require("../service/auth.service");
const user_service_1 = require("../service/user.service");
const jwt_1 = require("../utils/jwt");
async function createSessionHandler(req, res) {
    const message = "Invalid email or password";
    const { email, password } = req.body;
    const user = await (0, user_service_1.findUserByEmail)(email);
    if (!user) {
        return res.send(message);
    }
    if (!user.verified) {
        return res.send("Please verify your email");
    }
    const isValid = await user.validatePassword(password);
    if (!isValid) {
        return res.send(message);
    }
    const accessToken = (0, auth_service_1.signAccessToken)(user);
    const refreshToken = await (0, auth_service_1.signRefreshToken)({ userId: user._id });
    return res.send({
        accessToken,
        refreshToken,
    });
}
exports.createSessionHandler = createSessionHandler;
async function refreshAccessTokenHandler(req, res) {
    const refreshToken = (0, lodash_1.get)(req, "headers.x-refresh");
    const decoded = (0, jwt_1.verifyJwt)(refreshToken, "refreshTokenPublicKey");
    if (!decoded) {
        return res.status(401).send("Could not refresh access token");
    }
    const session = await (0, auth_service_1.findSessionById)(decoded.session);
    if (!session || !session.valid) {
        return res.status(401).send("Could not refresh access token");
    }
    const user = await (0, user_service_1.findUserById)(String(session.user));
    if (!user) {
        return res.status(401).send("Could not refresh access token");
    }
    const accessToken = (0, auth_service_1.signAccessToken)(user);
    return res.send({ accessToken });
}
exports.refreshAccessTokenHandler = refreshAccessTokenHandler;
//# sourceMappingURL=auth.controller.js.map