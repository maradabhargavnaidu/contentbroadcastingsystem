const scheduleService = require("../services/schedule.service");

const createSchedule = async (req, res, next) => {
  try {
    const { contentId, subject, rotation_order, duration } = req.body;

    if (!contentId || !subject || !rotation_order || !duration) {
      const err = new Error("All fields are required");
      err.status = 400;
      return next(err);
    }

    const schedule = await scheduleService.addSchedule(
      contentId,
      subject,
      rotation_order,
      duration,
    );

    res.json({
      message: "Schedule created",
      schedule,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createSchedule };
