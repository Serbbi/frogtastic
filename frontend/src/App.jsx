import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import AuthProvider from './services/providers/AuthProvider';
import PrivateRoute from './pages/Auth/PrivateRoute';
import { initializeIcons } from './util/iconLibrary';
import NotificationProvider from './services/providers/NotificationProvider';
import NotificationList from './components/miniComponents/NotificationList';
import { OrganizationProvider } from './services/providers/OrganizationProvider';
import './App.css';


function App() {
  initializeIcons();

  return (
    <div className="App">
      <BrowserRouter>
        <NotificationProvider>
          <AuthProvider>
            <OrganizationProvider>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/home/*" element={<HomePage />} />
                </Route>
              </Routes>
            </OrganizationProvider>
          </AuthProvider>
          <NotificationList />
        </NotificationProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
