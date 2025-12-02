const prisma = require('../config/database');

const createPayment = async (data) => {
  return prisma.payment.create({ data });
};

const getPayment = async (id) => {
  return prisma.payment.findUnique({ where: { id } });
};

const getPaymentByOrderId = async (merchantOrderId) => {
  return prisma.payment.findUnique({ where: { merchantOrderId } });
};

const updatePaymentStatus = async (id, status) => {
  return prisma.payment.update({ where: { id }, data: { status } });
};

const confirmPayment = async (id) => {
  const payment = await prisma.payment.findUnique({ where: { id } });
  if (!payment || payment.status !== 'pending') throw new Error('Invalid payment');
  const wallet = await prisma.wallet.findFirst({ where: { userId: payment.userId } });
  if (!wallet) throw new Error('No wallet');
  return prisma.$transaction(async (tx) => {
    await tx.wallet.update({ where: { id: wallet.id }, data: { balance: { increment: payment.amount } } });
    await tx.transaction.create({ data: { walletId: wallet.id, amount: payment.amount, type: 'credit', reference: `Payment ${id}` } });
    return tx.payment.update({ where: { id }, data: { status: 'completed' } });
  });
};

module.exports = { createPayment, getPayment, getPaymentByOrderId, updatePaymentStatus, confirmPayment };