"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../utils/jwt");
const deserializeUser = async (req, res, next) => {
    const accessToken = (req.headers.authorization || "").replace(/^Bearer\s/, "");
    if (!accessToken) {
        return next();
    }
    const decoded = (0, jwt_1.verifyJwt)(accessToken, "accessTokenPublicKey");
    if (decoded) {
        res.locals.user = decoded;
    }
    return next();
};
exports.default = deserializeUser;
//# sourceMappingURL=deserializeUser.js.map