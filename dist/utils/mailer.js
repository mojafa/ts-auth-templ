"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = __importDefault(require("./logger"));
const smtp = config_1.default.get("smtp");
const transporter = nodemailer_1.default.createTransport(Object.assign(Object.assign({}, smtp), { auth: {
        user: smtp.user, pass: smtp.pass
    } }));
async function sendEmail(payload) {
    transporter.sendMail(payload, (err, info) => {
        if (err) {
            logger_1.default.error(err, "Error sending email");
            return;
        }
        logger_1.default.info(`Preview URL: ${nodemailer_1.default.getTestMessageUrl(info)}`);
    });
}
exports.default = sendEmail;
//# sourceMappingURL=mailer.js.map