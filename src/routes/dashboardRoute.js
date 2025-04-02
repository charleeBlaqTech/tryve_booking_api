const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/DashboardController");
const authMiddleWare = require("../middlewares/auth.and.permissions/checkUserWare");


router.route("/").get(authMiddleWare, dashboardController.index);

module.exports = router;
