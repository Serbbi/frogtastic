import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNotification } from '../../services/providers/NotificationProvider';
import { organizationPutLogo } from '../../services/api/organizations/OrganizationPut';

export default function LogoSetting({ organization }) {
    const [orgLogoSrc, setOrgLogoSrc] = useState(`https://storage.googleapis.com/cool_frog_bucket/organization-pics/${organization?.id}.jpeg`);
    const fileInputRef = useRef(null);
    const { addNotification } = useNotification();

    useEffect(() => {
        if (organization) {
            setOrgLogoSrc(`https://storage.googleapis.com/cool_frog_bucket/organization-pics/${organization.id}.jpeg`);
        }
    }, [organization]);

    const handleClickEdit = () => {
        fileInputRef.current?.click();
    };

    const handleChangeLogo = (event) => {
        const file = event.target.files[0];
        if (file) {
            organizationPutLogo(organization.id, file)
                .then(() => {
                    window.location.reload();
                    addNotification({ text: 'Logo updated successfully', type: 'success' });
                })
                .catch(() => {
                    addNotification({ text: 'Failed to update logo', type: 'error' });
                });
        }
    }

    return (
        <div className='settingContainer'>
            <h3>Logo</h3>
            <div className={"logoPhotoContainer"}>
                <img src={orgLogoSrc} alt="Organization Logo" onError={() => setOrgLogoSrc("/org_default_logo.png")} className={"logoInput"} />
                <span className={"logoHover"} onClick={handleClickEdit}><FontAwesomeIcon icon="fa-solid fa-screwdriver-wrench" className='profileEditIcon' /></span>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleChangeLogo} className={"logoInput"} style={{ display: "none" }} />
            </div>
        </div>
    );
}
