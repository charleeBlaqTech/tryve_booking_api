const express = require("express"); 
const AdminController = require("../controllers/AdminController");
const adminMiddleWare = require("../middlewares/auth.and.permissions/adminRoleWare");
const authMiddleWare = require("../middlewares/auth.and.permissions/authWare");
const router = express.Router(); 

router.get("/users", authMiddleWare, adminMiddleWare, AdminController.getAllUsers); 
router.put("/users/:id",authMiddleWare, adminMiddleWare, AdminController.updateUserRole); 
router.delete("/users/:id", authMiddleWare, adminMiddleWare, AdminController.deleteUser); 



module.exports = router;