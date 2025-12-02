const prisma = require('../config/database');

const getTransactionsForWallet = async (req, res, next) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { walletId: req.params.walletId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

const getTransaction = async (req, res, next) => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: req.params.id },
    });
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json(transaction);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactionsForWallet,
  getTransaction,
};