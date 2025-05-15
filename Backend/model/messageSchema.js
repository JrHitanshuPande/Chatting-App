import mongoose from "mongoose";


const messageSchema = mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user"
        },
        recieverId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user"
        },
        message: {
            type: String,
            required: true,
        },
        date:
        {
            type: Date,
            required: true,
        }
    },
    {
        timestamps: true
    }
)


const messageModel = mongoose.model("messages", messageSchema);

export default messageModel;