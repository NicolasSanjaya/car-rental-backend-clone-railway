const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const headerToken = authHeader && authHeader.split(" ")[1];

  const token = req.cookies?.token;

  console.log({ headerToken });
  console.log({ token });

  if (!token && !headerToken) {
    return res
      .status(401)
      .json({ success: false, message: "Access token is required" });
  }

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ success: false, message: "Invalid or expired token" });
      }
      req.user = user; // Simpan payload token (misal: {id, email}) di req.user
      next();
    });
  } else if (headerToken) {
    jwt.verify(headerToken, JWT_SECRET, (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ success: false, message: "Invalid or expired token" });
      }
      req.user = user; // Simpan payload token (misal: {id, email}) di req.user
      next();
    });
  }
};

// Middleware untuk cek role admin
exports.isAdmin = (req, res, next) => {
  // Diasumsikan role ada di payload token, atau query dari DB
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
};
