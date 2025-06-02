import styles from "./Welcome.module.css";

const Welcome = () => {
    return (
        <>
            <div className={styles.maincontainer} >
                <h1 className={styles.maintitle}>Welcome To Chatify</h1>
            </div>
        </>
    )
}

export default Welcome;