"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateResource = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (e) {
        console.log(e.errors);
        return res.sendStatus(400).send(e.errors);
    }
    return;
};
exports.default = validateResource;
//# sourceMappingURL=validateResource.js.map