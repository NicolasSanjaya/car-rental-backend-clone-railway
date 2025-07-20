const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController.js");
const {
  authenticateToken,
  isAdmin,
} = require("../middleware/authMiddleware.js");
const upload = require("../middleware/uploadMiddleware.js");

router.post(
  "/cars",
  authenticateToken,
  isAdmin,
  upload.single("image"),
  adminController.addCars
);
router.put(
  "/cars/:id",
  authenticateToken,
  isAdmin,
  upload.single("image"),
  adminController.updateCars
);
// PATCH /api/admin/cars/:id/availability - Toggle car availability (admin only)
router.patch(
  "/cars/:id/availability",
  authenticateToken,
  isAdmin,
  upload.single("image"),
  adminController.updateCarsAvailability
);
router.delete(
  "/cars/:id",
  authenticateToken,
  isAdmin,
  adminController.deleteCars
);
router.get("/stats", authenticateToken, isAdmin, adminController.getStats);

// Bookings
router.get("/bookings", authenticateToken, adminController.getAllBookings);
router.put(
  "/bookings/:id/status",
  authenticateToken,
  isAdmin,
  adminController.updateBookings
);
router.delete(
  "/bookings/:id",
  authenticateToken,
  isAdmin,
  adminController.deleteBookings
);

module.exports = router;
