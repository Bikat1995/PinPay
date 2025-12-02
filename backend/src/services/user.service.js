const prisma = require('../config/database');
const bcrypt = require('bcryptjs');

const createUser = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: { ...data, password: hashedPassword },
  });
};

const findUserByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

const findUserById = async (id) => {
  return prisma.user.findUnique({ where: { id } });
};

const updateUser = async (id, data) => {
  return prisma.user.update({ where: { id }, data });
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
};