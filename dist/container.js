"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const awilix_1 = require("awilix");
const PrismaUserRepository_1 = require("./repositories/PrismaUserRepository");
const UserService_1 = require("./services/UserService");
const UserController_1 = require("./controllers/UserController");
exports.container = (0, awilix_1.createContainer)();
exports.container.register({
    userRepository: (0, awilix_1.asClass)(PrismaUserRepository_1.PrismaUserRepository).singleton(),
    userService: (0, awilix_1.asClass)(UserService_1.UserService).singleton(),
    userController: (0, awilix_1.asClass)(UserController_1.UserController).singleton(),
});
exports.default = exports.container;
//# sourceMappingURL=container.js.map