const prisma = require('../config/database');

const createWallet = async (req, res, next) => {
  try {
    const { currency, type } = req.body;
    const wallet = await prisma.wallet.create({
      data: { userId: req.user.id, currency, type },
    });
    res.status(201).json(wallet);
  } catch (error) {
    next(error);
  }
};

const getWalletsForUser = async (req, res, next) => {
  try {
    const wallets = await prisma.wallet.findMany({
      where: { userId: req.params.userId },
    });
    res.json(wallets);
  } catch (error) {
    next(error);
  }
};

const getWallet = async (req, res, next) => {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { id: req.params.id },
    });
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });
    res.json(wallet);
  } catch (error) {
    next(error);
  }
};

const creditWallet = async (req, res, next) => {
  try {
    const { amount, reference } = req.body;
    await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({
        where: { id: req.params.id },
      });
      if (!wallet) throw new Error('Wallet not found');
      await tx.wallet.update({
        where: { id: req.params.id },
        data: { balance: { increment: amount } },
      });
      await tx.transaction.create({
        data: {
          walletId: req.params.id,
          amount,
          type: 'credit',
          reference,
        },
      });
    });
    res.json({ message: 'Wallet credited successfully' });
  } catch (error) {
    next(error);
  }
};

const debitWallet = async (req, res, next) => {
  try {
    const { amount, reference } = req.body;
    await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({
        where: { id: req.params.id },
      });
      if (!wallet) throw new Error('Wallet not found');
      if (wallet.balance < amount) throw new Error('Insufficient balance');
      await tx.wallet.update({
        where: { id: req.params.id },
        data: { balance: { decrement: amount } },
      });
      await tx.transaction.create({
        data: {
          walletId: req.params.id,
          amount,
          type: 'debit',
          reference,
        },
      });
    });
    res.json({ message: 'Wallet debited successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createWallet,
  getWalletsForUser,
  getWallet,
  creditWallet,
  debitWallet,
};