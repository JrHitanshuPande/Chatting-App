import User from '../model/userSchema.js'
import jwt from "jsonwebtoken"

const authMiddleware = async (req, res, next) => {
    try {
        const Auth = req.headers.authorization;
        const accessToken = Auth.split(" ")[1];

        const decoded = jwt.verify(accessToken, process.env.JWT_TOKEN_KEY);
        const userId = decoded.userId;
        const user = await User.findOne({ _id: userId });
        if (user) {
            req.user = user
        } else {
            return res.status(401).json({ message: "User Not Found" });
        }
        next();

    } catch (err) {
        return res.status(401).json({ message: "Session Expired" });
    }

}

export default authMiddleware;