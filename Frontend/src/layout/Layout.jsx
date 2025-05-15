import styles from "./Layout.module.css"
import { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"
import socket from "../api/socket";
import { logout } from "../store/slices/userSlice";

const Layout = () => {
    const isAuthorized = useSelector((state) => state.user.token);
    const userId = useSelector((state) => state.user.userId);
    const dispatch = useDispatch();
    useEffect(() => {
        if (isAuthorized) {
            socket.connect();
        }

         if (userId) {
            socket.emit("add-user", userId);
        }
        
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <>
            <div className={styles.maincontainer}>
                <div className={styles.header}>
                    <div className={styles.logo}>Chatting App</div>
                    <div className={styles.menu}>
                        <ul>
                            <li><NavLink to="/" className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.active}` : styles.link
                            }>Chat</NavLink></li>
                            <li><NavLink to="/profile" className={({ isActive }) =>
                                isActive ? `${styles.link} ${styles.active}` : styles.link
                            }>Profile</NavLink></li>
                            <li onClick={() => {
                                console.log("Logout");
                                dispatch(logout())
                            }} style={{ cursor: "pointer" }}>Logout</li>
                        </ul>
                    </div>
                </div>
                <div className={styles.container}>
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default Layout;