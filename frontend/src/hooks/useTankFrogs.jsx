import PropTypes from 'prop-types';
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function useTankFrogs({ tankId }) {
    const { data, error, isLoading } = useSWR(tankId ? `${process.env.REACT_APP_BACKEND_URL}/frogs/tank/${tankId}` : null, fetcher);
    let tankStatus = false;

    if(data) {
        tankStatus = data.some(frog => frog.attributes["is_sick"]);
    }

    return {
        frogs: data,
        tankStatus,
        isLoading,
        error
    };
}

useTankFrogs.propTypes = {
    tankId: PropTypes.number.isRequired
};