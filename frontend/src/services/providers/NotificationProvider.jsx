import { createContext, useState, useContext, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export default function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback( async(notification) => {
    setNotifications((prevNotifications) => [...prevNotifications, { ...notification, id: uuidv4()}]);
  }, []);

  const removeNotification = useCallback( async(id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  }, []);

return useMemo(() => (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
        {children}
    </NotificationContext.Provider>
), [notifications, addNotification, removeNotification, children]);
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired
};
