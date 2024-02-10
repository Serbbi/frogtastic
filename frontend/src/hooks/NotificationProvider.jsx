import { createContext, useState, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export default function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    setNotifications((prevNotifications) => [...prevNotifications, notification]);
  };

  const removeNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

return useMemo(() => (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
        {children}
    </NotificationContext.Provider>
), [notifications, addNotification, removeNotification, children]);
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired
};
