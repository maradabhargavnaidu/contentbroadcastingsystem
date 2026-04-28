const prisma = require("../config/prisma");

const addSchedule = async (contentId, subject, rotationOrder, duration) => {
  let slot = await prisma.contentSlot.findFirst({
    where: { subject },
  });

  if (!slot) {
    slot = await prisma.contentSlot.create({
      data: { subject },
    });
  }

  const schedule = await prisma.contentSchedule.create({
    data: {
      content_id: Number(contentId),
      slot_id: slot.id,
      rotation_order: rotationOrder,
      duration,
    },
  });

  return schedule;
};

module.exports = { addSchedule };
