import styles from "./UserMessage.module.css";
import axios from "../../../../api/axios";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import socket from "../../../../api/socket";
import Welcome from "../welcomescreen/Welcome"

const UserMessage = () => {

    const selectedUser = useSelector((state) => state.message.selectedUser);
    const userId = useSelector((state) => state.user.userId);
    const [isTyping, setIsTyping] = useState(false);

    const [messages, setMessages] = useState([]);
    const [usermessages, setUserMessages] = useState("");
    const typingRef = useRef(null);
    const scrollRef = useRef(null);

    const fetchMessages = async () => {
        try {
            const allMessage = await axios.get("/message/get",
                {
                    params: {
                        chatuserId: selectedUser,
                    }
                }
            )
            setMessages(allMessage.data.allMessages);
        } catch (err) {

        }
    }

    useEffect(() => {
        fetchMessages();
        socket.on("receive-message", ({ message }) => {
            if (
                message.senderId === selectedUser ||
                message.receiverId === selectedUser
            ) {
                setMessages(prev => [...prev, message]);
            }
        });
        return () => {
            socket.off("receive-message");
        };

    }, [selectedUser])

    useEffect(() => {
        scrollDown();
    }, [messages])

    const handleOnChange = (e) => {
        try {
            const { name, value } = e.target;
            if (name == "usermessage") {
                setUserMessages(value);

                if (!isTyping) {
                    setIsTyping(true);
                    socket.emit("typing", { to: selectedUser, from: userId });
                }

                clearTimeout(typingRef.current);
                typingRef.current = setTimeout(() => {
                    setIsTyping(false);
                    socket.emit("stop-typing", { to: selectedUser, from: userId });
                }, 1000);
            }
        } catch (err) {
            console.log("Erron in UserMessage", err)
        }
    }

    const scrollDown = () => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (!usermessages) return;
            if (!selectedUser?.trim()) return;
            const response = await axios.post("message/send",
                {
                    receiverId: selectedUser,
                    message: usermessages,
                }
            )
            const newMessage = response.data.message;
            socket.emit("send-message", {
                to: selectedUser,
                message: newMessage,
            });
            setUserMessages("");
            fetchMessages();
            // scrollDown();
        } catch (err) {
            console.log("Error: Message Not Sending")
        }
    }

    return (
        <>
            {selectedUser ? <div className={styles.maincontainer}>
                <div className={styles.messagebody} >
                    {messages.length > 0 ? messages?.map((message) => {
                        return (
                            <div key={message?._id} className={`${styles.messagebox} ${selectedUser == message.senderId ? styles.messagetextleft : styles.messagetextright}`}>
                                <div className={styles.messageinnerbox} >
                                    <p className={styles.message}> {message?.message}</p>
                                    <p className={`${styles.date} ${selectedUser == message.senderId ? styles.messagetextleft : styles.messagetextright}`} >{message?.createdAt && new Date(message.createdAt).toLocaleTimeString()} </p>
                                </div>
                            </div>
                        )
                    }) :
                        <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100%"}}>
                            <h1 style={{color:"black", fontSize:"2rem"}}>Start Messaging</h1>
                        </div>
                    }
                    <div ref={scrollRef} style={{ margin: "0px", padding: "0px" }} />
                </div>
                <form className={styles.inputcontainer} onSubmit={handleSubmit}>
                    <input type="text" placeholder="Send Message" value={usermessages} name="usermessage" onChange={handleOnChange} />
                    <button >Send</button>
                </form>
            </div>
                :
                <Welcome />
            }

        </>
    )
}

export default UserMessage;