import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNotification } from '../../services/providers/NotificationProvider';
import { organizationPutLogo } from '../../services/api/organizations/OrganizationPut';

export default function LogoSetting({ organization }) {
    const [orgLogoSrc, setOrgLogoSrc] = useState(`https://storage.googleapis.com/${process.env.REACT_APP_GCS_ORG_LOGOS_LOCATION}/${organization?.id}.jpeg`);
    const fileInputRef = useRef(null);
    const { addNotification } = useNotification();

    useEffect(() => {
        if (organization) {
            setOrgLogoSrc(`https://storage.googleapis.com/${process.env.REACT_APP_GCS_ORG_LOGOS_LOCATION}/${organization.id}.jpeg`);
        }
    }, [organization]);

    const handleClickEdit = () => {
        fileInputRef.current?.click();
    };

    const handleChangeLogo = (event) => {
        if (organization === null) return;
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
        <>
            <p className='info-message'>Click on the logo to edit it</p>
            <div className="logo-photo-container">
                <img src={orgLogoSrc} alt="Organization Logo" onError={() => setOrgLogoSrc("/org_default_logo.png")} className="logo-input" />
                <span className={"logo-hover"} onClick={handleClickEdit}><FontAwesomeIcon icon="fa-solid fa-screwdriver-wrench" className='profileEditIcon' /></span>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleChangeLogo} className={"logo-input"} style={{ display: "none" }} />
            </div>
        </>
    );
}
