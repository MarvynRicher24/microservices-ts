"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateValidation = exports.userCreateValidation = void 0;
const express_validator_1 = require("express-validator");
exports.userCreateValidation = [
    (0, express_validator_1.body)('firstName').isString().notEmpty(),
    (0, express_validator_1.body)('lastName').isString().notEmpty(),
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('phone').optional().isMobilePhone('any'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });
        next();
    }
];
exports.userUpdateValidation = [
    (0, express_validator_1.body)('firstName').optional().isString(),
    (0, express_validator_1.body)('lastName').optional().isString(),
    (0, express_validator_1.body)('email').optional().isEmail(),
    (0, express_validator_1.body)('phone').optional().isMobilePhone('any'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });
        next();
    }
];
//# sourceMappingURL=validation.middleware.js.map