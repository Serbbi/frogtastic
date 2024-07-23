import './LeftSideBar.css';

export default function LeftSideBar({ setContent }) {

    function changeContent(name) {
        return function () {
            const newContent = {
                allFrogs: false,
                tankFrogs: false,
                uploadImage: false,
                createFrog: false
            };
            newContent[name] = true;
            setContent(newContent);
        }
    }

    return (
        <div className="leftBar">
            <ul className='menuList'>
                <li onClick={changeContent("allFrogs")}>All Frogs</li>
                <li onClick={changeContent("tankFrogs")}>Tank Frogs</li>
                <li onClick={changeContent("uploadImage")}>Upload Image</li>
                <li onClick={changeContent("createFrog")}>Create Frog</li>
            </ul>
            <hr></hr>
            <ul className='menuList'>
                <li onClick={changeContent("joinOrganization")}>Join Organization</li>
                <li onClick={changeContent("createOrganization")}>Create Organization</li>
                <li onClick={changeContent("organizationSettings")}>Organization Settings</li>
            </ul>
        </div>
    );
}