const approvalService = require("../services/approval.service");
const prisma = require("../config/prisma");

const approve = async (req, res, next) => {
  try {
    const contentId = req.params.id;
    const existingContent = await prisma.content.findUnique({
      where: { id: Number(contentId) },
    });

    if (!existingContent) {
      return res.status(404).json({ message: "Content not found" });
    }

    if (existingContent.status !== "pending") {
      return res.status(400).json({
        message: "Content already reviewed",
      });
    }
    const content = await approvalService.approveContent(
      contentId,
      req.user.id,
    );

    res.json({
      message: "Content approved",
      content,
    });
  } catch (err) {
    next(err);
  }
};

const reject = async (req, res, next) => {
  try {
    const contentId = req.params.id;
    const { reason } = req.body;

    if (!reason) {
      const err = new Error("Rejection reason required");
      err.status = 400;
      return next(err);
    }
    const existingContent = await prisma.content.findUnique({
      where: { id: Number(contentId) },
    });

    if (!existingContent) {
      return res.status(404).json({ message: "Content not found" });
    }

    if (existingContent.status !== "pending") {
      return res.status(400).json({
        message: "Content already reviewed",
      });
    }

    const content = await approvalService.rejectContent(
      contentId,
      req.user.id,
      reason,
    );

    res.json({
      message: "Content rejected",
      content,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { approve, reject };
