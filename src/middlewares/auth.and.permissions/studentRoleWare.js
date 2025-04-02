const jwt = require("jsonwebtoken")
const status = require("../../utils/status.constants")
const { check_if_user_exist_with_id } = require("../../utils/userExist")
const { role } = require("../../utils/user.roles.constant")

const authenticateStudent = async (req, res, next) => {
    const secret = process.env.SECRET_STRING;
    if (req.headers['authorization']) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(" ")[1]
        if (!token) {
            res.status(status.HTTP_401_UNAUTHORIZED).json({ status: 401, message: "No token provided" })
        }
        jwt.verify(token, secret, async (err, payload) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(status?.HTTP_401_UNAUTHORIZED).json({ status: 401, message: "Token has expired" })
                }
                return res.status(status?.HTTP_403_FORBIDDEN).json({ status: 403, message: "Invalid token" })
            }

            const foundUser = await check_if_user_exist_with_id(payload?.userId)
            if (!foundUser) {
                res?.status(status?.HTTP_404_NOT_FOUND).json({
                    status: 404,
                    message: "Token not valid or user not found."
                })
            }

            if (foundUser.role !== role.STUDENT) {
                res.status(status.HTTP_401_UNAUTHORIZED).json({ status: 401, message: "You are not authorized to perform this request." })
            } else {
                req.user = payload.userId
                next();
            }
        });
    } else {
        res.status(status.HTTP_403_FORBIDDEN).json({ status: 403, message: "You are not authorized, Only a student can access this route." })
    }
}
module.exports = authenticateStudent 