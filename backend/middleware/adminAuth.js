const adminAuth = (req, res, next) => {
  try {
    // req.user must be set by your authentication middleware (JWT decode etc.)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: Please log in" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    next(); // Allow request to continue
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// router.get("/admin-data", jwtAuth, adminAuth, (req, res) => {
//   res.json({ message: "Welcome Admin!" });
// });

module.exports = adminAuth;



//cusor .io