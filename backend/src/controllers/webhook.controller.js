const prisma = require('../config/database');

const receiveTelebirr = async (req, res, next) => {
  try {
    const { providerId, payload } = req.body;
    const existing = await prisma.webhookEvent.findFirst({
      where: { provider: 'telebirr', providerId },
    });
    if (existing && existing.processed) {
      return res.status(200).json({ message: 'Already processed' });
    }
    const webhook = await prisma.webhookEvent.create({
      data: { provider: 'telebirr', providerId, payload },
    });
    // Process payment
    const payment = await prisma.payment.findUnique({
      where: { merchantOrderId: payload.orderId },
    });
    if (payment && payment.status === 'pending') {
      const wallet = await prisma.wallet.findFirst({
        where: { userId: payment.userId },
      });
      if (wallet) {
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
              reference: `Webhook ${webhook.id}`,
            },
          });
          await tx.payment.update({
            where: { id: payment.id },
            data: { status: 'completed' },
          });
          await tx.webhookEvent.update({
            where: { id: webhook.id },
            data: { processed: true },
          });
        });
      }
    }
    res.status(200).json({ message: 'Webhook received' });
  } catch (error) {
    next(error);
  }
};

const receiveCBEBirr = async (req, res, next) => {
  try {
    const { providerId, payload } = req.body;
    const existing = await prisma.webhookEvent.findFirst({
      where: { provider: 'cbebirr', providerId },
    });
    if (existing && existing.processed) {
      return res.status(200).json({ message: 'Already processed' });
    }
    const webhook = await prisma.webhookEvent.create({
      data: { provider: 'cbebirr', providerId, payload },
    });
    // Similar processing
    const payment = await prisma.payment.findUnique({
      where: { merchantOrderId: payload.orderId },
    });
    if (payment && payment.status === 'pending') {
      const wallet = await prisma.wallet.findFirst({
        where: { userId: payment.userId },
      });
      if (wallet) {
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
              reference: `Webhook ${webhook.id}`,
            },
          });
          await tx.payment.update({
            where: { id: payment.id },
            data: { status: 'completed' },
          });
          await tx.webhookEvent.update({
            where: { id: webhook.id },
            data: { processed: true },
          });
        });
      }
    }
    res.status(200).json({ message: 'Webhook received' });
  } catch (error) {
    next(error);
  }
};

const listWebhooks = async (req, res, next) => {
  try {
    const webhooks = await prisma.webhookEvent.findMany({
      orderBy: { receivedAt: 'desc' },
    });
    res.json(webhooks);
  } catch (error) {
    next(error);
  }
};

const getWebhook = async (req, res, next) => {
  try {
    const webhook = await prisma.webhookEvent.findUnique({
      where: { id: req.params.id },
    });
    if (!webhook) return res.status(404).json({ error: 'Webhook not found' });
    res.json(webhook);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  receiveTelebirr,
  receiveCBEBirr,
  listWebhooks,
  getWebhook,
};