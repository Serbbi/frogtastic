import { useEffect, useState } from "react";
import Loading from "../miniComponents/loading";
import './AllUsersContent.css';
import UserDetailsContent from "./UserDetailsContent";

export default function AllUsersContent() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [chosenUser, setChosenUser] = useState(null);
    const token = localStorage.getItem('site');

    useEffect(() => {
        fetch('http://localhost:8000/users', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                setUsers(data);
                setIsLoading(false);
                console.log(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    function handleUserClick(id) {
        setChosenUser(id);
    }

    function goBackAction() {
        setChosenUser(null);
    }

    if (chosenUser) return <UserDetailsContent id={chosenUser} goBackAction={goBackAction}/>;

    if (isLoading) return <Loading />;

    const userRows = [];
    for (let i = 0; i < users.length; i += 3) {
        userRows.push(users.slice(i, i + 3));
    }

    return (
        <div>
            <table className="userTable">
                <tbody>
                    {userRows.map((userRow, rowIndex) => (
                        <tr key={rowIndex} className="userTableRow">
                            {userRow.map(user => (
                                <td key={user.id} className="userCell" onClick={() => handleUserClick(user.id)}>{user.username}</td>
                            ))}
                            {userRow.length < 3 && <td></td>}
                            {userRow.length < 2 && <td></td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}