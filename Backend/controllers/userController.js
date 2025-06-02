import { fileURLToPath } from "url";
import User from "../model/userSchema.js"
import fs from "fs"
import { v4 as uudiv4 } from "uuid";

const userDetail = async (req, res) => {
    try {
        const userId = req.user._id;
        if (userId) {
            const userData = await User.findOne({ _id: userId }).select("-password");

            if (!userData) {
                return res.status(401).json({ message: "User not found" });
            }
            return res.status(200).json({ userData });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something Went Wrong" });
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const { dob } = req.body;

        let filepath = "";


        if (req?.file) {
            const filename = `upload/${uudiv4()}-${req.file.originalname}`;

            await fs.promises.writeFile(filename, req?.file?.buffer, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("File uploaded");
                }
            });
            filepath = `${process.env.BACKEND_URL}/${filename}`;
        }

        const userData = await User.findOne({ _id: userId }).select("-password");
        if (!userData) {
            return res.status(401).json({ message: "User not found" });
        }

        userData.dob = dob;

        if (filepath) {

            if (userData?.profile) {
                const path = (userData.profile)?.split('/').pop();
                if (fs.existsSync(`upload/${path}`)) {
                    await fs.promises.unlink(`upload/${path}`)
                }
            }
            userData.profile = filepath;
        }


        await userData.save();


        return res.status(200).json({ userData });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something Went Wrong" });
    }
}

const getAllUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const userData = await User.find({ _id: { $ne: userId } }).select("-password");
        // const userData = await User.find().select("-password");

        if (!userData) {
            return res.status(401).json({ data: [] });
        }

        return res.status(200).json({ data: userData });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something Went Wrong" });
    }
}


export { userDetail, updateUser, getAllUser };