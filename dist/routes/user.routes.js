"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../container");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const router = (0, express_1.Router)();
const userController = container_1.container.resolve('userController');
router.get('/', userController.list);
router.get('/:id', userController.getById);
router.post('/', validation_middleware_1.userCreateValidation, userController.create);
router.put('/:id', validation_middleware_1.userUpdateValidation, userController.update);
router.delete('/:id', userController.remove);
exports.default = router;
//# sourceMappingURL=user.routes.js.map