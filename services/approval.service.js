const prisma = require("../config/prisma");

const approveContent = async (contentId, principalId) => {
  return prisma.content.update({
    where: { id: Number(contentId) },
    data: {
      status: "approved",
      approved_by: principalId,
      approved_at: new Date(),
    },
  });
};

const rejectContent = async (contentId, principalId, reason) => {
  return prisma.content.update({
    where: { id: Number(contentId) },
    data: {
      status: "rejected",
      approved_by: principalId,
      rejection_reason: reason,
      approved_at: new Date(),
    },
  });
};

module.exports = { approveContent, rejectContent };
