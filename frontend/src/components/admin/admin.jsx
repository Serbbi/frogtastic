export default function Admin() {
    function getUsers() {
        const token = localStorage.getItem('site');
        fetch('http://localhost:8000/users', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    return (
        <div>
            <h1>Admin</h1>
            <button onClick={getUsers}>get users</button>
        </div>
    );
}