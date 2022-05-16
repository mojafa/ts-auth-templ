"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = exports.signRefreshToken = exports.findSessionById = exports.createSession = void 0;
const lodash_1 = require("lodash");
const session_model_1 = __importDefault(require("../model/session.model"));
const user_model_1 = require("../model/user.model");
const jwt_1 = require("../utils/jwt");
async function createSession({ userId }) {
    return session_model_1.default.create({ user: userId });
}
exports.createSession = createSession;
async function findSessionById(id) {
    return session_model_1.default.findById(id);
}
exports.findSessionById = findSessionById;
async function signRefreshToken({ userId }) {
    const session = await createSession({
        userId,
    });
    const refreshToken = (0, jwt_1.signJwt)({
        session: session._id,
    }, "refreshTokenPrivateKey", {
        expiresIn: "1y",
    });
    return refreshToken;
}
exports.signRefreshToken = signRefreshToken;
function signAccessToken(user) {
    const payload = (0, lodash_1.omit)(user.toJSON(), user_model_1.privateFields);
    const accessToken = (0, jwt_1.signJwt)(payload, "accessTokenPrivateKey", {
        expiresIn: "15m",
    });
    return accessToken;
}
exports.signAccessToken = signAccessToken;
//# sourceMappingURL=auth.service.js.map