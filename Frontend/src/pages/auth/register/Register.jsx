import styles from "./Register.module.css"
import { useState} from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate, NavLink } from "react-router-dom";
const Register = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const [errorData, setRrrorData] = useState({
        name: "",
        email: "",
        password: "",
        repassword: ""
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name == "name") {
            let cleanvalue = value?.trim().replace(/\s+/g, " ");
            const wordarry = cleanvalue.split(" ");
            const wordlength = wordarry.length;
            const isnot50char = wordarry.filter((word) => word.length > 50);
            if (wordlength > 10) {
                setRrrorData((prev) =>
                (
                    {
                        ...prev,
                        [name]: "Full name should not be greater than 10 words"
                    }
                ))
            } else if (isnot50char.length > 0) {
                setRrrorData((prev) =>
                (
                    {
                        ...prev,
                        [name]: "Each word should not be greater than 50 characters"
                    }
                ))
            } else {
                setRrrorData((prev) =>
                (
                    {
                        ...prev,
                        [name]: ""
                    }
                ))
            }
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }))
        }

        if (name == "password") {
            console.log("Pass")
            let cleanvalue = value?.trim().replace(/\s+/g, " ");
            const wordarry = cleanvalue.split(" ");
            const wordlength = wordarry[0].length;

            const hasno = /\d/.test(cleanvalue);
            const hasspecialchar = /[!@#$%^&*(),.?":{}|<>]/.test(cleanvalue);

            if (wordlength > 50) {
                setRrrorData((prev) =>
                (
                    {
                        ...prev,
                        [name]: "Password should not be greater than 50 Characters"
                    }
                ))
            } else if (cleanvalue !== value) {
                setRrrorData((prev) =>
                (
                    {
                        ...prev,
                        [name]: "Password should not contain spaces"
                    }
                ))
            } else if (!hasno || !hasspecialchar) {
                setRrrorData((prev) => ({
                    ...prev,
                    [name]: "Password must contain at least one number and one special character"
                }));
            } else {
                setRrrorData((prev) =>
                (
                    {
                        ...prev,
                        [name]: ""
                    }
                ))
            }

            setFormData((prev) => ({
                ...prev,
                [name]: value
            }))
        }
        if (name == "repassword") {
            let cleanvalue = value?.trim().replace(/\s+/g, " ");
            if (cleanvalue != formData.password) {
                setRrrorData((prev) => ({
                    ...prev,
                    [name]: "Password do not match"
                }));
            } else {
                setRrrorData((prev) =>
                (
                    {
                        ...prev,
                        [name]: ""
                    }
                ))
            }

            setFormData((prev) => ({
                ...prev,
                [name]: value
            }))
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, formData);
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        }

    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.formcontainer}>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div>
                            <input type="text" placeholder="Enter your full name" name="name" onChange={handleChange} />
                            {errorData.name ? <p>{errorData.name}</p> : ""}
                        </div>
                        <div>
                            <input type="email" placeholder="Enter your email" name="email" onChange={handleChange} />
                            {errorData.email ? <p>{errorData.email}</p> : ""}
                        </div>
                        <div>
                            <input type="password" placeholder="Enter your password" name="password" onChange={handleChange} />
                            {errorData.password ? <p>{errorData.password}</p> : ""}
                        </div>
                        <div>
                            <input type="repassword" placeholder="Re-enter your password " name="repassword" onChange={handleChange} />
                            {errorData.repassword ? <p>{errorData.repassword}</p> : ""}
                        </div>
                        <button type="submit">Continue</button>
                    </form>
                    <p>Already have account? </p>
                   <NavLink to="/login" className={styles.link}><p>login here</p></NavLink>
                </div>
            </div>
        </>
    )
}

export default Register;