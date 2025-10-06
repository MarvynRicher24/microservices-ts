// @ts-nocheck
const { PrismaClient } = require('@prisma/client');

class PrismaUnitOfWork {
  /**
   * @type {PrismaClient}
   */
  prisma;

  /**
   * @param {PrismaClient} prisma
   */
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * @template T
   * @param {(tx: any) => Promise<T>} fn
   * @returns {Promise<T>}
   */
  async runInTransaction(fn) {
    return this.prisma.$transaction(async (tx) => {
      return fn(tx);
    });
  }
}

module.exports = { PrismaUnitOfWork };
