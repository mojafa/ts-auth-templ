"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUserHandler = exports.resetPasswordHandler = exports.forgotPasswordHandler = exports.verifyUserHandler = exports.createUserHandler = void 0;
const nanoid_1 = require("nanoid");
const user_service_1 = require("../service/user.service");
const logger_1 = __importDefault(require("../utils/logger"));
const mailer_1 = __importDefault(require("../utils/mailer"));
async function createUserHandler(req, res) {
    const body = req.body;
    try {
        const user = await (0, user_service_1.createUser)(body);
        await (0, mailer_1.default)({
            to: user.email,
            from: "test@example.com",
            subject: "Verify your email",
            text: `verification code: ${user.verificationCode}.Id: ${user.id}`,
        });
        return res.send("User successfully created");
    }
    catch (e) {
        if (e.code === 11000) {
            return res.status(409).send("User already exists");
        }
        return res.status(500).send(e);
    }
}
exports.createUserHandler = createUserHandler;
async function verifyUserHandler(req, res) {
    const id = req.params.id;
    const verificationCode = req.params.verificationCode;
    const user = await (0, user_service_1.findUserById)(id);
    if (!user) {
        return res.send("Could not verify user");
    }
    if (user.verified) {
        return res.send("User is already verified");
    }
    if (user.verificationCode === verificationCode) {
        user.verified = true;
        await user.save();
        return res.send("User successfully verified");
    }
    return res.send("Could not verify user");
}
exports.verifyUserHandler = verifyUserHandler;
async function forgotPasswordHandler(req, res) {
    const message = "If a user with that email is registered you will receive a password reset email";
    const { email } = req.body;
    const user = await (0, user_service_1.findUserByEmail)(email);
    if (!user) {
        logger_1.default.debug(`User with email ${email} does not exists`);
        return res.send(message);
    }
    if (!user.verified) {
        return res.send("User is not verified");
    }
    const passwordResetCode = (0, nanoid_1.nanoid)();
    user.passwordResetCode = passwordResetCode;
    await user.save();
    await (0, mailer_1.default)({
        to: user.email,
        from: "test@example.com",
        subject: "Reset your password",
        text: `Password reset code: ${passwordResetCode}. Id ${user._id}`,
    });
    logger_1.default.debug(`Password reset email sent to ${email}`);
    return res.send(message);
}
exports.forgotPasswordHandler = forgotPasswordHandler;
async function resetPasswordHandler(req, res) {
    const { id, passwordResetCode } = req.params;
    const { password } = req.body;
    const user = await (0, user_service_1.findUserById)(id);
    if (!user ||
        !user.passwordResetCode ||
        user.passwordResetCode !== passwordResetCode) {
        return res.status(400).send("Could not reset user password");
    }
    user.passwordResetCode = null;
    user.password = password;
    await user.save();
    return res.send("Successfully updated password");
}
exports.resetPasswordHandler = resetPasswordHandler;
async function getCurrentUserHandler(req, res) {
    return res.send(res.locals.user);
}
exports.getCurrentUserHandler = getCurrentUserHandler;
//# sourceMappingURL=user.controller.js.map