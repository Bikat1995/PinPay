const prisma = require('../config/database');

const createPayment = async (req, res, next) => {
  try {
    const { merchantOrderId, amount, currency, method, merchantId } = req.body;
    const payment = await prisma.payment.create({
      data: {
        merchantOrderId,
        amount,
        currency,
        status: 'pending',
        method,
        userId: req.user.id,
        merchantId,
      },
    });
    res.status(201).json(payment);
  } catch (error) {
    next(error);
  }
};

const getPayment = async (req, res, next) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
    });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    next(error);
  }
};

const getPaymentByOrderId = async (req, res, next) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { merchantOrderId: req.params.merchantOrderId },
    });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    next(error);
  }
};

const updatePaymentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const payment = await prisma.payment.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(payment);
  } catch (error) {
    next(error);
  }
};

const confirmPayment = async (req, res, next) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
    });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    if (payment.status !== 'pending') return res.status(400).json({ error: 'Payment already processed' });

    // Assume user has a wallet, find one or create? For simplicity, assume wallet exists
    const wallet = await prisma.wallet.findFirst({
      where: { userId: payment.userId },
    });
    if (!wallet) return res.status(400).json({ error: 'No wallet found' });

    await prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: payment.amount } },
      });
      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          amount: payment.amount,
          type: 'credit',
          reference: `Payment ${payment.id}`,
        },
      });
      await tx.payment.update({
        where: { id: req.params.id },
        data: { status: 'completed' },
      });
    });
    res.json({ message: 'Payment confirmed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPayment,
  getPayment,
  getPaymentByOrderId,
  updatePaymentStatus,
  confirmPayment,
};