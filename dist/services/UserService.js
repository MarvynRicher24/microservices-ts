"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const role_util_1 = require("../utils/role.util");
class UserService {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async createUser(data) {
        const exists = await this.userRepo.findByEmail(data.email);
        if (exists) {
            const err = new Error('Email already in use');
            err.status = 409;
            throw err;
        }
        const role = (0, role_util_1.assignRoleFromEmail)(data.email);
        const user = await this.userRepo.create({ ...data, role });
        return user;
    }
    async listUsers(page = 1, pageSize = 20) {
        const skip = (page - 1) * pageSize;
        return this.userRepo.findAll(skip, pageSize);
    }
    async getUser(id) {
        const user = await this.userRepo.findById(id);
        if (!user) {
            const err = new Error('User not found');
            err.status = 404;
            throw err;
        }
        return user;
    }
    async updateUser(id, data) {
        const user = await this.userRepo.findById(id);
        if (!user) {
            const err = new Error('User not found');
            err.status = 404;
            throw err;
        }
        if (data.email && data.email !== user.email) {
            const other = await this.userRepo.findByEmail(data.email);
            if (other && other.id !== id) {
                const err = new Error('Email already in use');
                err.status = 409;
                throw err;
            }
        }
        const updated = await this.userRepo.update(id, data);
        return updated;
    }
    async deleteUser(id) {
        const user = await this.userRepo.findById(id);
        if (!user) {
            const err = new Error('User not found');
            err.status = 404;
            throw err;
        }
        await this.userRepo.softDelete(id);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map