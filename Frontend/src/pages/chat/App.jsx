import axios from "../../api/axios.js"
import { useEffect, useState } from "react";
import styles from "./App.module.css"
import UserBar from "./components/userbar/UserBar.jsx";
import UserMessage from "./components/usermessage/UserMessage.jsx";
import { useSelector } from "react-redux";
import socket from "../../api/socket.js";

const Home = () => {

    const [userList, setUserList] = useState([])
    const userId = useSelector((state) => state.user.userId);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const fetchUsers = async () => {
        try {
            const response = await axios.get("user/friends");
            setUserList(response.data.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, [])

    useEffect(() => {
        if (userId) {
            socket.emit("add-user", userId);
        }

        socket.on("online-users", (users) => {
            setOnlineUsers(users);
        });

        socket.on("typing", ({ from }) => {
            setTypingUsers((prev) => !prev.includes(from) ? [...prev, from] : prev);
        });

        socket.on("stop-typing", ({ from }) => {
            setTypingUsers((prev) => prev.filter((id) => id !== from));
        });

        return () => {
            socket.off("online-users");
            socket.off("typing");
            socket.off("stop-typing");
        };
    }, [userId]);

    return (
        <>
            <div className={styles.maincontainer}>
                <div className={styles.userbar}>
                    <UserBar userList={userList} onlineUsers={onlineUsers} typingUsers={typingUsers} />
                </div>
                <div className={styles.messagebox}>
                    <UserMessage />
                </div>
            </div>
        </>
    )
}
export default Home;