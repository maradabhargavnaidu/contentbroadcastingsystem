const prisma = require("../config/prisma");

const createContent = async (data) => {
  return prisma.content.create({
    data,
  });
};

module.exports = { createContent };
