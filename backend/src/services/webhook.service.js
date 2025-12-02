const prisma = require('../config/database');

const createWebhook = async (data) => {
  return prisma.webhookEvent.create({ data });
};

const getWebhook = async (id) => {
  return prisma.webhookEvent.findUnique({ where: { id } });
};

const listWebhooks = async () => {
  return prisma.webhookEvent.findMany({ orderBy: { receivedAt: 'desc' } });
};

const processWebhook = async (webhookId, paymentId) => {
  const webhook = await prisma.webhookEvent.findUnique({ where: { id: webhookId } });
  if (webhook.processed) return;
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment || payment.status !== 'pending') return;
  const wallet = await prisma.wallet.findFirst({ where: { userId: payment.userId } });
  if (!wallet) return;
  return prisma.$transaction(async (tx) => {
    await tx.wallet.update({ where: { id: wallet.id }, data: { balance: { increment: payment.amount } } });
    await tx.transaction.create({ data: { walletId: wallet.id, amount: payment.amount, type: 'credit', reference: `Webhook ${webhookId}` } });
    await tx.payment.update({ where: { id: paymentId }, data: { status: 'completed' } });
    return tx.webhookEvent.update({ where: { id: webhookId }, data: { processed: true } });
  });
};

module.exports = { createWebhook, getWebhook, listWebhooks, processWebhook };