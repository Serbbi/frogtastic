import { useState, useEffect } from "react";

export default function AllFrogsContent() {
    const [frogs, setFrogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchAllFrogs() {
            // const response = await fetch("http://localhost:8000/frogs");
            // const data = await response.json();
            // setFrogs(data);
            setIsLoading(false);
            // console.log(data);
        }
        fetchAllFrogs();
    }, []);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="allFrogsContainer">
            <h1>All Frogs</h1>
        </div>
    );
}