const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const register = async (req, res, next) => {
  try {
    console.log("triggered");
    const { name, email, password, role } = req.body;
    console.log(req.body);
    if (!name || !email || !password || !role) {
      const err = new Error("All fields are required");
      err.status = 400;
      return next(err);
    }

    if (!["teacher", "principal"].includes(role)) {
      const err = new Error("Invalid role");
      err.status = 400;
      return next(err);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const err = new Error("User already exists");
      err.status = 400;
      return next(err);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash: hashedPassword,
        role,
      },
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      message: "User registered",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      return next(err);
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
