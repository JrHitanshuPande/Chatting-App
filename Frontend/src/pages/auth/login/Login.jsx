import styles from "./Login.module.css"
import { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { login } from "../../../store/slices/userSlice"
import { useNavigate, NavLink } from "react-router-dom";

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const [errorData, setRrrorData] = useState({
        email: "",
        password: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, formData, {
                withCredentials: true
            });
            console.log("response", response);
            dispatch(login(response.data.user));
            navigate("/");
        } catch (err) {
            console.log("Error in Err", err)
            toast.error(err.response?.data?.message || "Something went wrong");
        }

    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.formcontainer}>
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div>
                            <input type="email" placeholder="Enter your email" name="email" onChange={handleChange} />
                            {errorData.email ? <p>{errorData.email}</p> : ""}
                        </div>
                        <div>
                            <input type="password" placeholder="Enter your password" name="password" onChange={handleChange} />
                            {errorData.password ? <p>{errorData.password}</p> : ""}
                        </div>
                        <button type="submit">Continue</button>
                    </form>
                    <p>Don't have account?</p>
                    <NavLink to="/register" className={styles.link}><p>Register here</p></NavLink>
                </div>
            </div>
        </>
    )
}

export default Login;