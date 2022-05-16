"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const requireUser_1 = __importDefault(require("../middleware/requireUser"));
const validateResource_1 = __importDefault(require("../middleware/validateResource"));
const user_schema_1 = require("../schema/user.schema");
const router = express_1.default.Router();
router.post("/api/users", (0, validateResource_1.default)(user_schema_1.createUserSchema), user_controller_1.createUserHandler);
router.post("/api/users/verify/:id/:verificationCode", (0, validateResource_1.default)(user_schema_1.verifyUserSchema), user_controller_1.verifyUserHandler);
router.post("/api/users/forgotpassword", (0, validateResource_1.default)(user_schema_1.forgotPasswordSchema), user_controller_1.forgotPasswordHandler);
router.post("/api/users/resetpassword/:id/:passwordResetCode", (0, validateResource_1.default)(user_schema_1.resetPasswordSchema), user_controller_1.resetPasswordHandler);
router.get("/api/users/me", requireUser_1.default, user_controller_1.getCurrentUserHandler);
exports.default = router;
//# sourceMappingURL=user.routes.js.map