import bcrypt from "bcrypt";
import User from '../model/userSchema.js';
import jwt from "jsonwebtoken";


const register = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({ message: "Name is required" });
        }
        if (!email?.trim()) {
            return res.status(400).json({ message: "Email is required" });
        }
        if (!password?.trim()) {
            return res.status(400).json({ message: "Password is Reqiired" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Email is already registerd" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name, email, password: hashPassword
        })

        await user.save();

        return res.status(201).json({ message: "User Registered Successfully" });


    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Something Went Wrong" });
    }

}

const login = async (req, res) => {

    try {
        const { email, password } = req.body;


        if (!email?.trim()) {
            return res.status(400).json({ message: "Email is required" });
        }
        if (!password?.trim()) {
            return res.status(400).json({ message: "Password is Reqiired" });
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({ message: "User not found" });
        }

        const hashPassword = await bcrypt.compare(password, existingUser.password);

        if (!hashPassword) {
            return res.status(400).json({ message: "Password do not match" });
        }

        const assesToken = await jwt.sign({ userId: existingUser?._id }, process.env.JWT_TOKEN_KEY, {
            expiresIn: "1min"
        })


        const refreshToken = await jwt.sign({ userId: existingUser?._id }, process.env.JWT_TOKEN_KEY, {
            expiresIn: "30d"
        })

        res.cookie("refreshToken", refreshToken,
            {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 30 * 24 * 60 * 60 * 1000,
                path: "/"
            }
        )

        const user = {
            name: existingUser?.name,
            email: existingUser?.email,
            token: assesToken,
            userId: existingUser?._id,
        }

        return res.status(201).json({ message: "User Login Successfully", user });

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Something Went Wrong" });
    }

}

const refreshToken = async (req, res) => {

    try {
        const token = req?.cookies?.refreshToken;

        if (!token) {
            return res.status(401).json({ message: "Refresh Token Not Found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY);

        const existingUser = await User.findOne({ _id: decoded?.userId });

        if (!existingUser) {
            return res.status(401).json({ message: "User not found" });
        }

        const assesToken = await jwt.sign({ userId: existingUser?._id }, process.env.JWT_TOKEN_KEY, {
            expiresIn: "15min"
        })
        // console.log("assesToken",assesToken);
        return res.status(200).json({ token: assesToken });

    } catch (err) {
        console.log(err)
        return res.status(401).json({ message: "Something Went Wrong" });
    }

}

export { register, login, refreshToken };