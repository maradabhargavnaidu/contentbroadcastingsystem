const prisma = require("../config/prisma");
const redis = require("../config/redis");

const getLiveContent = async (teacherId) => {
  const now = new Date();

  const contents = await prisma.content.findMany({
    where: {
      uploaded_by: Number(teacherId),
      status: "approved",
      start_time: { lte: now },
      end_time: { gte: now },
    },
    include: {
      schedules: true,
    },
  });

  if (!contents.length) return null;

  const scheduleList = contents
    .flatMap((c) =>
      c.schedules.map((s) => ({
        content: c,
        rotation_order: s.rotation_order,
        duration: s.duration || 5,
      })),
    )
    .sort((a, b) => a.rotation_order - b.rotation_order);

  if (!scheduleList.length) return null;
  const totalDuration = scheduleList.reduce(
    (sum, item) => sum + item.duration,
    0,
  );

  if (totalDuration === 0) return null;

  const nowSeconds = Math.floor(Date.now() / 1000);
  const elapsed = nowSeconds % totalDuration;

  let temp = elapsed;
  let result = null;

  for (const item of scheduleList) {
    if (temp < item.duration) {
      result = item.content;
      break;
    }
    temp -= item.duration;
  }

  return result;
};

const getLiveContentBasedOnSubject = async (subject) => {
  const now = new Date();

  const contents = await prisma.content.findMany({
    where: {
      status: "approved",
      start_time: { lte: now },
      end_time: { gte: now },
      ...(subject && { subject }),
    },
    include: {
      schedules: true,
    },
  });

  if (!contents.length) return null;

  const scheduleList = contents
    .flatMap((c) =>
      c.schedules.map((s) => ({
        content: c,
        rotation_order: s.rotation_order,
        duration: s.duration || 5,
      })),
    )
    .sort((a, b) => a.rotation_order - b.rotation_order);

  if (!scheduleList.length) return null;
  const totalDuration = scheduleList.reduce(
    (sum, item) => sum + item.duration,
    0,
  );

  if (totalDuration === 0) return null;

  const nowSeconds = Math.floor(Date.now() / 1000);
  const elapsed = nowSeconds % totalDuration;

  let temp = elapsed;
  let result = null;

  for (const item of scheduleList) {
    if (temp < item.duration) {
      result = item.content;
      break;
    }
    temp -= item.duration;
  }

  return result;
};
module.exports = { getLiveContent, getLiveContentBasedOnSubject };
