import { BrowserRouter, Routes, Route } from 'react-router-dom';
//import LoginPage from './components/LoginPage';
import UserPage from './pages/UserPage';

import HomePage from './pages/HomePage';
import RegisterPage from './components/RegisterPage';

import AdminHome from './pages/admin/AdminHome';
import MealManagement from './pages/admin/MealManagement';
import Orders from './pages/admin/Orders';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user" element={<UserPage/>}/>

        <Route path="/register" element={<RegisterPage/>}/>

        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/meals" element={<MealManagement />} />
        <Route path="/admin/orders" element={<Orders />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
