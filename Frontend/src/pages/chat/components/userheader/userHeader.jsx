import { useEffect } from "react";
import { useState } from "react";

const userHeader = ({ selecteduser }) => {

    const [count, setCount] = useState(0);

    useEffect(() => {
        setCount(0)
        let interval = setInterval(() => {
            setCount((prev) => prev + 1);
        }, 1000)

        return () => {
            clearInterval(interval);
        }
    }, [selecteduser])

    return (
        <>
            <div>
                Timer: {count}
            </div>
        </>
    )
}


export default userHeader;