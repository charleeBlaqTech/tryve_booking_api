const jwt = require("jsonwebtoken")
const status = require("../../utils/status.constants")
const { role } = require("../../utils/user.roles.constant")
const { check_if_user_exist_with_id } = require("../../utils/userExist")

const secret = process.env.SECRET_STRING
const authenticateInstructor = async (req, res, next) => {
    if (req.headers["authorization"]) {
        const authHeader = req.headers["authorization"]
        const token = authHeader && authHeader.split(" ")[1]
        if (!token) {
            res.status(status.HTTP_404_NOT_FOUND).json({ status: 404, message: "Token not found" })
        }
        jwt.verify(token, secret, async (err, payload) => {
            if (err) {
                if (err.name == "TokenExpiredError") {
                    res.status(status.HTTP_401_UNAUTHORIZED).json({ status: 401, message: "Token has expired" })
                }
                res.status(status.HTTP_403_FORBIDDEN).json({ status: 403, message: "Invalid Token" })
            }
            const foundUser = await check_if_user_exist_with_id(payload?.userId)
            if (!foundUser) {
                res?.status(status?.HTTP_404_NOT_FOUND).json({ status: 404, message: "Token not valid or user token not found" })
            }

            if (foundUser.role != role.TUTOR) {
                res?.status(status.HTTP_401_UNAUTHORIZED).json({ status: 401, message: "You are not authorized to perform this request" })
            } else {
                req.user = payload?.userId
                next()
            }
        });
    } else {
        res.status(status.HTTP_401_UNAUTHORIZED).json({ status: 401, message: "You are not authorized. Only instructor can access this route." })
    }
}

module.exports = authenticateInstructor