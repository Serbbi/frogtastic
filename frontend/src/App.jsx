import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import Login from './components/auth/login';
import Signup from './components/auth/signup';
import AuthProvider from './hooks/AuthProvider';
import Admin from './components/admin/admin';
import PrivateRoute from './components/auth/PrivateRoute';
import { initializeIcons } from './util/iconLibrary';
import './App.css';
import NotificationProvider from './hooks/NotificationProvider';
import NotificationList from './components/miniComponents/NotificationList';
import { OrganizationProvider } from './hooks/OrganizationProvider';


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
                    <Route path="/home" element={<Home />} />
                    <Route path="/admin" element={<Admin />} />
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
