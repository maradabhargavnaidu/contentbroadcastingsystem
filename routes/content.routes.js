const express = require("express");
const router = express.Router();

const upload = require("../utils/multer");
const {
  uploadContent,
  getAllContent,
  getPendingContent,
  getMyContent,
  getLiveForLoggedUser,
} = require("../controllers/content.controller");
const {
  authenticateUser,
  authorizeRole,
} = require("../middlewares/auth.middleware");

const { approve, reject } = require("../controllers/approval.controller");
const {
  getLive,
  subjectBasedLiveRotation,
} = require("../controllers/live.controller");
const { createSchedule } = require("../controllers/schedule.controller");
const limiter = require("../middlewares/rateLimit");
/**
 * @swagger
 * tags:
 *   name: Content
 *   description: Content management APIs
 */

/**
 * @swagger
 * /api/content/upload:
 *   post:
 *     summary: Upload content (Teacher only)
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - subject
 *               - file
 *             properties:
 *               title:
 *                 type: string
 *               subject:
 *                 type: string
 *                 example: maths
 *               description:
 *                 type: string
 *               start_time:
 *                 type: string
 *                 format: date-time
 *               end_time:
 *                 type: string
 *                 format: date-time
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Content uploaded successfully
 */
router.post(
  "/upload",
  authenticateUser,
  authorizeRole("teacher"),
  upload.single("file"),
  uploadContent,
);

/**
 * @swagger
 * /api/content/{id}/approve:
 *   post:
 *     summary: Approve content (Principal only)
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Content approved
 */
router.post(
  "/:id/approve",
  authenticateUser,
  authorizeRole("principal"),
  approve,
);

/**
 * @swagger
 * /api/content/{id}/reject:
 *   post:
 *     summary: Reject content (Principal only)
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Content rejected
 */
router.post(
  "/:id/reject",
  authenticateUser,
  authorizeRole("principal"),
  reject,
);

/**
 * @swagger
 * /api/content/live/{teacherId}:
 *   get:
 *     summary: Get live content by teacher
 *     tags: [Content]
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: integer
 *
 *     responses:
 *       200:
 *         description: Live content
 */
router.get("/live/:teacherId", limiter, getLive);

/**
 * @swagger
 * /api/content/schedule:
 *   post:
 *     summary: Create schedule for content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contentId
 *               - subject
 *               - rotation_order
 *               - duration
 *             properties:
 *               contentId:
 *                 type: integer
 *               subject:
 *                 type: string
 *               rotation_order:
 *                 type: integer
 *               duration:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Schedule created
 */
router.post(
  "/schedule",
  authenticateUser,
  authorizeRole("teacher"),
  createSchedule,
);

/**
 * @swagger
 * /api/content/all:
 *   get:
 *     summary: Get all content (Principal only)
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all content
 */
router.get("/all", authenticateUser, authorizeRole("principal"), getAllContent);

/**
 * @swagger
 * /api/content/pending:
 *   get:
 *     summary: Get pending content (Principal only)
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending content list
 */
router.get(
  "/pending",
  authenticateUser,
  authorizeRole("principal"),
  getPendingContent,
);

/**
 * @swagger
 * /api/content/my:
 *   get:
 *     summary: Get teacher's own content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teacher content list
 */
router.get("/my", authenticateUser, authorizeRole("teacher"), getMyContent);
/**
 * @swagger
 * /api/content/live:
 *   get:
 *     summary: Get live content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: subject
 *         required: false
 *         schema:
 *           type: string
 *           enum: [maths, science, english, social, other]
 *         description: Filter content by subject
 *     responses:
 *       200:
 *         description: Live content fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: object
 *                   description: Current live content
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (only teacher can access)
 */
router.get("/live", subjectBasedLiveRotation);
module.exports = router;
