const prisma = require('../config/database');

const getTransactionsForWallet = async (walletId) => {
  return prisma.transaction.findMany({ where: { walletId }, orderBy: { createdAt: 'desc' } });
};

const getTransaction = async (id) => {
  return prisma.transaction.findUnique({ where: { id } });
};

module.exports = { getTransactionsForWallet, getTransaction };