import { useState } from "react";
import Loading from "../miniComponents/loading";
import './AllUsersContent.css';
import UserDetailsContent from "./UserDetailsContent";
import useAllUsers from "../../hooks/useAllUsers";

export default function AllUsersContent() {
    const [chosenUser, setChosenUser] = useState(null);
    const { users, isLoading } = useAllUsers();

    function handleUserClick(id) {
        setChosenUser(id);
    }

    function goBackAction() {
        setChosenUser(null);
    }

    if (chosenUser) return <UserDetailsContent id={chosenUser} goBackAction={goBackAction}/>;

    if (isLoading) return <Loading />;

    const userRows = [];
    if(users) {
        for (let i = 0; i < users.length; i += 3) {
            userRows.push(users.slice(i, i + 3));
        }
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