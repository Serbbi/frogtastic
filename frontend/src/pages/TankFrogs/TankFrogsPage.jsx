import { useState, useEffect } from 'react';
import FrogTable from '../../components/miniComponents/FrogTable';
import useFrogs from '../../hooks/useFrogs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useTanks from '../../hooks/useTanks';
import FrogTableLoading from '../../components/miniComponents/FrogTableLoading';
import { frogDownloadRequest } from '../../services/api/frogs/FrogDownload';
import { useNotification } from '../../services/providers/NotificationProvider';
import './TankFrogsPage.css';

export default function TankFrogsPage({ organization }) {
    const { tanks } = useTanks(organization ? organization.id : -1);
    const [selectedNumber, setSelectedNumber] = useState(localStorage.getItem('selectedTankNumber') || null);
    const { frogs, isLoading } = useFrogs(null, organization ? organization.id : -1, selectedNumber, null);
    const { addNotification } = useNotification();
    const [tankStatus, setTankStatus] = useState(false);

    useEffect(() => {
        if (frogs) {
            setTankStatus(frogs.some(frog => frog.attributes["is_sick"]));
        }
    }, [frogs]);

    useEffect(() => {
        if (tanks && tanks.length > 0) {
            setSelectedNumber(tanks[0].id);
        }
    }, [tanks]);

    function handleNumberChange(event) {
        setSelectedNumber(parseInt(event.target.value));
        localStorage.setItem('selectedTankNumber', event.target.value);
    };

    const handleDownload = () => {
        frogDownloadRequest(organization.id, selectedNumber)
            .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement("a");
                link.href = url;
                link.download = `frogs_${tanks.filter(tank => tank.id === selectedNumber)[0].tank_name}.csv`;
                document.body.appendChild(link);

                link.click();

                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error('Download error:', error);
                addNotification({ text: "Error downloading file", type: "error" });
            });
    };

    return (
        <div className="tankFrogsContent">
            <div className="titleAndSelect">
                <h1 className='title'>Tank Frogs
                    {!tankStatus ? <FontAwesomeIcon icon="fa-solid fa-circle-check" className="okStatus" />
                        : <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" className="sickStatus" />}
                </h1>
                <select id="numberSelect" value={selectedNumber} onChange={handleNumberChange} className='selectButton'>
                    {tanks && tanks.map(tank => {
                        return <option key={tank.tank_name} value={tank.id}>{tank.tank_name}</option>
                    })}
                </select>
            </div>
            {isLoading || frogs === undefined ? <FrogTableLoading organization={organization} /> : null}
            {frogs && frogs.length !== 0 && <FrogTable frogs={frogs} organization={organization} />}
            <button onClick={handleDownload}>Download</button>
        </div>
    );
}