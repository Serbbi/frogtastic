import React from "react"
import { useNavigate } from "react-router-dom";

function Home(props) {
    const { loggedIn, email } = props

    return <div className="mainContainer">
        <div className={"titleContainer"}>
            <div>Welcome!</div>
        </div>
        <div>
            This is the home page.
        </div>
    </div>
}

export default Home