import MessageSchema from "../model/messageSchema.js"
import User from "../model/userSchema.js"

const sendMessage = async (req, res) => {
    try {
        // console.log("I am in Send Message")
        const { receiverId, message } = req.body;

        const userId = req.user._id;

        const sender = await User.findOne({ _id: userId });
        const receiver = await User.findOne({ _id: receiverId });

        if (!sender) {
            return res.status(401).json({ message: "User not found" });
        }
        if (!receiver) {
            return res.status(401).json({ message: "User not found" });
        }

        let cleanMessage = "";

        if (message) {
            cleanMessage = message?.trim();
        }


        const dateTime = new Date();

        const userMessage = new MessageSchema(
            {
                senderId: sender._id,
                recieverId: receiver._id,
                message: cleanMessage,
                date: dateTime
            }
        )

        const messageToSend = await userMessage.save();

        return res.status(200).json({ message: messageToSend });

    } catch (err) {
        console.log("Error in Saving message", err);
        return res.status(500).json({ message: "Something Went Wrong" });
    }
}


const getMessage = async (req, res) => {
    try {
        const { chatuserId } = req.query;
        const userId = req.user._id;

        const sender = await User.findOne({ _id: userId });
        const chatUser = await User.findOne({ _id: chatuserId });

        // console.log("sender, chatUser", sender, chatUser)
        if (!sender) {
            return res.status(401).json({ message: "User not found" });
        }
        if (!chatUser) {
            return res.status(401).json({ message: "User not found" });
        }

        const allMessages = await MessageSchema.find({
            $or: [
                { senderId: sender._id, recieverId: chatUser._id },
                { senderId: chatUser._id, recieverId: sender._id },
            ]
        })

        return res.status(200).json({ allMessages });

    } catch (err) {
        console.log("Error in Saving message", err);
        return res.status(500).json({ message: "Something Went Wrong" });
    }
}

export { sendMessage, getMessage }