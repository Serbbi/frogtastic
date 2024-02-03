import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import Login from './components/auth/login';
import Signup from './components/auth/signup';
import AuthProvider from './hooks/AuthProvider';
import Admin from './components/admin/admin';
import PrivateRoute from './components/auth/PrivateRoute';
import { initializeIcons } from './icons/iconLibrary';
import './App.css';


function App() {
  initializeIcons();

  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<PrivateRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
