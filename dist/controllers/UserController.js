"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
class UserController {
    constructor(userService) {
        this.userService = userService;
        this.create = async (req, res, next) => {
            try {
                const body = req.body;
                const created = await this.userService.createUser(body);
                res.status(201).json(created);
            }
            catch (err) {
                next(err);
            }
        };
        this.list = async (req, res, next) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const pageSize = parseInt(req.query.pageSize) || 20;
                const users = await this.userService.listUsers(page, pageSize);
                res.json(users);
            }
            catch (err) {
                next(err);
            }
        };
        this.getById = async (req, res, next) => {
            try {
                const user = await this.userService.getUser(req.params.id);
                res.json(user);
            }
            catch (err) {
                next(err);
            }
        };
        this.update = async (req, res, next) => {
            try {
                const body = req.body;
                const updated = await this.userService.updateUser(req.params.id, body);
                res.json(updated);
            }
            catch (err) {
                next(err);
            }
        };
        this.remove = async (req, res, next) => {
            try {
                await this.userService.deleteUser(req.params.id);
                res.status(204).send();
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map