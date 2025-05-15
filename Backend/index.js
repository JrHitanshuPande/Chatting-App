import express from "express";
import cors from "cors";
import auth from "./routes/authRoutes.js"
import mongoose from "mongoose";
import { config } from "dotenv";
import userRouter from './routes/userRoutes.js'
import cookieParser from "cookie-parser";
import path from "path";
import messageRouter from "./routes/messageRoute.js";
import { createServer } from "http";
import { Server } from "socket.io";
import setupSocket from "./socket/socket.js"
config();
const app = express();

const corsOption = {
    origin: process.env.FRONTED_URL,
    credentials: true
}

app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
    return res.send("Hello");
})

app.use("/auth", auth);
app.use("/user", userRouter);
app.use("/upload", express.static(path.join(process.cwd(), "/upload")));
app.use("/message", messageRouter);



//Socket Io connection

const httpServer = createServer(app);

const io = new Server(httpServer,
    {
        cors: corsOption,
    }
)
setupSocket(io);
// io.on("connection", (socket) => {
//     console.log("User connected", socket.id);

//     socket.on("disconnect", () => {
//         console.log("User disconnected", socket.id);
//     })
// })

httpServer.listen(4000, async () => {
    try {

        console.log("Server started");
        console.log(process.env.JWT_TOKEN_KEY)
        await mongoose.connect(process.env.MONGDODB_URL, { dbName: "HitApp" });
    } catch (err) {
        console.log(err);
    }
}
)