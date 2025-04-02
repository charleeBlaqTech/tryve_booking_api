const User = require("../models/userModel"); 
const status = require("../utils/status.constants");

class AdminController{
    static async getAllUsers(req, res){ 
    
        try { 
            const users = await User.find().select("-password"); 
            res.status(200).json({data:users}); 
        } catch (error) { 
            res.status(500).json({ message: "Error fetching users", error }); 
        } 
    }; 
    
    static async updateUserRole(req, res){ 
        try { 
            const { role } = req.body; 
            if (!["user", "admin"].includes(role)) 
                return res.status(400).json({ message: "Invalid role" });
    
            const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password"); 
            
            if (!user) return res.status(404).json({ message: "User not found" }); 
            
            res.status(200).json({ message: "User role updated", data: user }); 
        } catch (error) { 
            res.status(500).json({ message: "Error updating user role", error }); 
        } 
    };
    
    static async deleteUser(req, res){ 
        try { 
            const user = await User.findByIdAndDelete(req.params.id); 
            if (!user) return res.status(404).json({ message: "User not found" });
             
            res.status(200).json({ message: "User deleted successfully" }); 
        } catch (error) { 
            res.status(500).json({ message: "Error deleting user", error }); 
        } 
    };
}


module.exports = AdminController