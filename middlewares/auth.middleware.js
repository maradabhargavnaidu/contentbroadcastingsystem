const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("Unauthorized");
      error.status = 401;
      return next(error);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    err.status = 401;
    next(err);
  }
};

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    try {
      const allowedRoles = roles.flat();

      if (!req.user || !allowedRoles.includes(req.user.role)) {
        const error = new Error("Forbidden: You don't have permission");
        error.status = 403;
        return next(error);
      }

      next();
    } catch (err) {
      err.status = 500;
      next(err);
    }
  };
};
module.exports = { authenticateUser, authorizeRole };
