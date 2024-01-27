import React from "react"
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    function goToAdminPage() {
        navigate("/admin");
    }

    return <div className="mainContainer">
        <div className={"titleContainer"}>
            <div>Welcome!</div>
        </div>
        <div>
            This is the home page.
        </div>
        <button onClick={goToAdminPage}>Login</button>
    </div>
}

export default Home