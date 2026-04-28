const { contentSchema } = require("../validations/content.validation");
const contentService = require("../services/content.service");
const fs = require("fs");
const prisma = require("../config/prisma");

const uploadContent = async (req, res, next) => {
  try {
    const { error } = contentSchema.validate(req.body);
    if (error) {
      error.status = 400;
      return next(error);
    }

    if (!req.file) {
      const err = new Error("File is required");
      err.status = 400;
      return next(err);
    }

    const { title, subject, description, start_time, end_time } = req.body;
    console.log(req.body);

    const content = await contentService.createContent({
      title,
      subject,
      description,
      file_url: req.file.path,
      file_type: req.file.mimetype,
      file_size: req.file.size,
      uploaded_by: req.user.id,
      status: "pending",
      start_time: start_time ? new Date(start_time) : null,
      end_time: end_time ? new Date(end_time) : null,
    });

    res.status(201).json({
      message: "Content uploaded successfully",
      content,
    });
  } catch (err) {
    if (req.file) {
      fs.unlink(req.file.path, (e) => {
        if (e) console.log("Error deleting file:", e);
      });
    }
    next(err);
  }
};

const getAllContent = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, subject, status } = req.query;

    const content = await prisma.content.findMany({
      where: {
        ...(subject && { subject }),
        ...(status && { status }),
      },
      skip: (page - 1) * limit,
      take: Number(limit),
    });

    res.json(content);
  } catch (err) {
    next(err);
  }
};

const getPendingContent = async (req, res, next) => {
  try {
    const content = await prisma.content.findMany({
      where: { status: "pending" },
    });
    res.json(content);
  } catch (err) {
    next(err);
  }
};

const getMyContent = async (req, res, next) => {
  try {
    const content = await prisma.content.findMany({
      where: { uploaded_by: req.user.id },
    });

    res.json(content);
  } catch (err) {
    next(err);
  }
};

const getLiveForLoggedUser = async (req, res, next) => {
  try {
    const now = new Date();
    const contents = await prisma.content.findMany({
      where: {
        status: "approved",
        start_time: { lte: now },
        end_time: { gte: now },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (!contents.length) {
      return res.json({ message: "No approved content at this time" });
    }

    res.json({ contents });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadContent,
  getAllContent,
  getPendingContent,
  getMyContent,
  getLiveForLoggedUser,
};
