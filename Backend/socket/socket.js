// /socket/socket.js
const onlineUsers = new Map();

const setupSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected", socket.id);

        socket.on("add-user", (userId) => {
            onlineUsers.set(userId, socket.id);
            io.emit("online-users", Array.from(onlineUsers.keys()));
            // socket.broadcast.emit("online-users", Array.from(onlineUsers.keys()));
        });

        socket.on("send-message", ({ to, message }) => {
            const receiverSocketId = onlineUsers.get(to);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receive-message", { message });
            }
        });

        socket.on("typing", ({ to, from }) => {
            const receiverSocketId = onlineUsers.get(to);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("typing", { from });
            }
        });

        socket.on("stop-typing", ({ to, from }) => {
            const receiverSocketId = onlineUsers.get(to);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("stop-typing", { from });
            }
        });

        socket.on("disconnect", () => {
            for (let [userId, sockId] of onlineUsers.entries()) {
                if (sockId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }
            io.emit("online-users", Array.from(onlineUsers.keys()));
            console.log("User disconnected", socket.id);
        });
    });
};

export default setupSocket;