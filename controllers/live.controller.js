const liveService = require("../services/live.service");

const getLive = async (req, res, next) => {
  try {
    const { teacherId } = req.params;

    const content = await liveService.getLiveContent(Number(teacherId));

    if (!content) {
      return res.json({ message: "No content available" });
    }

    res.json({
      message: "Live content",
      content,
    });
  } catch (err) {
    next(err);
  }
};

const subjectBasedLiveRotation = async (req, res, next) => {
  try {
    const { subject } = req.query;

    if (!subject) {
      return res.json({ message: "No content available" });
    }

    const content = await liveService.getLiveContentBasedOnSubject(subject);

    if (!content) {
      return res.json({ message: "No content available" });
    }

    res.json({
      message: "Live content",
      content,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getLive, subjectBasedLiveRotation };
