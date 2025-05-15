import styles from "./UserBar.module.css";
import profilePlaceholder from "../../../../assets/profileplaceholder.png";
import { useDispatch, useSelector } from "react-redux";
import { setselectedUser } from "../../../../store/slices/messageSlice";

const UserBar = ({ userList, onlineUsers, typingUsers }) => {

    const dispatch = useDispatch();
    const selectedUser = useSelector((state) => state.message.selectedUser);

    const handleClick = async (userid) => {
        try {
            console.log(userid);
            await dispatch(setselectedUser(userid));
        } catch (err) {
            console.log("Err in UserBar", err);
        }
    }

    const isOnline = (id) => onlineUsers.includes(id);

    return (
        <>
            <div className={styles.maincontainer}>
                {userList.map((user) => {
                    return (
                        <div className={`${styles.profilecard} ${user?._id == selectedUser ? styles.activeuser : ""} `} key={`${user?._id}`} onClick={() => handleClick(user?._id)}>
                            <div className={styles.imagebox}>
                                <img src={user?.profile || profilePlaceholder} alt="user image" className={styles.profileimg} />
                            </div>
                            <div className={styles.messagebox}>
                                <p>{user?.name}</p>
                                <p className={`${isOnline(user._id) ? styles.onlineuser : ""} `}>{typingUsers.includes(user._id)
                                    ? "Typing..."
                                    : isOnline(user._id) ? "Online" : "Offline"}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default UserBar;