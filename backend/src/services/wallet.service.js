const prisma = require('../config/database');

const createWallet = async (data) => {
  return prisma.wallet.create({ data });
};

const getWalletsForUser = async (userId) => {
  return prisma.wallet.findMany({ where: { userId } });
};

const getWallet = async (id) => {
  return prisma.wallet.findUnique({ where: { id } });
};

const creditWallet = async (id, amount, reference) => {
  return prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({ where: { id } });
    if (!wallet) throw new Error('Wallet not found');
    await tx.wallet.update({ where: { id }, data: { balance: { increment: amount } } });
    return tx.transaction.create({ data: { walletId: id, amount, type: 'credit', reference } });
  });
};

const debitWallet = async (id, amount, reference) => {
  return prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({ where: { id } });
    if (!wallet) throw new Error('Wallet not found');
    if (wallet.balance < amount) throw new Error('Insufficient balance');
    await tx.wallet.update({ where: { id }, data: { balance: { decrement: amount } } });
    return tx.transaction.create({ data: { walletId: id, amount, type: 'debit', reference } });
  });
};

module.exports = { createWallet, getWalletsForUser, getWallet, creditWallet, debitWallet };