import { useState, useEffect, useRef } from "react";
import axios from "../../api/axios";
import styles from "./App.module.css";

const Profile = () => {

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        profile: "#",
        dob: "",
        selectedFile: "",
        preview: ""
    })

    const inputRef = useRef(null);

    useEffect(() => {

        const userDate = async () => {
            try {
                const response = await axios.get("/user/details");
                const userData = response?.data?.userData
                if (userData) {
                    setUserData({
                        name: userData?.name || "",
                        email: userData?.email || "",
                        profile: userData?.profile || "#",
                        dob: userData?.dob ? userData?.dob?.slice(0, 10) : "",
                    })
                }
                // console.log(response)
            } catch (err) {
                console.log(err);
            }
        }
        userDate();
    }, [])


    const handleChange = (e) => {
        e.preventDefault();
        try {
            const { name, value, files } = e.target;
            if (name == "profile") {
                let previewurl;
                if (files[0]) {
                    previewurl = URL.createObjectURL(files[0]);
                    // console.log('previewurl', previewurl)
                }
                setUserData((prev) => ({ ...prev, "selectedFile": files[0], "preview": previewurl }));
            }
            if (name == "dob") {
                setUserData((prev) => ({ ...prev, [name]: value }));
            }
        } catch (err) {

        }
    }

    const onClick = (e) => {
        inputRef?.current.click();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            formData.append("dob", userData?.dob);
            formData.append("profile", userData?.selectedFile);
            await axios.post("/user/update", formData);
        } catch (err) {

        }
    }
    return (
        <>
            <div className={styles.maincontainer}>
                <div className={styles.container}>
                    <div className={styles.profilecard} >
                        <img src={userData?.preview || userData?.profile} alt="profile image" className={styles.profileimg} onClick={onClick} />
                        <input type="file" name="profile" ref={inputRef} onChange={handleChange} style={{ display: "none" }} />
                        <input disabled value={userData?.name} />
                        <input disabled value={userData?.email} />
                        <input type="date" name="dob" value={userData?.dob} onChange={handleChange} />
                        <button onClick={handleSubmit}>Save</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;